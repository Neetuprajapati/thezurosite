import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";


export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* 🔷 HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#fff",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ←
        </button>

        <h3 style={{ margin: 0 }}>My Wishlist ❤️</h3>

        {/* 🔸 Right Icons */}
        <div style={{ display: "flex", gap: "15px" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>👤</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/wishlist")}>❤️</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/bag")}>🛒</span>
        </div>
      </div>

      {/* 🔷 CONTENT */}
      <div style={{ padding: "16px" }}>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3>No items in wishlist 😢</h3>
            <button
              onClick={() => navigate("/home")}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                border: "none",
                background: "#9400D3",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "16px"
          }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>

                {/* Product Image */}
                <img
                  src={item.image || "https://via.placeholder.com/200"}
                  alt={item.name}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />

                {/* Product Info */}
                <div style={{ padding: "10px" }}>
                  <h4 style={{ margin: "5px 0", fontSize: "14px" }}>
                    {item.name}
                  </h4>

                  <p style={{
                    margin: "5px 0",
                    fontWeight: "bold",
                    color: "#9400D3"
                  }}>
                    ₹{item.price}
                  </p>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button style={{
                      flex: 1,
                      padding: "6px",
                      border: "none",
                      background: "#9400D3",
                      color: "#fff",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}>
                      Add to Cart
                    </button>

                    <button style={{
                      padding: "6px",
                      border: "none",
                      background: "#ff4d4d",
                      color: "#fff",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}>
                      ❌
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}