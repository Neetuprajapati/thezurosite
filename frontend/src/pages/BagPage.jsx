import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function BagPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBag();
  }, []);

  const fetchBag = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/bag", {
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

  // 🔼 Quantity increase
  const increaseQty = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setItems(updated);
  };

  // 🔽 Quantity decrease
  const decreaseQty = (id) => {
    const updated = items.map((item) =>
      item.id === id && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    );
    setItems(updated);
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
  };

  // 💰 Total price
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>

      {/* 🔷 HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        background: "#fff",
        borderBottom: "1px solid #ddd"
      }}>
        <button onClick={() => navigate(-1)}>←</button>
        <h3>My Bag 🛒</h3>
        <div>
          <span onClick={() => navigate("/profile")} style={{ marginRight: 10, cursor: "pointer" }}>👤</span>
          <span onClick={() => navigate("/wishlist")} style={{ cursor: "pointer" }}>❤️</span>
        </div>
      </div>

      {/* 🔷 CONTENT */}
      <div style={{ padding: "16px" }}>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <h3>Your bag is empty 😢</h3>
            <button
              onClick={() => navigate("/home")}
              style={{
                padding: "10px 20px",
                background: "#9400D3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} style={{
                background: "#fff",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                display: "flex",
                gap: "12px",
                alignItems: "center"
              }}>
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ margin: "5px 0" }}>₹{item.price}</p>

                  {/* Qty Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "#ff4d4d",
                    border: "none",
                    color: "#fff",
                    padding: "6px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            {/* 💰 PRICE SUMMARY */}
            <div style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              marginTop: "10px"
            }}>
              <h3>Total: ₹{totalPrice}</h3>

              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#9400D3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  marginTop: "10px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}