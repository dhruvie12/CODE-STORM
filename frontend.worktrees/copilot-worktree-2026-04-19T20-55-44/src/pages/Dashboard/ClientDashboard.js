import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  grid:     "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  compass:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  check:    "M20 6L9 17l-5-5",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  camera:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const exploreCategories = [
  { label: "Weddings",   emoji: "💍", cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80" },
  { label: "Portraits",  emoji: "🎭", cover: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80" },
  { label: "Events",     emoji: "🎉", cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" },
  { label: "Commercial", emoji: "💼", cover: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&q=80" },
];

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: "#fff8e6", color: "#b07d00", label: "Pending"   },
    confirmed: { bg: "#eef7f2", color: "#2a5c45", label: "Confirmed" },
    completed: { bg: "#f0f0f0", color: "#555",    label: "Completed" },
    cancelled: { bg: "#fef0f0", color: "#c0392b", label: "Cancelled" },
  };
  const st = map[status] || map.pending;
  return <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>;
};

export default function ClientDashboard() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => { logout(); navigate("/"); };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get("/bookings/client");
        setBookings(response.data);
      } catch (error) {
        console.error(error);
        alert("Unable to load your bookings at the moment.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const cancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    }
  };

  const totalBookings  = bookings.length;
  const pendingCount   = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const totalSpent     = bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.total_price, 0);

  const navItems = [
    { key: "overview", label: "Overview",    icon: icons.grid     },
    { key: "bookings", label: "My Bookings", icon: icons.calendar },
    { key: "explore",  label: "Explore",     icon: icons.compass  },
    { key: "settings", label: "Settings",    icon: icons.settings },
  ];

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={s.loadingCard}>Loading your bookings…</div>
      </div>
    );
  }

  return (
    <div style={s.root}>

      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sideLogo} onClick={() => navigate("/")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span style={s.sideLogoText}>LensLink</span>
          </div>
          <div style={s.sideProfile}>
            <div style={s.sideAvatar}>{user?.name?.charAt(0).toUpperCase() || "C"}</div>
            <div>
              <p style={s.sideName}>{user?.name || "Client"}</p>
              <p style={s.sideRole}>👤 Client</p>
            </div>
          </div>
          <nav style={s.sideNav}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => setActiveTab(item.key)}
                style={{ ...s.sideNavBtn,
                  background: activeTab === item.key ? "#eef7f2" : "transparent",
                  color:      activeTab === item.key ? "#2a5c45" : "#666",
                  fontWeight: activeTab === item.key ? 700 : 400,
                  borderLeft: activeTab === item.key ? "3px solid #2a5c45" : "3px solid transparent",
                }}>
                <Icon d={item.icon} size={18} />{item.label}
              </button>
            ))}
          </nav>
        </div>
        <button style={s.sideLogout} onClick={handleLogout}>
          <Icon d={icons.logout} size={18} />Log Out
        </button>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>
              {activeTab === "overview" && "My Dashboard"}
              {activeTab === "bookings" && "My Bookings"}
              {activeTab === "explore"  && "Explore Photographers"}
              {activeTab === "settings" && "Account Settings"}
            </h1>
            <p style={s.pageSubtitle}>
              {activeTab === "overview" && `Welcome back, ${user?.name?.split(" ")[0] || "there"}!`}
              {activeTab === "bookings" && `You have ${pendingCount} pending booking${pendingCount !== 1 ? "s" : ""}`}
              {activeTab === "explore"  && "Find the perfect photographer for your next session"}
              {activeTab === "settings" && "Update your profile and preferences"}
            </p>
          </div>
          {activeTab === "explore" && (
            <button style={s.addBtn} onClick={() => navigate("/explore")}>Browse All →</button>
          )}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={s.statsGrid}>
              {[
                { label: "Total Bookings", value: totalBookings,                     icon: icons.calendar, color: "#2a5c45" },
                { label: "Pending",        value: pendingCount,                      icon: icons.clock,    color: "#b07d00" },
                { label: "Confirmed",      value: confirmedCount,                    icon: icons.check,    color: "#1a6fa8" },
                { label: "Total Spent",    value: `$${totalSpent.toLocaleString()}`, icon: icons.camera,   color: "#555"    },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statIcon, color: stat.color }}><Icon d={stat.icon} size={22} /></div>
                  <p style={s.statValue}>{stat.value}</p>
                  <p style={s.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Recent Bookings</h2>
                <button style={s.viewAllBtn} onClick={() => setActiveTab("bookings")}>View All →</button>
              </div>
              <div style={s.table}>
                <div style={s.tableHead}>
                  {["Photographer", "Service", "Event Date", "Amount", "Status"].map(h => (
                    <span key={h} style={s.th}>{h}</span>
                  ))}
                </div>
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} style={s.tableRow}>
                    <span style={s.td}>{b.photographer}</span>
                    <span style={s.td}>{b.service}</span>
                    <span style={s.td}>{b.event_date}</span>
                    <span style={{ ...s.td, color: "#2a5c45", fontWeight: 600 }}>${b.total_price.toLocaleString()}</span>
                    <span style={s.td}><StatusBadge status={b.status} /></span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.exploreCta}>
              <div>
                <h3 style={s.ctaTitle}>Looking for a photographer?</h3>
                <p style={s.ctaSubtitle}>Browse 500+ professional photographers across India</p>
              </div>
              <button style={s.ctaBtn} onClick={() => navigate("/explore")}>Explore Now →</button>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div style={s.section}>
            <div style={s.table}>
              <div style={{ ...s.tableHead, gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.9fr 0.8fr" }}>
                {["Photographer", "Service", "Event Date", "Amount", "Status", "Action"].map(h => (
                  <span key={h} style={s.th}>{h}</span>
                ))}
              </div>
              {bookings.map(b => (
                <div key={b.id} style={{ ...s.tableRow, gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.9fr 0.8fr" }}>
                  <span style={s.td}>{b.photographer}</span>
                  <span style={s.td}>{b.service}</span>
                  <span style={s.td}>{b.event_date}</span>
                  <span style={{ ...s.td, color: "#2a5c45", fontWeight: 600 }}>${b.total_price.toLocaleString()}</span>
                  <span style={s.td}><StatusBadge status={b.status} /></span>
                  <span style={s.td}>
                    {b.status === "pending" && (
                      <button style={s.cancelBtn} onClick={() => cancelBooking(b.id)}>Cancel</button>
                    )}
                    {b.status !== "pending" && <span style={{ color: "#bbb", fontSize: "0.82rem" }}>—</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPLORE */}
        {activeTab === "explore" && (
          <div>
            <div style={s.categoryGrid}>
              {exploreCategories.map(cat => (
                <div key={cat.label} style={s.categoryCard} onClick={() => navigate("/explore")}>
                  <img src={cat.cover} alt={cat.label} style={s.categoryImg} />
                  <div style={s.categoryOverlay} />
                  <div style={s.categoryInfo}>
                    <span style={s.categoryEmoji}>{cat.emoji}</span>
                    <p style={s.categoryLabel}>{cat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.section}>
              <h2 style={{ ...s.sectionTitle, marginBottom: 16 }}>Popular Photographers</h2>
              <div style={s.photographerGrid}>
                {[
                  { name: "Arjun Mehta",  location: "Mumbai",    category: "Weddings",  starting_price: 15000, rating_avg: 4.9, img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80" },
                  { name: "Priya Sharma", location: "Delhi",     category: "Portraits", starting_price: 8000,  rating_avg: 4.7, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
                  { name: "Rohan Das",    location: "Bangalore", category: "Events",    starting_price: 10000, rating_avg: 4.8, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
                ].map(p => (
                  <div key={p.name} style={s.photographerCard}>
                    <img src={p.img} alt={p.name} style={s.photographerAvatar} />
                    <div style={s.photographerInfo}>
                      <p style={s.photographerName}>{p.name}</p>
                      <p style={s.photographerMeta}>📍 {p.location} · {p.category}</p>
                      <div style={s.photographerBottom}>
                        <span style={s.photographerRating}>★ {p.rating_avg}</span>
                        <span style={s.photographerPrice}>From ${p.starting_price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button style={s.viewBtn} onClick={() => navigate("/explore")}>View →</button>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button style={s.addBtn} onClick={() => navigate("/explore")}>Browse All Photographers →</button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS — matches users table columns */}
        {activeTab === "settings" && (
          <div style={s.settingsWrap}>
            <div style={s.settingsCard}>
              <h3 style={s.settingsSection}>Account Information</h3>
              {[
                { label: "Full Name", value: user?.name  || "", type: "text"  },
                { label: "Email",     value: user?.email || "", type: "email" },
                { label: "Phone",     value: user?.phone || "", type: "tel"   },
              ].map(field => (
                <div key={field.label} style={s.settingsField}>
                  <label style={s.settingsLabel}>{field.label}</label>
                  <input type={field.type} defaultValue={field.value}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    style={s.settingsInput} />
                </div>
              ))}
              <button style={s.saveBtn}>Save Changes</button>
            </div>

            <div style={{ ...s.settingsCard, marginTop: 20 }}>
              <h3 style={s.settingsSection}>Change Password</h3>
              {["Current Password", "New Password", "Confirm New Password"].map(label => (
                <div key={label} style={s.settingsField}>
                  <label style={s.settingsLabel}>{label}</label>
                  <input type="password" placeholder={`Enter ${label.toLowerCase()}`} style={s.settingsInput} />
                </div>
              ))}
              <button style={s.saveBtn}>Update Password</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  root: { display: "flex", minHeight: "100vh", background: "#f6f5f2", fontFamily: "Georgia, 'Times New Roman', serif" },
  sidebar: { width: 240, background: "#fff", borderRight: "1px solid #ece9e4", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "28px 0", position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  sideTop: { display: "flex", flexDirection: "column" },
  sideLogo: { display: "flex", alignItems: "center", gap: 8, padding: "0 24px 24px", cursor: "pointer", borderBottom: "1px solid #ece9e4", marginBottom: 24 },
  sideLogoText: { fontSize: "1.2rem", fontWeight: 700, color: "#2a5c45" },
  sideProfile: { display: "flex", alignItems: "center", gap: 12, padding: "0 24px 24px", borderBottom: "1px solid #ece9e4", marginBottom: 16 },
  sideAvatar: { width: 42, height: 42, borderRadius: "50%", background: "#e8a000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700 },
  sideName: { margin: 0, fontSize: "0.92rem", fontWeight: 600, color: "#1a1a1a" },
  sideRole: { margin: "3px 0 0", fontSize: "0.75rem", color: "#888" },
  sideNav: { display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" },
  sideNavBtn: { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "0.88rem", fontFamily: "Georgia, serif", textAlign: "left", transition: "all 0.15s" },
  sideLogout: { display: "flex", alignItems: "center", gap: 10, margin: "0 12px", padding: "11px 14px", borderRadius: 8, border: "none", background: "transparent", color: "#e05555", cursor: "pointer", fontSize: "0.88rem", fontFamily: "Georgia, serif" },
  main: { flex: 1, padding: "40px 48px", overflowY: "auto" },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 },
  pageTitle: { fontSize: "1.8rem", fontWeight: 400, fontStyle: "italic", color: "#1a1a1a", margin: "0 0 6px" },
  pageSubtitle: { fontSize: "0.9rem", color: "#888", margin: 0 },
  addBtn: { background: "#2a5c45", border: "none", color: "#fff", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: "0.88rem", fontWeight: 700, fontFamily: "Georgia, serif" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 },
  statCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 8 },
  statIcon: { marginBottom: 4 },
  statValue: { fontSize: "1.7rem", fontWeight: 700, color: "#1a1a1a", margin: 0 },
  statLabel: { fontSize: "0.78rem", color: "#aaa", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" },
  section: { marginBottom: 36 },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  sectionTitle: { fontSize: "1.15rem", fontWeight: 600, color: "#1a1a1a", margin: 0 },
  viewAllBtn: { background: "transparent", border: "none", color: "#2a5c45", cursor: "pointer", fontSize: "0.87rem", fontWeight: 600, fontFamily: "Georgia, serif" },
  table: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", overflow: "hidden" },
  tableHead: { display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.9fr", padding: "12px 20px", background: "#f6f5f2", borderBottom: "1px solid #ece9e4" },
  tableRow: { display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.9fr", padding: "14px 20px", borderBottom: "1px solid #f0ede8", alignItems: "center" },
  th: { fontSize: "0.74rem", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 },
  td: { fontSize: "0.88rem", color: "#333" },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 600 },
  cancelBtn: { padding: "5px 12px", background: "#fff0f0", border: "1px solid #e05555", color: "#e05555", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, fontFamily: "Georgia, serif" },
  exploreCta: { background: "#2a5c45", borderRadius: 14, padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  ctaTitle: { fontSize: "1.2rem", fontWeight: 600, color: "#fff", margin: "0 0 6px" },
  ctaSubtitle: { fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", margin: 0 },
  ctaBtn: { background: "#fff", border: "none", color: "#2a5c45", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, fontFamily: "Georgia, serif", whiteSpace: "nowrap" },
  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 36 },
  categoryCard: { borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", height: 160 },
  categoryImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  categoryOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,30,20,0.75) 0%, transparent 60%)" },
  categoryInfo: { position: "absolute", bottom: 14, left: 14, display: "flex", flexDirection: "column", gap: 4 },
  categoryEmoji: { fontSize: "1.4rem" },
  categoryLabel: { margin: 0, color: "#fff", fontWeight: 700, fontSize: "0.95rem" },
  photographerGrid: { display: "flex", flexDirection: "column", gap: 12 },
  photographerCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 },
  photographerAvatar: { width: 52, height: 52, borderRadius: "50%", objectFit: "cover" },
  photographerInfo: { flex: 1 },
  photographerName: { margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 600, color: "#1a1a1a" },
  photographerMeta: { margin: "0 0 6px", fontSize: "0.8rem", color: "#888" },
  photographerBottom: { display: "flex", gap: 16, alignItems: "center" },
  photographerRating: { fontSize: "0.82rem", color: "#e8a000", fontWeight: 600 },
  photographerPrice: { fontSize: "0.82rem", color: "#2a5c45", fontWeight: 600 },
  viewBtn: { background: "transparent", border: "1.5px solid #2a5c45", color: "#2a5c45", padding: "8px 18px", borderRadius: 7, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, fontFamily: "Georgia, serif" },
  loadingPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f7", fontFamily: "Georgia, 'Times New Roman', serif" },
  loadingCard: { background: "#fff", padding: "24px 32px", borderRadius: 18, boxShadow: "0 12px 30px rgba(0,0,0,0.08)", color: "#2a5c45", fontSize: "1rem", fontWeight: 700 },
  settingsWrap: { maxWidth: 600 },
  settingsCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "32px" },
  settingsSection: { fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 24px" },
  settingsField: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 },
  settingsLabel: { fontSize: "0.83rem", color: "#444", fontWeight: 600 },
  settingsInput: { border: "1.5px solid #e0dbd3", borderRadius: 8, padding: "10px 14px", fontSize: "0.91rem", color: "#1a1a1a", fontFamily: "Georgia, serif", outline: "none", background: "#faf9f7", width: "100%", boxSizing: "border-box" },
  saveBtn: { background: "#2a5c45", border: "none", color: "#fff", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: "0.92rem", fontWeight: 700, fontFamily: "Georgia, serif", marginTop: 8 },
};