"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

// Helper for responsive logic
const useWindowSize = () => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#2563EB" />
    <path d="M5.5 10l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

export default function SignupPage() {
  const width = useWindowSize();
  const isMobile = width < 900;
  const navigate = useNavigate();
  const { signup, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "", // Matches C# DateOnly
    gender: 0,       // Matches Gender Enum (0=Male, 1=Female, etc)
  });
  useEffect(() => {
    // If auth initialization is finished and we have a user, go home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the terms.");
      return;
    }

    setIsSubmitting(true);

    const result = await signup({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      dateOfBirth: form.dateOfBirth,
      gender: parseInt(form.gender),
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ padding: "20px 5%", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", color: "#1e293b" }}>Community</span>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", padding: isMobile ? "20px" : "0 5%", alignItems: "center", justifyContent: "center", gap: isMobile ? "40px" : "80px" }}>

        {/* Left Section - Hero */}
        <div style={{ flex: 1, maxWidth: isMobile ? "100%" : "500px", textAlign: isMobile ? "center" : "left" }}>
          <h1 style={{ fontSize: isMobile ? "32px" : "48px", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: "24px" }}>
            Connect with others,<br /><span style={{ color: "#2563eb" }}>share your story.</span>
          </h1>
          <p style={{ fontSize: "17px", color: "#64748b", marginBottom: "40px", lineHeight: 1.6 }}>
            Join a global network of creators and professionals building meaningful connections every day.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", alignItems: isMobile ? "center" : "flex-start" }}>
            {["Identity verified profiles", "End-to-end encryption", "Zero subscription fees"].map((text) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, color: "#334155", fontWeight: 500 }}>
                <CheckIcon /> {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Form Card */}
        <div style={{ width: "100%", maxWidth: "480px", background: "white", borderRadius: "24px", padding: isMobile ? "30px 20px" : "40px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>Get started</h2>
          <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "15px" }}>Create your account in seconds.</p>

          {error && (
            <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px", flexDirection: width < 400 ? "column" : "row" }}>
              <Field label="First name" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required />
              <Field label="Last name" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Field label="Birthday" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                  <option value={2}>Other</option>
                </select>
              </div>
            </div>

            <Field label="Email" type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />

            <PasswordField
              label="Password"
              name="password"
              visible={showPassword}
              setVisible={setShowPassword}
              value={form.password}
              onChange={handleChange}
              required
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              visible={showConfirm}
              setVisible={setShowConfirm}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: "4px" }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: "4px", accentColor: "#2563eb", width: "16px", height: "16px" }} />
              <label style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
                I agree to the <a href="#" style={linkStyle}>Terms</a> and <a href="#" style={linkStyle}>Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" disabled={isSubmitting} style={{ ...submitBtnStyle, opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "24px" }}>
            Already a member? <Link to="/signin" style={linkStyle}>Log in</Link>
          </p>
        </div>
      </main>

      <footer style={{ padding: "40px 5%", textAlign: isMobile ? "center" : "left" }}>
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>© 2026 Community Inc. Built with passion.</p>
      </footer>
    </div>
  );
}

// Sub-components
const Field = ({ label, ...props }) => (
  <div style={{ flex: 1 }}>
    <label style={labelStyle}>{label}</label>
    <input style={inputStyle} {...props} />
  </div>
);

const PasswordField = ({ label, visible, setVisible, ...props }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: "relative" }}>
      <input type={visible ? "text" : "password"} style={{ ...inputStyle, paddingRight: "45px" }} {...props} />
      <button type="button" onClick={() => setVisible(!visible)} style={eyeBtnStyle}>
        <EyeIcon visible={visible} />
      </button>
    </div>
  </div>
);

// Styles
const labelStyle = { display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "8px" };
const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", backgroundColor: "#fff" };
const eyeBtnStyle = { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" };
const linkStyle = { color: "#2563eb", textDecoration: "none", fontWeight: 600 };
const submitBtnStyle = { width: "100%", background: "#2563eb", color: "white", padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginTop: "10px", boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" };