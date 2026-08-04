import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPasswordApi } from "../apis/authApi";

// Reused styling from SigninPage / ForgotPasswordPage for visual
// consistency across the auth flow.

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // The reset link ships email + token in the query string. We require
  // both before showing the form so users who land here without a token
  // (typo, expired email forwarded without params) get a clear message
  // instead of a non-functional form.
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Local password-strength hint. Server enforces the same rules via
  // Identity's PasswordOptions; this is purely a UX hint.
  const strength = scorePassword(password);
  const tooShort = password.length > 0 && password.length < 6;

  // If either query parameter is missing we don't render the form. The
  // back-link below explains why and offers the forgot-password page as
  // a way to start over.
  const paramsMissing = !email || !token;

  // Once the user successfully resets, send them to sign-in after a
  // short pause so they can read the success message first.
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => navigate("/sign-in", { replace: true }), 1800);
    return () => clearTimeout(t);
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (tooShort) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await resetPasswordApi({ email, token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      console.error("Reset password failed:", err);
      const data = err?.response?.data;
      const message =
        data?.detail ||
        data?.Detail ||
        data?.message ||
        err?.message ||
        "The reset link is invalid or has expired.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: "24px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "440px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "40px", boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.05)" }}>

        {success ? (
          <SuccessPanel />
        ) : paramsMissing ? (
          <MissingParamsPanel />
        ) : (
          <>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e293b", marginBottom: "8px", letterSpacing: "-0.5px" }}>
              Choose a new password
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>
              Resetting the password for <strong>{email}</strong>.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>New password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                    style={{
                      ...inputStyle,
                      paddingRight: "44px",
                      borderColor: error ? "#ef4444" : "#e2e8f0"
                    }}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={eyeBtnStyle}
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "4px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${(strength / 4) * 100}%`, height: "100%", backgroundColor: strengthColor(strength), transition: "width 0.2s ease" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#64748b", minWidth: "60px", textAlign: "right" }}>{strengthLabel(strength)}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Confirm new password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); if (error) setError(""); }}
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
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "24px" }}>
          <Link to="/sign-in" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function SuccessPanel() {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ margin: "0 auto 20px", width: 56, height: 56, borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>Password updated</h2>
      <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
        Your password has been reset successfully. Redirecting you to sign in...
      </p>
    </div>
  );
}

function MissingParamsPanel() {
  return (
    <div>
      <div style={{ marginBottom: "20px", width: 56, height: 56, borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>Invalid reset link</h2>
      <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
        This page needs a fresh reset link from your email. The link you opened is missing
        some required information or may have expired.
      </p>
      <Link
        to="/forgot-password"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: "#2563eb",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: 700,
          fontSize: "14px",
          textDecoration: "none"
        }}
      >
        Request a new link
      </Link>
    </div>
  );
}

const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// Cheap client-side scoring so users get immediate feedback while they
// type. Server still enforces policy via Identity's PasswordOptions.
function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || (/[^\w\s]/.test(pw))) score++;
  return score;
}

function strengthColor(score) {
  return ["#ef4444", "#f97316", "#eab308", "#22c55e"][score] || "#e2e8f0";
}

function strengthLabel(score) {
  return ["Weak", "Fair", "Good", "Strong"][score] || "";
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
  transition: "all 0.2s ease"
};