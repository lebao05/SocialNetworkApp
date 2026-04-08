import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

// Hook to track window size for responsiveness
const useWindowSize = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

export default function SigninPage() {
  const width = useWindowSize();
  const { signin, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = width < 1024;

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); // 1. Added error state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing again
  };
  useEffect(() => {
    // If auth initialization is finished and we have a user, go home
    if (!loading && user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // Reset error on new attempt

    const result = await signin(form.email, form.password);

    if (result.success) {
      console.log("Successfully logged in!");
      navigate("/");
    } else {
      console.log("Login failed:", result.error);
      // 2. Set the error message instead of alerting
      setError(result.error || "Invalid email or password. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* LEFT PANEL: Decorative & Stats */}
      {!isMobile && (
        <div style={{
          flex: "0 0 45%",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "48px 60px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "auto" }}>
            <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1e293b", letterSpacing: "-0.5px" }}>Community</span>
          </div>

          <div style={{ marginBottom: "auto" }}>
            <h1 style={{ fontSize: "56px", fontWeight: 900, color: "#0f172a", lineHeight: 1.05, marginBottom: "24px", letterSpacing: "-1px" }}>
              Good to see <br /><span style={{ color: "#2563eb" }}>you again.</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#64748b", lineHeight: 1.6, maxWidth: "400px", marginBottom: "40px" }}>
              Join back in to catch up with your friends and see what's happening in your circles.
            </p>
          </div>

          <footer style={{ marginTop: "auto", fontSize: "13px", color: "#94a3b8" }}>
            © 2026 Community Connect. Secure & Encrypted.
          </footer>
        </div>
      )}

      {/* RIGHT PANEL: Form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "24px" : "60px",
        backgroundColor: "#fcfcfd"
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#1e293b", marginBottom: "8px", letterSpacing: "-0.5px" }}>Welcome back</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "36px" }}>Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={labelStyle}>Email or username</label>
              <input
                name="email"
                type="text"
                required
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: error ? "#ef4444" : "#e2e8f0" // Red border on error
                }}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Forgot?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    paddingRight: "44px",
                    borderColor: error ? "#ef4444" : "#e2e8f0"
                  }}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeBtnStyle}
                  disabled={isSubmitting}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                id="keep"
                checked={keepLoggedIn}
                onChange={e => setKeepLoggedIn(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#2563eb", cursor: "pointer" }}
                disabled={isSubmitting}
              />
              <label htmlFor="keep" style={{ fontSize: "14px", color: "#475569", cursor: "pointer", userSelect: "none" }}>
                Keep me logged in
              </label>
            </div>

            {/* 3. Render Error Message Box */}
            {error && (
              <div style={errorBoxStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{ ...submitBtnStyle, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "32px" }}>
            New here? <a href="#" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Global UI Styles
const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1.5px solid #e2e8f0",
  fontSize: "15px",
  color: "#1e293b",
  backgroundColor: "#fff",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

const eyeBtnStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  padding: "4px"
};

const errorBoxStyle = {
  padding: "12px 16px",
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "10px",
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  lineHeight: "1.4"
};

const submitBtnStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  fontSize: "16px",
  border: "none",
  boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.25)",
  transition: "all 0.2s ease",
};