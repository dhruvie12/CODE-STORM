import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export default function Navbar() {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { isLoggedIn, user, activeRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (activeRole === "photographer") return "/dashboard/photographer";
    if (activeRole === "admin")        return "/dashboard/admin";
    return "/dashboard/client";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      {/* BRAND */}
      <div style={s.brand} onClick={() => navigate("/")}>
        <CameraIcon />
        <span style={s.logo}>LensLink</span>
      </div>

      {/* NAV LINKS */}
      <div style={s.links}>
        {[
          { label: "Explore",           path: "/explore" },
          { label: "How It Works",      path: "/how-it-works" },
          { label: "For Photographers", path: "/for-photographers" },
        ].map(({ label, path }) => (
          <span
            key={label}
            onClick={() => navigate(path)}
            style={{
              ...s.link,
              color:      isActive(path) ? "#2a5c45" : "#555",
              fontWeight: isActive(path) ? 700 : 400,
              borderBottom: isActive(path) ? "2px solid #2a5c45" : "2px solid transparent",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div style={s.actions}>
        {isLoggedIn ? (
          <>
            {/* dashboard button */}
            <button
              style={s.btnGhost}
              onClick={() => navigate(getDashboardPath())}
            >
              Dashboard
            </button>

            {/* user name + logout */}
            <div style={s.userInfo}>
              <span style={s.userName}>Hi, {user?.name?.split(" ")[0]}</span>
              <button style={s.btnPrimary} onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <button style={s.btnGhost}    onClick={() => navigate("/login")}>
              Log In
            </button>
            <button style={s.btnPrimary}  onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 60px",
    background: "#fff",
    borderBottom: "1px solid #ece9e4",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
  },
  brand: {
    display: "flex", alignItems: "center", gap: 10,
    cursor: "pointer",
  },
  logo: {
    fontSize: "1.45rem", fontWeight: 700,
    color: "#2a5c45", letterSpacing: "0.03em",
    fontFamily: "Georgia, serif",
  },
  links: {
    display: "flex", gap: 34, alignItems: "center",
  },
  link: {
    fontSize: "0.9rem", cursor: "pointer",
    letterSpacing: "0.03em", paddingBottom: "2px",
    transition: "color 0.2s",
    fontFamily: "Georgia, serif",
  },
  actions: {
    display: "flex", alignItems: "center", gap: 12,
  },
  userInfo: {
    display: "flex", alignItems: "center", gap: 12,
  },
  userName: {
    fontSize: "0.88rem", color: "#555",
    fontFamily: "Georgia, serif",
  },
  btnGhost: {
    background: "transparent", border: "1.5px solid #ddd",
    color: "#333", padding: "8px 20px", borderRadius: 7,
    cursor: "pointer", fontSize: "0.87rem",
    fontFamily: "Georgia, serif", transition: "border-color 0.2s",
  },
  btnPrimary: {
    background: "#2a5c45", border: "none", color: "#fff",
    padding: "8px 20px", borderRadius: 7, cursor: "pointer",
    fontSize: "0.87rem", fontWeight: 700,
    fontFamily: "Georgia, serif",
  },
};