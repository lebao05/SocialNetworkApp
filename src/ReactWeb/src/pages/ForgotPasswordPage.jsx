import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordApi } from "../apis/authApi";

// Hook to track window size so the layout matches SigninPage (two-pane
// on desktop, single-pane on mobile).
const useWindowSize = () => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }
  return width;
};

export default function ForgotPasswordPage() {
  const width = useWindowSize();
  const navigate = useNavigate();
  const isMobile = width < 1024;

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Generic status/error states — we deliberately use the same success
  // copy whether or not the email exists so we don't leak registration.
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      await forgotPasswordApi(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password failed:", err);
      const data = err?.response?.data;
      const message =
        data?.detail ||
        data?.Detail ||
        data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {!isMobile && (
        <div style={{
          flex: "0 0 45%",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "48px 60px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "auto" }}>
            <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1e293b", letterSpacing: "-0.5px" }}>Community</span>
          </div>

          <div style={{ marginBottom: "auto" }}>
            <h1 style={{ fontSize: "56px", fontWeight: 900, color: "#0f172a", lineHeight: 1.05, marginBottom: "24px", letterSpacing: "-1px" }}>
              Forgot your <br /><span style={{ color: "#2563eb" }}>password?</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#64748b", lineHeight: 1.6, maxWidth: "400px" }}>
              No worries — enter your email and we'll send you a secure link to reset it.
            </p>
          </div>

          <footer style={{ marginTop: "auto", fontSize: "13px", color: "#94a3b8" }}>
            © 2026 Community Connect. Secure & Encrypted.
          </footer>
        </div>
      )}

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "24px" : "60px",
        backgroundColor: "#fcfcfd"
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#1e293b", marginBottom: "8px", letterSpacing: "-0.5px" }}>Reset password</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "36px" }}>
            Enter the email address tied to your account.
          </p>

          {submitted ? (
            <div style={successBoxStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <strong style={{ display: "block", marginBottom: 4 }}>Check your inbox.</strong>
                If <span style={{ fontWeight: 600 }}>{email}</span> is registered, we've sent a reset link.
                The link expires in <strong>10 minutes</strong>.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  style={{
                    ...inputStyle,
                    borderColor: error ? "#ef4444" : "#e2e8f0"
                  }}
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div style={errorBoxStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={{ ...submitBtnStyle, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending link..." : "Send reset link"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "32px" }}>
            Remembered it?{" "}
            <Link to="/sign-in" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Back to sign in
            </Link>
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              marginTop: "12px",
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "13px",
              cursor: "pointer",
              width: "100%",
              textAlign: "center"
            }}
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}

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
  boxSizing: "border-box"
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

const successBoxStyle = {
  padding: "16px",
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
  color: "#166534",
  fontSize: "14px",
  fontWeight: 500,
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  lineHeight: "1.5"
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
  transition: "all 0.2s ease"
};