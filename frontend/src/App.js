// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Layout from "./pages/Layout";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import HomePage from "./pages/Homepage";
// import ProfilePage from "./pages/profile";
// import WishlistPage from "./pages/WishlistPage";
// import BagPage from "./pages/BagPage";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import Terms from "./pages/Termscondition";
// import Cancellation from "./pages/CancellationPolicy";
// import ContactUs from "./pages/ContactUs";
// import FAQ from "./pages/FAQPage";
// import TC from "./pages/TermsaurConditions.jsx";
// import Shipping from "./pages/ShippingPolicy";
// import TrackOrders from "./pages/OrdersPage";
// import ProductDetails from "./pages/ProductDetails";
// import AboutUs from "./pages/AboutUs.jsx";
// import CategoryPage from "./pages/Categorypage.jsx";
// import CheckoutPage from "./pages/checkoutflow.jsx";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* 🔴 Auth pages (no header) */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* 🟢 ALL pages with HEADER */}
//         <Route element={<Layout />}>
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/wishlist" element={<WishlistPage />} />
//           <Route path="/bag" element={<BagPage />} />

//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/faq" element={<FAQ />} />
//           <Route path="/tc" element={<TC />} />
//           <Route path="/track-orders" element={<TrackOrders />} />
//           <Route path="/shipping" element={<Shipping />} />
//           <Route path="/cancellation" element={<Cancellation />} />

//           <Route path="/product/:id" element={<ProductDetails />} />
//           <Route path="/about-us" element={<AboutUs />} />
//           <Route path="/category/:category" element={<CategoryPage />} />
//           <Route path="/bag"      element={<BagPage />} />
//           <Route path="/checkout" element={<CheckoutPage />} />
//         </Route>

//         {/* redirects */}
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="*" element={<Navigate to="/login" replace />} />
       

//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./pages/Layout";

import Login          from "./pages/Login";
import Register       from "./pages/Register";
import HomePage       from "./pages/Homepage";
import ProfilePage    from "./pages/profile";
import WishlistPage   from "./pages/WishlistPage";
import BagPage        from "./pages/BagPage";
import PrivacyPolicy  from "./pages/PrivacyPolicy";
import Terms          from "./pages/Termscondition";
import Cancellation   from "./pages/CancellationPolicy";
import ContactUs      from "./pages/ContactUs";
import FAQ            from "./pages/FAQPage";
import TC             from "./pages/TermsaurConditions.jsx";
import Shipping       from "./pages/ShippingPolicy";
import TrackOrders    from "./pages/OrdersPage";
import ProductDetails from "./pages/ProductDetails";
import AboutUs        from "./pages/AboutUs.jsx";
import CategoryPage   from "./pages/Categorypage.jsx";
import CheckoutPage   from "./pages/checkoutflow.jsx";
// import OrderSuccess   from "./pages/OrderSuccess.jsx";

// ── Protected Route — login nahi hai toh /login pe bhejo ─────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth pages (no header/layout) ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── All pages with Layout (Navbar + Footer) ── */}
        <Route element={<Layout />}>

          {/* ✅ PUBLIC — bina login ke visible */}
          <Route path="/home"                element={<HomePage />} />
          <Route path="/product/:id"         element={<ProductDetails />} />
          <Route path="/category/:category"  element={<CategoryPage />} />
          <Route path="/about-us"            element={<AboutUs />} />
          <Route path="/privacy-policy"      element={<PrivacyPolicy />} />
          <Route path="/terms"               element={<Terms />} />
          <Route path="/contact"             element={<ContactUs />} />
          <Route path="/faq"                 element={<FAQ />} />
          <Route path="/tc"                  element={<TC />} />
          <Route path="/shipping"            element={<Shipping />} />
          <Route path="/cancellation"        element={<Cancellation />} />
          <Route path="/wishlist"            element={<WishlistPage />} />
          <Route path="/checkout"            element={<CheckoutPage />} />

          {/* 🔒 PROTECTED — login required */}
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          }/>
        
          {/* <Route path="/bag" element={
            <ProtectedRoute><BagPage /></ProtectedRoute>
          }/> */}
      
          <Route path="/track-orders" element={
            <ProtectedRoute><TrackOrders /></ProtectedRoute>
          }/>
          {/* <Route path="/order-success" element={
            <ProtectedRoute><OrderSuccess /></ProtectedRoute>
          }/> */}

        </Route>

        {/* ── Redirects ── */}
        {/* Root / → home (public) */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Unknown routes → home */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </BrowserRouter>
  );
}