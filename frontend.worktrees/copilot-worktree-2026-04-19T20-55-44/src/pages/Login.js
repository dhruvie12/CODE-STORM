import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
    {show ? (
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const validate = () => {
    const e = {};

    if (!email) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Enter a valid email";
    }

    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Minimum 6 characters";
    }

    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data);

      if (res.data.activeRole === "admin") {
        navigate("/dashboard/admin");
      } else if (res.data.activeRole === "photographer") {
        navigate("/dashboard/photographer");
      } else {
        navigate("/dashboard/client");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.left}>
        <div style={s.leftOverlay} />
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85"
          alt="wedding photography"
          style={s.leftImg}
        />
        <div style={s.leftContent}>
          <div style={s.leftBrand} onClick={() => navigate("/")}></div>

          <h2 style={s.leftTitle}>
            Capture moments,
            <br />
            <em>build memories.</em>
          </h2>

          <p style={s.leftSub}>
            Join thousands of photographers and clients on India's premier photography platform.
          </p>

          <div style={s.leftStats}>
            {[["500+", "Photographers"], ["12K+", "Bookings"], ["4.9★", "Rating"]].map(([n, l]) => (
              <div key={l} style={s.leftStat}>
                <span style={s.leftStatNum}>{n}</span>
                <span style={s.leftStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.formWrap}>
          <div style={s.mobileLogo} onClick={() => navigate("/")}>
            <CameraIcon />
            <span style={s.mobileLogoText}>LensLink</span>
          </div>

          <h1 style={s.formTitle}>Welcome back</h1>
          <p style={s.formSub}>Log in to your account to continue</p>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email address</label>
              <div
                style={{
                  ...s.inputWrap,
                  borderColor: errors.email
                    ? "#e05555"
                    : focused === "email"
                    ? "#2a5c45"
                    : "#e0dbd3",
                  boxShadow:
                    focused === "email" ? "0 0 0 3px rgba(42,92,69,0.1)" : "none",
                }}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  style={s.input}
                />
              </div>
              {errors.email && <p style={s.errorMsg}>⚠ {errors.email}</p>}
            </div>

            <div style={s.fieldGroup}>
              <div style={s.labelRow}>
                <label style={s.label}>Password</label>
                <button
                  type="button"
                  style={s.forgotLink}
                  onClick={() => alert("Password recovery is not implemented yet. Please contact support.")}
                >
                  Forgot password?
                </button>
              </div>

              <div
                style={{
                  ...s.inputWrap,
                  borderColor: errors.password
                    ? "#e05555"
                    : focused === "password"
                    ? "#2a5c45"
                    : "#e0dbd3",
                  boxShadow:
                    focused === "password" ? "0 0 0 3px rgba(42,92,69,0.1)" : "none",
                }}
              >
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  style={{ ...s.input, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={s.eyeBtn}
                >
                  <EyeIcon show={showPass} />
                </button>
              </div>

              {errors.password && <p style={s.errorMsg}>⚠ {errors.password}</p>}
            </div>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? <span style={s.spinner} /> : "Log In"}
            </button>
          </form>

          <p style={s.switchText}>
            Don't have an account?{" "}
            <span style={s.switchLink} onClick={() => navigate("/register")}>
              Sign up for free
            </span>
          </p>

          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>or continue with</span>
            <span style={s.dividerLine} />
          </div>

          <button style={s.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Georgia, 'Times New Roman', serif",
    background: "#faf9f7",
  },
  left: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-end",
    minHeight: "100vh",
  },
  leftImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  leftOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(to top, rgba(10,30,20,0.85) 0%, rgba(10,30,20,0.3) 60%, transparent 100%)",
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    padding: "48px",
    color: "#fff",
  },
  leftBrand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
    cursor: "pointer",
  },
  leftLogo: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "0.04em",
  },
  leftTitle: {
    fontSize: "2.2rem",
    fontWeight: 400,
    lineHeight: 1.2,
    marginBottom: 16,
    color: "#fff",
  },
  leftSub: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.7,
    marginBottom: 36,
    maxWidth: 340,
  },
  leftStats: {
    display: "flex",
    gap: 32,
  },
  leftStat: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  leftStatNum: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#fff",
  },
  leftStatLabel: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  right: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#fff",
    borderLeft: "1px solid #ece9e4",
  },
  formWrap: {
    width: "100%",
    maxWidth: 380,
  },
  mobileLogo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
    cursor: "pointer",
  },
  mobileLogoText: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#2a5c45",
  },
  formTitle: {
    fontSize: "1.9rem",
    fontWeight: 400,
    color: "#1a1a1a",
    marginBottom: 8,
  },
  formSub: {
    fontSize: "0.92rem",
    color: "#888",
    marginBottom: 28,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginBottom: 22,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  label: {
    fontSize: "0.85rem",
    color: "#444",
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotLink: {
    fontSize: "0.8rem",
    color: "#2a5c45",
    textDecoration: "none",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e0dbd3",
    borderRadius: 9,
    background: "#faf9f7",
    overflow: "hidden",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "12px 14px",
    fontSize: "0.93rem",
    color: "#1a1a1a",
    fontFamily: "Georgia, serif",
  },
  eyeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
  },
  errorMsg: {
    fontSize: "0.78rem",
    color: "#e05555",
    margin: "2px 0 0",
  },
  submitBtn: {
    padding: "13px",
    background: "#2a5c45",
    border: "none",
    color: "#fff",
    borderRadius: 9,
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    letterSpacing: "0.04em",
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTop: "2.5px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  switchText: {
    textAlign: "center",
    fontSize: "0.87rem",
    color: "#888",
    marginBottom: 22,
  },
  switchLink: {
    color: "#2a5c45",
    fontWeight: 700,
    cursor: "pointer",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#ece9e4",
  },
  dividerText: {
    fontSize: "0.78rem",
    color: "#bbb",
    whiteSpace: "nowrap",
  },
  googleBtn: {
    width: "100%",
    padding: "12px",
    background: "#fff",
    border: "1.5px solid #e0dbd3",
    borderRadius: 9,
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#333",
    fontFamily: "Georgia, serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
};