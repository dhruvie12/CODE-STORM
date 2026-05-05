//export default function AdminDashboard() {
  //return <h1 style={{ padding: "40px" }}>Admin Dashboard</h1>;
//}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── Icons ────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  grid:     "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  camera:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  trash:    "M3 6h18 M19 6l-1 14H6L5 6 M10 6V4h4v2",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
};

// ── Mock Data ────────────────────────────────────────────────
const mockUsers = [
  { id: 1, name: "Arjun Mehta",  email: "arjun@email.com",  role: "photographer", city: "Mumbai",    joined: "2025-01-10", status: "active"   },
  { id: 2, name: "Priya Sharma", email: "priya@email.com",  role: "buyer",        city: "Delhi",     joined: "2025-02-14", status: "active"   },
  { id: 3, name: "Rohan Das",    email: "rohan@email.com",  role: "photographer", city: "Bangalore", joined: "2025-01-28", status: "active"   },
  { id: 4, name: "Sneha Rao",    email: "sneha@email.com",  role: "buyer",        city: "Pune",      joined: "2025-03-05", status: "inactive" },
  { id: 5, name: "Karan Joshi",  email: "karan@email.com",  role: "photographer", city: "Hyderabad", joined: "2025-02-20", status: "active"   },
  { id: 6, name: "Meera Iyer",   email: "meera@email.com",  role: "buyer",        city: "Chennai",   joined: "2025-03-12", status: "active"   },
];

const mockBookings = [
  { id: 1, client: "Sneha Rao",    photographer: "Arjun Mehta",  service: "Wedding Photography", date: "2025-08-14", status: "confirmed", amount: 18000 },
  { id: 2, client: "Priya Sharma", photographer: "Rohan Das",    service: "Portrait Session",    date: "2025-07-28", status: "pending",   amount: 8000  },
  { id: 3, client: "Meera Iyer",   photographer: "Karan Joshi",  service: "Corporate Event",     date: "2025-07-20", status: "completed", amount: 12000 },
  { id: 4, client: "Raj Kumar",    photographer: "Arjun Mehta",  service: "Wedding Photography", date: "2025-09-02", status: "pending",   amount: 20000 },
  { id: 5, client: "Anita Mehta",  photographer: "Priya Sharma", service: "Portrait Session",    date: "2025-06-30", status: "completed", amount: 7500  },
];

const mockPhotographers = [
  { id: 1, name: "Arjun Mehta",  location: "Mumbai",    category: "Weddings",   rating: 4.9, bookings: 12, status: "active",   img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80" },
  { id: 2, name: "Rohan Das",    location: "Bangalore", category: "Events",     rating: 4.8, bookings: 8,  status: "active",   img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
  { id: 3, name: "Karan Joshi",  location: "Hyderabad", category: "Commercial", rating: 5.0, bookings: 15, status: "active",   img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { id: 4, name: "Nisha Kapoor", location: "Pune",      category: "Fashion",    rating: 4.6, bookings: 6,  status: "inactive", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80" },
];

// ── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: "#fff8e6", color: "#b07d00", label: "Pending"   },
    confirmed: { bg: "#eef7f2", color: "#2a5c45", label: "Confirmed" },
    completed: { bg: "#f0f0f0", color: "#555",    label: "Completed" },
    cancelled: { bg: "#fef0f0", color: "#c0392b", label: "Cancelled" },
    active:    { bg: "#eef7f2", color: "#2a5c45", label: "Active"    },
    inactive:  { bg: "#fef0f0", color: "#c0392b", label: "Inactive"  },
  };
  const st = map[status] || map.pending;
  return (
    <span style={{ ...s.badge, background: st.bg, color: st.color }}>
      {st.label}
    </span>
  );
};

// ── Main Component ───────────────────────────────────────────
export default function AdminDashboard() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab]     = useState("overview");
  const [users, setUsers]             = useState(mockUsers);
  const [bookings]                    = useState(mockBookings);
  const [photographers, setPhotographers] = useState(mockPhotographers);
  const [searchUser, setSearchUser]   = useState("");
  const [filterRole, setFilterRole]   = useState("all");

  const handleLogout = () => { logout(); navigate("/"); };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const togglePhotographerStatus = (id) => {
    setPhotographers(prev =>
      prev.map(p => p.id === id
        ? { ...p, status: p.status === "active" ? "inactive" : "active" }
        : p
      )
    );
  };

  // stats
  const totalUsers         = users.length;
  const totalPhotographers = users.filter(u => u.role === "photographer").length;
  const totalClients       = users.filter(u => u.role === "buyer").length;
  const totalBookings      = bookings.length;
  const totalRevenue       = bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.amount, 0);
  const pendingBookings    = bookings.filter(b => b.status === "pending").length;

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const navItems = [
    { key: "overview",      label: "Overview",      icon: icons.grid     },
    { key: "users",         label: "Users",         icon: icons.users    },
    { key: "photographers", label: "Photographers", icon: icons.camera   },
    { key: "bookings",      label: "Bookings",      icon: icons.calendar },
  ];

  return (
    <div style={s.root}>

      {/* ── SIDEBAR ── */}
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
            <div style={s.sideAvatar}>
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p style={s.sideName}>{user?.name || "Admin"}</p>
              <p style={s.sideRole}>🛡 Administrator</p>
            </div>
          </div>

          <nav style={s.sideNav}>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  ...s.sideNavBtn,
                  background: activeTab === item.key ? "#eef7f2" : "transparent",
                  color:      activeTab === item.key ? "#2a5c45" : "#666",
                  fontWeight: activeTab === item.key ? 700 : 400,
                  borderLeft: activeTab === item.key ? "3px solid #2a5c45" : "3px solid transparent",
                }}
              >
                <Icon d={item.icon} size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <button style={s.sideLogout} onClick={handleLogout}>
          <Icon d={icons.logout} size={18} />
          Log Out
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={s.main}>

        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>
              {activeTab === "overview"      && "Admin Overview"}
              {activeTab === "users"         && "Manage Users"}
              {activeTab === "photographers" && "Manage Photographers"}
              {activeTab === "bookings"      && "All Bookings"}
            </h1>
            <p style={s.pageSubtitle}>
              {activeTab === "overview"      && `Welcome back, ${user?.name?.split(" ")[0] || "Admin"}!`}
              {activeTab === "users"         && `${filteredUsers.length} users found`}
              {activeTab === "photographers" && `${photographers.length} photographers registered`}
              {activeTab === "bookings"      && `${pendingBookings} pending booking${pendingBookings !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            <div style={s.statsGrid}>
              {[
                { label: "Total Users",        value: totalUsers,                          color: "#2a5c45", icon: icons.users    },
                { label: "Photographers",       value: totalPhotographers,                  color: "#1a6fa8", icon: icons.camera   },
                { label: "Clients",            value: totalClients,                        color: "#b07d00", icon: icons.users    },
                { label: "Total Bookings",     value: totalBookings,                       color: "#555",    icon: icons.calendar },
                { label: "Pending Bookings",   value: pendingBookings,                     color: "#c0392b", icon: icons.calendar },
                { label: "Platform Revenue",   value: `$${totalRevenue.toLocaleString()}`, color: "#2a5c45", icon: icons.shield   },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statIcon, color: stat.color }}>
                    <Icon d={stat.icon} size={22} />
                  </div>
                  <p style={s.statValue}>{stat.value}</p>
                  <p style={s.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* recent users */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Recent Users</h2>
                <button style={s.viewAllBtn} onClick={() => setActiveTab("users")}>View All →</button>
              </div>
              <div style={s.table}>
                <div style={{ ...s.tableHead, gridTemplateColumns: "1.5fr 1.8fr 0.8fr 0.8fr 0.8fr" }}>
                  {["Name", "Email", "Role", "City", "Status"].map(h => (
                    <span key={h} style={s.th}>{h}</span>
                  ))}
                </div>
                {users.slice(0, 4).map(u => (
                  <div key={u.id} style={{ ...s.tableRow, gridTemplateColumns: "1.5fr 1.8fr 0.8fr 0.8fr 0.8fr" }}>
                    <span style={s.td}>{u.name}</span>
                    <span style={{ ...s.td, color: "#888" }}>{u.email}</span>
                    <span style={s.td}>
                      <span style={{
                        ...s.rolePill,
                        background: u.role === "photographer" ? "#eef7f2" : "#fff8e6",
                        color:      u.role === "photographer" ? "#2a5c45" : "#b07d00",
                      }}>
                        {u.role === "photographer" ? "📷 Photographer" : "👤 Client"}
                      </span>
                    </span>
                    <span style={s.td}>{u.city}</span>
                    <span style={s.td}><StatusBadge status={u.status} /></span>
                  </div>
                ))}
              </div>
            </div>

            {/* recent bookings */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Recent Bookings</h2>
                <button style={s.viewAllBtn} onClick={() => setActiveTab("bookings")}>View All →</button>
              </div>
              <div style={s.table}>
                <div style={{ ...s.tableHead, gridTemplateColumns: "1fr 1fr 1.2fr 0.8fr 0.9fr" }}>
                  {["Client", "Photographer", "Service", "Amount", "Status"].map(h => (
                    <span key={h} style={s.th}>{h}</span>
                  ))}
                </div>
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} style={{ ...s.tableRow, gridTemplateColumns: "1fr 1fr 1.2fr 0.8fr 0.9fr" }}>
                    <span style={s.td}>{b.client}</span>
                    <span style={s.td}>{b.photographer}</span>
                    <span style={s.td}>{b.service}</span>
                    <span style={{ ...s.td, color: "#2a5c45", fontWeight: 600 }}>${b.amount.toLocaleString()}</span>
                    <span style={s.td}><StatusBadge status={b.status} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div style={s.section}>
            {/* search + filter */}
            <div style={s.filterBar}>
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                style={s.searchInput}
              />
              <div style={s.roleFilter}>
                {["all", "buyer", "photographer"].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    style={{
                      ...s.filterBtn,
                      background: filterRole === r ? "#2a5c45" : "#f4f1ec",
                      color:      filterRole === r ? "#fff" : "#555",
                      fontWeight: filterRole === r ? 700 : 400,
                    }}
                  >
                    {r === "all" ? "All" : r === "buyer" ? "Clients" : "Photographers"}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.table}>
              <div style={{ ...s.tableHead, gridTemplateColumns: "1.5fr 1.8fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr" }}>
                {["Name", "Email", "Role", "City", "Joined", "Status", "Action"].map(h => (
                  <span key={h} style={s.th}>{h}</span>
                ))}
              </div>
              {filteredUsers.map(u => (
                <div key={u.id} style={{ ...s.tableRow, gridTemplateColumns: "1.5fr 1.8fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr" }}>
                  <span style={s.td}>{u.name}</span>
                  <span style={{ ...s.td, color: "#888", fontSize: "0.82rem" }}>{u.email}</span>
                  <span style={s.td}>
                    <span style={{
                      ...s.rolePill,
                      background: u.role === "photographer" ? "#eef7f2" : "#fff8e6",
                      color:      u.role === "photographer" ? "#2a5c45" : "#b07d00",
                    }}>
                      {u.role === "photographer" ? "📷" : "👤"} {u.role === "photographer" ? "Photographer" : "Client"}
                    </span>
                  </span>
                  <span style={s.td}>{u.city}</span>
                  <span style={{ ...s.td, fontSize: "0.8rem", color: "#aaa" }}>{u.joined}</span>
                  <span style={s.td}><StatusBadge status={u.status} /></span>
                  <span style={s.td}>
                    <button style={s.deleteBtn} onClick={() => deleteUser(u.id)}>
                      <Icon d={icons.trash} size={14} />
                    </button>
                  </span>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div style={s.emptyState}>
                  <p style={{ color: "#bbb", margin: 0 }}>No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PHOTOGRAPHERS TAB ── */}
        {activeTab === "photographers" && (
          <div style={s.photographerGrid}>
            {photographers.map(p => (
              <div key={p.id} style={s.photographerCard}>
                <div style={s.photographerCardTop}>
                  <img src={p.img} alt={p.name} style={s.photographerAvatar} />
                  <StatusBadge status={p.status} />
                </div>
                <h3 style={s.photographerName}>{p.name}</h3>
                <p style={s.photographerMeta}>📍 {p.location} · {p.category}</p>
                <div style={s.photographerStats}>
                  <span style={s.photographerStat}>★ {p.rating}</span>
                  <span style={s.photographerStat}>📋 {p.bookings} bookings</span>
                </div>
                <div style={s.photographerActions}>
                  <button
                    style={{
                      ...s.toggleBtn,
                      background: p.status === "active" ? "#fef0f0" : "#eef7f2",
                      color:      p.status === "active" ? "#c0392b" : "#2a5c45",
                      border:     p.status === "active" ? "1px solid #e05555" : "1px solid #2a5c45",
                    }}
                    onClick={() => togglePhotographerStatus(p.id)}
                  >
                    {p.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <div style={s.section}>
            <div style={s.table}>
              <div style={{ ...s.tableHead, gridTemplateColumns: "1fr 1fr 1.2fr 0.9fr 0.8fr 0.9fr" }}>
                {["Client", "Photographer", "Service", "Date", "Amount", "Status"].map(h => (
                  <span key={h} style={s.th}>{h}</span>
                ))}
              </div>
              {bookings.map(b => (
                <div key={b.id} style={{ ...s.tableRow, gridTemplateColumns: "1fr 1fr 1.2fr 0.9fr 0.8fr 0.9fr" }}>
                  <span style={s.td}>{b.client}</span>
                  <span style={s.td}>{b.photographer}</span>
                  <span style={s.td}>{b.service}</span>
                  <span style={{ ...s.td, fontSize: "0.82rem", color: "#888" }}>{b.date}</span>
                  <span style={{ ...s.td, color: "#2a5c45", fontWeight: 600 }}>${b.amount.toLocaleString()}</span>
                  <span style={s.td}><StatusBadge status={b.status} /></span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const s = {
  root: {
    display: "flex", minHeight: "100vh",
    background: "#f6f5f2",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  sidebar: {
    width: 240, background: "#fff",
    borderRight: "1px solid #ece9e4",
    display: "flex", flexDirection: "column",
    justifyContent: "space-between",
    padding: "28px 0", position: "sticky",
    top: 0, height: "100vh", overflowY: "auto",
  },
  sideTop: { display: "flex", flexDirection: "column" },
  sideLogo: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "0 24px 24px", cursor: "pointer",
    borderBottom: "1px solid #ece9e4", marginBottom: 24,
  },
  sideLogoText: { fontSize: "1.2rem", fontWeight: 700, color: "#2a5c45" },
  sideProfile: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "0 24px 24px", borderBottom: "1px solid #ece9e4", marginBottom: 16,
  },
  sideAvatar: {
    width: 42, height: 42, borderRadius: "50%",
    background: "#c0392b", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.1rem", fontWeight: 700,
  },
  sideName: { margin: 0, fontSize: "0.92rem", fontWeight: 600, color: "#1a1a1a" },
  sideRole: { margin: "3px 0 0", fontSize: "0.75rem", color: "#888" },
  sideNav: { display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" },
  sideNavBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "11px 14px", borderRadius: 8, border: "none",
    cursor: "pointer", fontSize: "0.88rem",
    fontFamily: "Georgia, serif", textAlign: "left",
    transition: "all 0.15s",
  },
  sideLogout: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "0 12px", padding: "11px 14px",
    borderRadius: 8, border: "none", background: "transparent",
    color: "#e05555", cursor: "pointer", fontSize: "0.88rem",
    fontFamily: "Georgia, serif",
  },
  main: { flex: 1, padding: "40px 48px", overflowY: "auto" },
  pageHeader: {
    display: "flex", alignItems: "flex-start",
    justifyContent: "space-between", marginBottom: 32,
  },
  pageTitle: { fontSize: "1.8rem", fontWeight: 400, fontStyle: "italic", color: "#1a1a1a", margin: "0 0 6px" },
  pageSubtitle: { fontSize: "0.9rem", color: "#888", margin: 0 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 32 },
  statCard: {
    background: "#fff", borderRadius: 12,
    border: "1px solid #ece9e4", padding: "24px 20px",
    display: "flex", flexDirection: "column", gap: 8,
  },
  statIcon: { marginBottom: 4 },
  statValue: { fontSize: "1.7rem", fontWeight: 700, color: "#1a1a1a", margin: 0 },
  statLabel: { fontSize: "0.78rem", color: "#aaa", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" },
  section: { marginBottom: 36 },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  sectionTitle: { fontSize: "1.15rem", fontWeight: 600, color: "#1a1a1a", margin: 0 },
  viewAllBtn: {
    background: "transparent", border: "none", color: "#2a5c45",
    cursor: "pointer", fontSize: "0.87rem", fontWeight: 600,
    fontFamily: "Georgia, serif",
  },
  table: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", overflow: "hidden" },
  tableHead: {
    display: "grid", padding: "12px 20px",
    background: "#f6f5f2", borderBottom: "1px solid #ece9e4",
  },
  tableRow: {
    display: "grid", padding: "14px 20px",
    borderBottom: "1px solid #f0ede8", alignItems: "center",
  },
  th: { fontSize: "0.74rem", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 },
  td: { fontSize: "0.88rem", color: "#333" },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 600 },
  rolePill: { padding: "4px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 600 },
  filterBar: { display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap" },
  searchInput: {
    flex: 1, border: "1.5px solid #e0dbd3", borderRadius: 8,
    padding: "10px 16px", fontSize: "0.9rem", color: "#1a1a1a",
    fontFamily: "Georgia, serif", outline: "none", background: "#fff",
    minWidth: 200,
  },
  roleFilter: { display: "flex", gap: 8 },
  filterBtn: {
    padding: "8px 18px", borderRadius: 20, border: "none",
    cursor: "pointer", fontSize: "0.84rem",
    fontFamily: "Georgia, serif", transition: "all 0.2s",
  },
  deleteBtn: {
    background: "#fef0f0", border: "1px solid #e05555",
    color: "#e05555", borderRadius: 6, cursor: "pointer",
    padding: "5px 8px", display: "flex", alignItems: "center",
  },
  emptyState: { padding: "30px", textAlign: "center" },
  photographerGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 },
  photographerCard: {
    background: "#fff", borderRadius: 12,
    border: "1px solid #ece9e4", padding: "20px",
    display: "flex", flexDirection: "column", gap: 10,
  },
  photographerCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  photographerAvatar: { width: 50, height: 50, borderRadius: "50%", objectFit: "cover" },
  photographerName: { fontSize: "0.98rem", fontWeight: 600, color: "#1a1a1a", margin: 0 },
  photographerMeta: { fontSize: "0.78rem", color: "#888", margin: 0 },
  photographerStats: { display: "flex", gap: 12 },
  photographerStat: { fontSize: "0.78rem", color: "#555" },
  photographerActions: { marginTop: 4 },
  toggleBtn: {
    width: "100%", padding: "8px", borderRadius: 7,
    cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
    fontFamily: "Georgia, serif",
  },
};