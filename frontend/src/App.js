import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProfilePage from "./pages/profile";
import WishlistPage from "./pages/WishlistPage";
import BagPage from "./pages/BagPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Termscondition";
import Cancellation from "./pages/CancellationPolicy";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQPage";
// import TC from "./pages/TermsaurConditions";
import TC from "./pages/TermsaurConditions.jsx";
import Shipping from "./pages/ShippingPolicy";
import TrackOrders from "./pages/OrdersPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Wishlist */}
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* ✅ Bag */}
        <Route path="/bag" element={<BagPage />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/tc" element={<TC />} />
        <Route path="/track-orders" element={<TrackOrders />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

      </Routes>
    </BrowserRouter>
  );
}