import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole]               = useState("client");
  const [form, setForm]               = useState({ full_name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [focused, setFocused]         = useState("");

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      await api.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        role,
      });

      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...s.inputWrap,
    borderColor: errors[field] ? "#e05555" : focused === field ? "#2a5c45" : "#e0dbd3",
    boxShadow:   focused === field ? "0 0 0 3px rgba(42,92,69,0.1)" : "none",
  });

  return (
    <div style={s.root}>

      {/* LEFT PANEL */}
      <div style={s.left}>
        <div style={s.leftOverlay} />
        <img
          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=85"
          alt="portrait photography" style={s.leftImg}
        />
        <div style={s.leftContent}>
          <div style={s.leftBrand} onClick={() => navigate("/")}>
            <CameraIcon />
            <span style={s.leftLogo}>LensLink</span>
          </div>
          <h2 style={s.leftTitle}>Your journey<br /><em>starts here.</em></h2>
          <p style={s.leftSub}>
            Whether you're looking to book a photographer or showcase your portfolio —
            LensLink connects you with the right people.
          </p>
          <div style={s.featureList}>
            {[
              "✦ Free to join, no hidden fees",
              "✦ Instant booking requests",
              "✦ Verified photographer profiles",
              "✦ Secure payments & communication",
            ].map(f => <p key={f} style={s.featureItem}>{f}</p>)}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right}>
        <div style={s.formWrap}>

          <div style={s.mobileLogo} onClick={() => navigate("/")}>
            <CameraIcon />
            <span style={s.mobileLogoText}>LensLink</span>
          </div>

          <h1 style={s.formTitle}>Create your account</h1>
          <p style={s.formSub}>Join LensLink for free — takes less than 2 minutes</p>

          {/* ── ACCOUNT TYPE ── */}
          <div style={s.roleSection}>
            <p style={s.roleLabel}>I am joining as a</p>
            <div style={s.roleCards}>

              {/* Client card */}
              <div
                onClick={() => setRole("client")}
                style={{
                  ...s.roleCard,
                  borderColor: role === "client" ? "#2a5c45" : "#e0dbd3",
                  background:  role === "client" ? "#eef7f2" : "#faf9f7",
                }}
              >
                <div style={s.roleCardTop}>
                  <span style={s.roleEmoji}>👤</span>
                  <div style={{
                    ...s.roleRadio,
                    borderColor:     role === "client" ? "#2a5c45" : "#ccc",
                    backgroundColor: role === "client" ? "#2a5c45" : "transparent",
                  }} />
                </div>
                <p style={{ ...s.roleCardTitle, color: role === "client" ? "#2a5c45" : "#1a1a1a" }}>
                  Client
                </p>
                <p style={s.roleCardDesc}>I want to find and book photographers</p>
              </div>

              {/* Photographer card */}
              <div
                onClick={() => setRole("photographer")}
                style={{
                  ...s.roleCard,
                  borderColor: role === "photographer" ? "#2a5c45" : "#e0dbd3",
                  background:  role === "photographer" ? "#eef7f2" : "#faf9f7",
                }}
              >
                <div style={s.roleCardTop}>
                  <span style={s.roleEmoji}>📷</span>
                  <div style={{
                    ...s.roleRadio,
                    borderColor:     role === "photographer" ? "#2a5c45" : "#ccc",
                    backgroundColor: role === "photographer" ? "#2a5c45" : "transparent",
                  }} />
                </div>
                <p style={{ ...s.roleCardTitle, color: role === "photographer" ? "#2a5c45" : "#1a1a1a" }}>
                  Photographer
                </p>
                <p style={s.roleCardDesc}>I want to showcase my work and get bookings</p>
              </div>

            </div>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>

            {/* full name */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Full Name</label>
              <div style={inputStyle("full_name")}>
                <input
                  type="text" placeholder="e.g. Priya Sharma"
                  value={form.full_name}
                  onChange={e => update("full_name", e.target.value)}
                  onFocus={() => setFocused("full_name")}
                  onBlur={() => setFocused("")}
                  style={s.input}
                />
              </div>
              {errors.full_name && <p style={s.errorMsg}>⚠ {errors.full_name}</p>}
            </div>

            {/* email */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Email Address</label>
              <div style={inputStyle("email")}>
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  style={s.input}
                />
              </div>
              {errors.email && <p style={s.errorMsg}>⚠ {errors.email}</p>}
            </div>

            {/* phone */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Phone Number <span style={s.optional}>(optional)</span></label>
              <div style={inputStyle("phone")}>
                <input
                  type="tel" placeholder="+1 555-123-4567"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused("")}
                  style={s.input}
                />
              </div>
            </div>

            {/* password + confirm */}
            <div style={s.twoCol}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Password</label>
                <div style={inputStyle("password")}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    style={{ ...s.input, paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                    <EyeIcon show={showPass} />
                  </button>
                </div>
                {errors.password && <p style={s.errorMsg}>⚠ {errors.password}</p>}
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Confirm Password</label>
                <div style={inputStyle("confirm")}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={e => update("confirm", e.target.value)}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused("")}
                    style={{ ...s.input, paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={s.eyeBtn}>
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
                {errors.confirm && <p style={s.errorMsg}>⚠ {errors.confirm}</p>}
              </div>
            </div>

            {/* password strength */}
            {form.password.length > 0 && (
              <div style={s.strengthWrap}>
                <div style={s.strengthBar}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      ...s.strengthSegment,
                      background: form.password.length >= i * 3
                        ? (form.password.length >= 10 ? "#2a5c45" : form.password.length >= 7 ? "#e8a000" : "#e05555")
                        : "#ece9e4"
                    }} />
                  ))}
                </div>
                <span style={{
                  ...s.strengthLabel,
                  color: form.password.length >= 10 ? "#2a5c45" : form.password.length >= 7 ? "#e8a000" : "#e05555"
                }}>
                  {form.password.length >= 10 ? "Strong" : form.password.length >= 7 ? "Medium" : "Weak"}
                </span>
              </div>
            )}

            <p style={s.terms}>
              By signing up, you agree to our{" "}
              <button type="button" style={s.termsLink}>Terms of Service</button> and{" "}
              <button type="button" style={s.termsLink}>Privacy Policy</button>.
            </p>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading
                ? <span style={s.spinner} />
                : `Create ${role === "client" ? "Client" : "Photographer"} Account`
              }
            </button>
          </form>

          <p style={s.switchText}>
            Already have an account?{" "}
            <span style={s.switchLink} onClick={() => navigate("/login")}>Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { display: "flex", minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", background: "#faf9f7" },
  left: { flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", minHeight: "100vh" },
  leftImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  leftOverlay: { position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to top, rgba(10,30,20,0.88) 0%, rgba(10,30,20,0.35) 55%, transparent 100%)" },
  leftContent: { position: "relative", zIndex: 2, padding: "48px", color: "#fff" },
  leftBrand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 36, cursor: "pointer" },
  leftLogo: { fontSize: "1.4rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" },
  leftTitle: { fontSize: "2.2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: 14, color: "#fff" },
  leftSub: { fontSize: "0.92rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 28, maxWidth: 340 },
  featureList: { display: "flex", flexDirection: "column", gap: 10 },
  featureItem: { fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", letterSpacing: "0.02em" },
  right: { width: "580px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#fff", borderLeft: "1px solid #ece9e4", overflowY: "auto" },
  formWrap: { width: "100%", maxWidth: 440, padding: "20px 0" },
  mobileLogo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24, cursor: "pointer" },
  mobileLogoText: { fontSize: "1.3rem", fontWeight: 700, color: "#2a5c45" },
  formTitle: { fontSize: "1.85rem", fontWeight: 400, color: "#1a1a1a", marginBottom: 8 },
  formSub: { fontSize: "0.9rem", color: "#888", marginBottom: 24 },

  // ROLE SELECTION
  roleSection: { marginBottom: 24 },
  roleLabel: { fontSize: "0.83rem", color: "#444", fontWeight: 600, marginBottom: 12, letterSpacing: "0.02em" },
  roleCards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  roleCard: {
    border: "1.5px solid", borderRadius: 10, padding: "16px",
    cursor: "pointer", transition: "all 0.2s",
  },
  roleCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  roleEmoji: { fontSize: "1.5rem" },
  roleRadio: {
    width: 16, height: 16, borderRadius: "50%",
    border: "2px solid", transition: "all 0.2s",
  },
  roleCardTitle: { fontSize: "0.95rem", fontWeight: 700, margin: "0 0 4px" },
  roleCardDesc: { fontSize: "0.76rem", color: "#888", margin: 0, lineHeight: 1.5 },

  // FORM
  form: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: "0.83rem", color: "#444", fontWeight: 600, letterSpacing: "0.02em" },
  optional: { color: "#bbb", fontWeight: 400 },
  inputWrap: { display: "flex", alignItems: "center", border: "1.5px solid #e0dbd3", borderRadius: 9, background: "#faf9f7", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s" },
  input: { flex: 1, border: "none", outline: "none", background: "transparent", padding: "11px 14px", fontSize: "0.91rem", color: "#1a1a1a", fontFamily: "Georgia, serif" },
  eyeBtn: { background: "transparent", border: "none", cursor: "pointer", padding: "0 12px", display: "flex", alignItems: "center" },
  errorMsg: { fontSize: "0.76rem", color: "#e05555", margin: "2px 0 0" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  strengthWrap: { display: "flex", alignItems: "center", gap: 10 },
  strengthBar: { display: "flex", gap: 4, flex: 1 },
  strengthSegment: { height: 4, flex: 1, borderRadius: 4, transition: "background 0.3s" },
  strengthLabel: { fontSize: "0.75rem", fontWeight: 600, minWidth: 44 },
  terms: { fontSize: "0.78rem", color: "#aaa", lineHeight: 1.6 },
  termsLink: { background: "none", border: "none", color: "#2a5c45", cursor: "pointer", fontSize: "0.78rem", padding: 0, fontFamily: "Georgia, serif" },
  submitBtn: { padding: "13px", background: "#2a5c45", border: "none", color: "#fff", borderRadius: 9, cursor: "pointer", fontSize: "0.93rem", fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: "0.04em", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 48 },
  spinner: { width: 20, height: 20, border: "2.5px solid rgba(255,255,255,0.3)", borderTop: "2.5px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" },
  switchText: { textAlign: "center", fontSize: "0.87rem", color: "#888" },
  switchLink: { color: "#2a5c45", fontWeight: 700, cursor: "pointer" },
};