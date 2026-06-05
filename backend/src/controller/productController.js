const pool = require("../db");

const getProducts = async (req, res) => {
  const primaryQuery = `
    SELECT
      p.id, p.title, p.slug, p.brand,
      p.base_price::float  AS base_price,
      p.sale_price::float  AS sale_price,
      p.rating::float      AS rating,
      p.review_count, p.is_featured, p.status, p.tags,
      COALESCE(c.name, 'OTHER') AS category,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id',         pm.id,
            'media_type', pm.media_type,
            'media_url',  pm.media_url,
            'is_primary', pm.is_primary,
            'sort_order', pm.sort_order
          )
        ) FILTER (WHERE pm.id IS NOT NULL), '[]'
      ) AS media
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_media pm ON pm.product_id = p.id
    WHERE p.status = 'active' AND p.deleted_at IS NULL
    GROUP BY p.id, c.name
    ORDER BY p.created_at DESC
  `;

  const fallbackQuery = `
    SELECT
      p.id,
      COALESCE(p.title, 'Untitled') AS title,
      COALESCE(to_jsonb(p) ->> 'slug', '') AS slug,
      COALESCE(to_jsonb(p) ->> 'brand', '') AS brand,
      NULLIF(to_jsonb(p) ->> 'base_price', '')::float AS base_price,
      NULLIF(to_jsonb(p) ->> 'sale_price', '')::float AS sale_price,
      NULLIF(to_jsonb(p) ->> 'rating', '')::float AS rating,
      COALESCE(NULLIF(to_jsonb(p) ->> 'review_count', ''), '0')::int AS review_count,
      COALESCE(NULLIF(to_jsonb(p) ->> 'is_featured', ''), 'false')::boolean AS is_featured,
      COALESCE(to_jsonb(p) ->> 'status', 'active') AS status,
      COALESCE(to_jsonb(p) -> 'tags', '[]'::jsonb) AS tags,
      COALESCE(to_jsonb(p) ->> 'category', 'OTHER') AS category,
      '[]'::json AS media
    FROM products p
    WHERE COALESCE(to_jsonb(p) ->> 'status', 'active') = 'active'
      AND to_jsonb(p) ->> 'deleted_at' IS NULL
    ORDER BY p.id DESC
  `;

  try {
    const result = await pool.query(primaryQuery);
    res.json(result.rows);
  } catch (err) {
    const isSchemaMismatch = err && (err.code === "42703" || err.code === "42P01");

    if (isSchemaMismatch) {
      try {
        const fallbackResult = await pool.query(fallbackQuery);
        return res.json(fallbackResult.rows);
      } catch (fallbackErr) {
        console.error("[getProducts:fallback] ERROR:", fallbackErr.message);
        return res.status(500).json({ error: fallbackErr.message });
      }
    }

    console.error("[getProducts] ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // product + media
    const prodResult = await pool.query(`
      SELECT
        p.*,
        p.base_price::float  AS base_price,
        p.sale_price::float  AS sale_price,
        p.rating::float      AS rating,
        COALESCE(c.name, 'OTHER') AS category,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id',         pm.id,
              'media_type', pm.media_type,
              'media_url',  pm.media_url,
              'is_primary', pm.is_primary,
              'sort_order', pm.sort_order
            )
          ) FILTER (WHERE pm.id IS NOT NULL), '[]'
        ) AS media
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_media pm ON pm.product_id = p.id
      WHERE p.id = $1 AND p.deleted_at IS NULL
      GROUP BY p.id, c.name
    `, [id]);

    if (prodResult.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const product = prodResult.rows[0];

    // variants separately
    const varResult = await pool.query(`
      SELECT
        id, sku, attributes,
        price_override::float,
        stock_qty, reserved_qty,
        image_url, is_active
      FROM product_variants
      WHERE product_id = $1 AND is_active = true
      ORDER BY created_at ASC
    `, [id]);

    product.variants = varResult.rows;

    // no-cache header so browser doesn't serve 304
    res.set("Cache-Control", "no-store");
    res.json(product);
  } catch (err) {
    console.error("[getProductById] ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts, getProductById };