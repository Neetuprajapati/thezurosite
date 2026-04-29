export default function TrackOrders() {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
        <h1>Track Orders</h1>
  
        <p>Enter your Order ID to track your order.</p>
  
        <input type="text" placeholder="Enter Order ID" style={{ padding: 10, width: "100%", marginBottom: 10 }} />
        <button style={{ padding: 10 }}>Track</button>
      </div>
    );
  }