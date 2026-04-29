import React from "react";
import theme from "./theme";

export default function Terms() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Terms & Conditions</h1>
      <p style={styles.date}>Last Updated: {new Date().toDateString()}</p>

      <Section title="1. Acceptance of Terms">
        By using The Zuro, you agree to these terms and conditions.
      </Section>

      <Section title="2. User Responsibilities">
        You must provide accurate information and not misuse the platform.
      </Section>

      <Section title="3. Orders & Payments">
        Orders are confirmed only after successful payment.
      </Section>

      <Section title="4. Pricing">
        Prices are subject to change without notice.
      </Section>

      <Section title="5. Shipping">
        Delivery times are estimates and may vary.
      </Section>

      <Section title="6. Returns & Refunds">
        Returns are accepted within 7 days of delivery.
      </Section>

      <Section title="7. Account Security">
        You are responsible for maintaining your account security.
      </Section>

      <Section title="8. Prohibited Activities">
        Any illegal or harmful activity is strictly prohibited.
      </Section>

      <Section title="9. Contact">
        Email: support@thezuro.com
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ color: "#9400D3" }}>{title}</h3>
      <p style={{ lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  date: {
    color: "#666",
    marginBottom: "30px"
  }
};