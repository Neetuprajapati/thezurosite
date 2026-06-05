import { createContext, useContext, useState, useEffect } from "react";

// ── Context ──────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("tz_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("tz_token") || null);
  const [loading, setLoading] = useState(false);

  // ── Persist on change ──
  useEffect(() => {
    if (user)  localStorage.setItem("tz_user",  JSON.stringify(user));
    else       localStorage.removeItem("tz_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("tz_token", token);
    else       localStorage.removeItem("tz_token");
  }, [token]);

  // ── Login ──
  // Replace the setTimeout with your real API call:
  // POST /api/v1/auth/login  { identifier, password }
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      // ---- REAL API CALL (uncomment when backend is ready) ----
      // const res = await fetch("/api/v1/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ identifier, password }),
      // });
      // if (!res.ok) throw new Error((await res.json()).message || "Login failed");
      // const data = await res.json();
      // setToken(data.access_token);
      // setUser(data.user);
      // return { success: true };
      // ---------------------------------------------------------

      // ---- MOCK (remove when API is ready) ----
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser = { id: "u1", name: "Enter your name", email: identifier, role: "customer" };
      const mockToken = "mock_jwt_token_" + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      return { success: true };
      // -----------------------------------------
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  // POST /api/v1/auth/register  { firstName, lastName, email, phone, password }
  const register = async (formData) => {
    setLoading(true);
    try {
      // ---- REAL API CALL ----
      // const res = await fetch("/api/v1/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error((await res.json()).message || "Registration failed");
      // return { success: true };
      // -----------------------

      // ---- MOCK ----
      await new Promise((r) => setTimeout(r, 1000));
      return { success: true };
      // --------------
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ──
  // POST /api/v1/auth/otp/verify  { identifier, otp_code, purpose }
  const verifyOTP = async (identifier, otpCode, purpose = "register") => {
    setLoading(true);
    try {
      // ---- REAL API CALL ----
      // const res = await fetch("/api/v1/auth/otp/verify", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ identifier, otp_code: otpCode, purpose }),
      // });
      // if (!res.ok) throw new Error("Invalid OTP");
      // const data = await res.json();
      // if (purpose === "login") { setToken(data.access_token); setUser(data.user); }
      // return { success: true };
      // -----------------------

      // ---- MOCK ----
      await new Promise((r) => setTimeout(r, 800));
      if (purpose === "login") {
        const mockUser = { id: "u1", name: "Enter your name", phone: identifier, role: "customer" };
        setToken("mock_jwt_" + Date.now());
        setUser(mockUser);
      }
      return { success: true };
      // --------------
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ── Send OTP ──
  const sendOTP = async (identifier, purpose = "login") => {
    try {
      // await fetch("/api/v1/auth/otp/send", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ identifier, purpose }),
      // });
      console.log(`OTP sent to ${identifier} for ${purpose}`);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  // ── Logout ──
  const logout = async () => {
    // await fetch("/api/v1/auth/logout", { method:"POST", headers:{ Authorization:`Bearer ${token}` }});
    setUser(null);
    setToken(null);
    localStorage.removeItem("tz_cart");
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin   = user?.role === "admin";
  const isSeller  = user?.role === "seller" || isAdmin;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated, isAdmin, isSeller,
      login, register, verifyOTP, sendOTP, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ── Protected Route wrapper ───────────────────────────────────────
export function RequireAuth({ children, role }) {
  const { isAuthenticated, isAdmin, isSeller } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role === "admin"  && !isAdmin)  return <Navigate to="/"       replace />;
  if (role === "seller" && !isSeller) return <Navigate to="/"       replace />;
  return children;
}

// ── Helper: import Navigate (needed in RequireAuth) ───────────────
import { Navigate } from "react-router-dom";
