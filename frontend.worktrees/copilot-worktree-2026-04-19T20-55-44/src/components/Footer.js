import { useNavigate } from "react-router-dom";

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Explore Photographers", path: "/explore" },
      { label: "How It Works",          path: "/how-it-works" },
      { label: "For Photographers",     path: "/for-photographers" },
      { label: "Pricing",               path: "/pricing" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In",    path: "/login" },
      { label: "Sign Up",   path: "/register" },
      { label: "Dashboard", path: "/dashboard/client" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us",   path: "/about" },
      { label: "Contact",    path: "/contact" },
      { label: "Blog",       path: "/blog" },
      { label: "Careers",    path: "/careers" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center",    path: "/help" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Use",   path: "/terms" },
      { label: "Cookie Policy",  path: "/cookies" },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={s.footer}>

      {/* TOP SECTION */}
      <div style={s.top}>

        {/* brand + description */}
        <div style={s.brand}>
          <div style={s.brandRow} onClick={() => navigate("/")}>
            <CameraIcon />
            <span style={s.logo}>LensLink</span>
          </div>
          <p style={s.tagline}>
            India's premier photography marketplace. Connecting talented photographers
            with clients who value great moments.
          </p>
          {/* social icons */}
          <div style={s.socials}>
            {[
              { icon: <InstagramIcon />, label: "Instagram" },
              { icon: <TwitterIcon />,   label: "Twitter" },
              { icon: <LinkedInIcon />,  label: "LinkedIn" },
            ].map(({ icon, label }) => (
              <button key={label} style={s.socialBtn} title={label}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* link columns */}
        <div style={s.linkColumns}>
          {footerLinks.map(col => (
            <div key={col.heading} style={s.col}>
              <p style={s.colHeading}>{col.heading}</p>
              {col.links.map(({ label, path }) => (
                <span
                  key={label}
                  onClick={() => navigate(path)}
                  style={s.colLink}
                >
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <div style={s.divider} />

      {/* BOTTOM SECTION */}
      <div style={s.bottom}>
        <p style={s.copyright}>
          © 2025 LensLink. Built with ♥ by{" "}
          <span style={s.team}>Code Storm</span>
          {" "}— Dhruvi, Tisha, Riya &amp; Ayushi
        </p>
        <div style={s.bottomLinks}>
          {["Privacy", "Terms", "Cookies"].map(l => (
            <span
              key={l}
              onClick={() => navigate(`/${l.toLowerCase()}`)}
              style={s.bottomLink}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

    </footer>
  );
}

const s = {
  footer: {
    background: "#fff",
    borderTop: "1px solid #ece9e4",
    padding: "60px 60px 30px",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },

  // TOP
  top: {
    display: "flex",
    gap: 60,
    marginBottom: 48,
    flexWrap: "wrap",
  },

  // BRAND
  brand: {
    flex: "0 0 260px",
    display: "flex", flexDirection: "column", gap: 16,
  },
  brandRow: {
    display: "flex", alignItems: "center", gap: 10,
    cursor: "pointer", width: "fit-content",
  },
  logo: {
    fontSize: "1.4rem", fontWeight: 700,
    color: "#2a5c45", letterSpacing: "0.03em",
  },
  tagline: {
    fontSize: "0.85rem", color: "#888",
    lineHeight: 1.75, margin: 0,
  },
  socials: {
    display: "flex", gap: 10, marginTop: 4,
  },
  socialBtn: {
    width: 36, height: 36,
    border: "1.5px solid #e0dbd3",
    borderRadius: 8, background: "transparent",
    color: "#888", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "border-color 0.2s, color 0.2s",
  },

  // LINK COLUMNS
  linkColumns: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 32,
  },
  col: {
    display: "flex", flexDirection: "column", gap: 10,
  },
  colHeading: {
    fontSize: "0.78rem", fontWeight: 700,
    color: "#1a1a1a", letterSpacing: "0.1em",
    textTransform: "uppercase", margin: "0 0 6px",
  },
  colLink: {
    fontSize: "0.87rem", color: "#777",
    cursor: "pointer", lineHeight: 1.5,
    transition: "color 0.2s",
  },

  // DIVIDER
  divider: {
    height: 1, background: "#ece9e4", marginBottom: 24,
  },

  // BOTTOM
  bottom: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", flexWrap: "wrap", gap: 12,
  },
  copyright: {
    fontSize: "0.8rem", color: "#bbb", margin: 0,
  },
  team: {
    color: "#2a5c45", fontWeight: 600,
  },
  bottomLinks: {
    display: "flex", gap: 24,
  },
  bottomLink: {
    fontSize: "0.8rem", color: "#bbb",
    cursor: "pointer", transition: "color 0.2s",
  },
};