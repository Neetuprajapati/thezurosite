import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]                 = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage]             = useState("");
  const [selectedSize, setSelectedSize]       = useState("");
  const [quantity, setQuantity]               = useState(1);
  const [adding, setAdding]                   = useState(false);
  const [toast, setToast]                     = useState(null);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.media && data.media.length > 0) {
          const primary =
            data.media.find((img) => img.is_primary)?.media_url ||
            data.media[0].media_url;
          setMainImage(primary);
        }
      })
      .catch((err) => console.log(err));

    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setRelatedProducts(data))
      .catch((err) => console.log(err));
  }, [id]);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // ✅ ADD TO CART — login check + API call
  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }

    setAdding(true);
    try {
      const variantId = product?.variants?.[0]?.id;
      if (!variantId) { showToast("No variant available", "#dc2626"); return; }

      const res = await fetch(`${API}/bag`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId, quantity }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Could not add to cart", "#dc2626");
        return;
      }
      showToast("🛒 Added to Cart!");
    } catch {
      showToast("Something went wrong", "#dc2626");
    } finally {
      setAdding(false);
    }
  };

  // ✅ BUY NOW — add to cart then go to checkout
  const handleBuyNow = async () => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }

    setAdding(true);
    try {
      const variantId = product?.variants?.[0]?.id;
      if (!variantId) { showToast("No variant available", "#dc2626"); return; }

      const res = await fetch(`${API}/bag`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId, quantity }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Error", "#dc2626");
        return;
      }
      navigate("/checkout");
    } catch {
      showToast("Something went wrong", "#dc2626");
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  const discountPct =
    product.base_price && product.sale_price
      ? Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)
      : 0;

  return (
    <>
      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed", top:80, left:"50%", transform:"translateX(-50%)",
          background:toast.color, color:"#fff", padding:"11px 22px",
          borderRadius:8, zIndex:9999, fontSize:14, fontWeight:600,
          boxShadow:"0 4px 12px rgba(0,0,0,0.2)", whiteSpace:"nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:Arial,sans-serif;background:#fff;}
        .product-container{display:flex;gap:50px;padding:40px;flex-wrap:wrap;}
        .left-section{flex:1;display:flex;gap:20px;min-width:300px;}
        .thumbnail-list{display:flex;flex-direction:column;gap:15px;}
        .thumbnail{width:80px;height:80px;object-fit:cover;border-radius:10px;cursor:pointer;border:1px solid #ddd;background:#f5f5f5;}
        .active-thumbnail{border:2px solid #000;}
        .main-image-box{flex:1;background:#f5f5f5;border-radius:20px;overflow:hidden;}
        .main-image{width:100%;height:650px;object-fit:cover;}
        .right-section{flex:1;min-width:320px;}
        .product-title{font-size:36px;font-weight:700;margin-bottom:10px;color:#111;}
        .rating{margin-bottom:20px;color:#444;font-size:15px;}
        .price-box{display:flex;align-items:center;gap:15px;margin-bottom:20px;}
        .sale-price{font-size:34px;font-weight:bold;color:#111;}
        .base-price{font-size:22px;color:#999;text-decoration:line-through;}
        .discount{background:#111;color:#fff;padding:6px 10px;border-radius:6px;font-size:14px;}
        .product-info{color:#555;line-height:1.8;margin-bottom:30px;}
        .section{margin-bottom:30px;}
        .section h3{margin-bottom:15px;font-size:17px;color:#111;}
        .size-list{display:flex;gap:12px;}
        .size-btn{padding:12px 18px;border:1px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:15px;transition:.2s;}
        .size-btn:hover{border-color:#111;}
        .active-size{background:#111;color:#fff;border-color:#111;}
        .quantity-box{display:flex;align-items:center;gap:20px;}
        .qty-btn{width:40px;height:40px;border:none;background:#111;color:#fff;border-radius:10px;font-size:20px;cursor:pointer;}
        .button-group{display:flex;gap:15px;margin-top:30px;}
        .cart-btn,.buy-btn{flex:1;padding:16px;border:none;border-radius:12px;font-size:16px;cursor:pointer;font-weight:600;transition:.2s;}
        .cart-btn{background:#111;color:#fff;}
        .cart-btn:hover{background:#333;}
        .buy-btn{background:#fff;color:#111;border:2px solid #111;}
        .buy-btn:hover{background:#f5f5f5;}
        .cart-btn:disabled,.buy-btn:disabled{opacity:.6;cursor:not-allowed;}
        .login-hint{margin-top:12px;font-size:13px;color:#888;text-align:center;}
        .login-link{color:#111;font-weight:600;cursor:pointer;text-decoration:underline;}
        .details-section{padding:40px;}
        .details-title{font-size:28px;margin-bottom:25px;color:#111;}
        table{width:100%;border-collapse:collapse;}
        table td{border:1px solid #eee;padding:18px;color:#555;}
        table td:first-child{width:250px;font-weight:600;color:#111;background:#fafafa;}
        .related-products-section{padding:40px;}
        .related-heading{font-size:30px;font-weight:700;margin-bottom:30px;color:#111;}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:25px;}
        .related-card{border:1px solid #eee;border-radius:18px;overflow:hidden;cursor:pointer;transition:.3s;background:#fff;}
        .related-card:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(0,0,0,.1);}
        .related-image-box{width:100%;height:280px;background:#f5f5f5;overflow:hidden;}
        .related-image{width:100%;height:100%;object-fit:cover;}
        .related-content{padding:18px;}
        .related-title{font-size:18px;color:#111;margin-bottom:10px;}
        .related-brand{color:#777;margin-bottom:10px;font-size:14px;}
        .related-price{display:flex;align-items:center;gap:10px;}
        .related-sale{font-size:20px;font-weight:700;color:#111;}
        .related-base{color:#999;text-decoration:line-through;}
        @media(max-width:768px){
          .product-container{padding:20px;}
          .left-section{flex-direction:column-reverse;}
          .thumbnail-list{flex-direction:row;}
          .main-image{height:400px;}
          .product-title{font-size:28px;}
          .button-group{flex-direction:column;}
          .details-section,.related-products-section{padding:20px;}
        }
      `}</style>

      {/* PRODUCT SECTION */}
      <div className="product-container">

        {/* LEFT */}
        <div className="left-section">
          <div className="thumbnail-list">
            {product.media?.map((item, index) => (
              <img
                key={index}
                src={item.media_url}
                alt={product.title}
                className={`thumbnail ${mainImage === item.media_url ? "active-thumbnail" : ""}`}
                onClick={() => setMainImage(item.media_url)}
              />
            ))}
          </div>
          <div className="main-image-box">
            <img src={mainImage} alt={product.title} className="main-image" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section">

          <h1 className="product-title">{product.title}</h1>

          <div className="rating">
            ⭐ {product.rating} ({product.review_count} Reviews)
          </div>

          <div className="price-box">
            <span className="sale-price">₹{product.sale_price}</span>
            <span className="base-price">₹{product.base_price}</span>
            {discountPct > 0 && (
              <span className="discount">{discountPct}% OFF</span>
            )}
          </div>

          <div className="product-info">
            <p>Brand : <b>{product.brand}</b></p>
            <p>Category : <b>{product.category}</b></p>
            <p>Status : <b>{product.status}</b></p>
          </div>

          {/* SIZE */}
          <div className="section">
            <h3>Select Size</h3>
            <div className="size-list">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active-size" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="section">
            <h3>Quantity</h3>
            <div className="quantity-box">
              <button className="qty-btn" onClick={decreaseQty}>−</button>
              <span style={{ fontSize:18, fontWeight:600 }}>{quantity}</span>
              <button className="qty-btn" onClick={increaseQty}>+</button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="button-group">
            <button className="cart-btn" onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding..." : "🛒 Add To Cart"}
            </button>
            <button className="buy-btn" onClick={handleBuyNow} disabled={adding}>
              ⚡ Buy Now
            </button>
          </div>

          {/* Login hint — visible only when NOT logged in */}
          {!getToken() && (
            <p className="login-hint">
              Please{" "}
              <span className="login-link" onClick={() => navigate("/login")}>
                login
              </span>{" "}
              to add items to cart
            </p>
          )}

        </div>
      </div>

      {/* PRODUCT DETAILS TABLE */}
      <div className="details-section">
        <h2 className="details-title">Product Details</h2>
        <table>
          <tbody>
            <tr><td>Product Name</td><td>{product.title}</td></tr>
            <tr><td>Brand</td><td>{product.brand}</td></tr>
            <tr><td>Category</td><td>{product.category}</td></tr>
            <tr><td>Rating</td><td>{product.rating}</td></tr>
            <tr><td>Reviews</td><td>{product.review_count}</td></tr>
            <tr><td>Status</td><td>{product.status}</td></tr>
          </tbody>
        </table>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="related-products-section">
        <h2 className="related-heading">Related Products</h2>
        <div className="related-grid">
          {relatedProducts
            ?.filter((item) => item.id !== product.id)
            ?.slice(0, 4)
            ?.map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="related-image-box">
                  <img
                    src={
                      item.media?.find((x) => x.is_primary)?.media_url ||
                      item.media?.[0]?.media_url
                    }
                    alt={item.title}
                    className="related-image"
                  />
                </div>
                <div className="related-content">
                  <h3 className="related-title">{item.title}</h3>
                  <p className="related-brand">{item.brand}</p>
                  <div className="related-price">
                    <span className="related-sale">₹{item.sale_price}</span>
                    <span className="related-base">₹{item.base_price}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

    </>
  );
}