import { useState, useEffect } from "react";

const categories = ["All", "Weddings", "Portraits", "Events", "Commercial", "Fashion"];


const mockPhotographers = [
  { id: 1, name: "Arjun Mehta", category: "Weddings", location: "Mumbai", price: "$15,000", rating: 4.9, img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80", cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80" },
  { id: 2, name: "Priya Sharma", category: "Portraits", location: "Delhi", price: "$8,000", rating: 4.7, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", cover: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { id: 3, name: "Rohan Das", category: "Events", location: "Bangalore", price: "$10,000", rating: 4.8, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { id: 4, name: "Nisha Kapoor", category: "Fashion", location: "Pune", price: "$12,000", rating: 4.6, img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80", cover: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
  { id: 5, name: "Karan Joshi", category: "Commercial", location: "Hyderabad", price: "$20,000", rating: 5.0, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", cover: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&q=80" },
  { id: 6, name: "Meera Iyer", category: "Weddings", location: "Chennai", price: "$18,000", rating: 4.9, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
];

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#e8a000" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CameraIcon = ({ size = 26, color = "#2a5c45" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const filtered = mockPhotographers.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={s.root}>


      {/* HERO */}
      <section style={s.hero}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={{
          ...s.heroContent,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.85s ease",
        }}>
          <span style={s.eyebrow}>✦ Photography Marketplace</span>
          <h1 style={s.heroTitle}>
            Find the perfect<br />
            <em style={s.heroAccent}>photographer for you</em>
          </h1>
          <p style={s.heroSub}>
            Browse professional portfolios, compare packages, and book instantly —
            weddings, portraits, events &amp; more.
          </p>
          <div style={s.searchBar}>
            <span style={s.searchIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              style={s.searchInput}
              placeholder="Search by photographer name or city…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button style={s.searchBtn}>Search</button>
          </div>
          <div style={s.stats}>
            {[["500+", "Photographers"], ["12K+", "Bookings Made"], ["4.9 ★", "Avg Rating"]].map(([n, l]) => (
              <div key={l} style={s.statItem}>
                <span style={s.statNum}>{n}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...s.heroVisual, opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.3s" }}>
          <div style={s.previewStack}>
            <div style={{ ...s.previewCard, top: 0, left: 0, zIndex: 3 }}>
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=340&q=80" alt="" style={s.previewImg} />
              <div style={s.previewLabel}>Wedding · Mumbai</div>
            </div>
            <div style={{ ...s.previewCard, top: "32px", left: "30px", zIndex: 2, opacity: 0.8 }}>
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=340&q=80" alt="" style={s.previewImg} />
            </div>
            <div style={{ ...s.previewCard, top: "62px", left: "58px", zIndex: 1, opacity: 0.55 }}>
              <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=340&q=80" alt="" style={s.previewImg} />
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section style={s.filterSection}>
        <p style={s.filterLabel}>Browse by category</p>
        <div style={s.filterRow}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ ...s.filterBtn, ...(activeCategory === cat ? s.filterActive : {}) }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section style={s.gridSection}>
        <div style={s.gridHeader}>
          <h2 style={s.gridTitle}>
            {activeCategory === "All" ? "Featured Photographers" : `${activeCategory} Photographers`}
          </h2>
          <span style={s.gridCount}>{filtered.length} found</span>
        </div>
        <div style={s.grid}>
          {filtered.map((p, i) => (
            <div key={p.id}
              style={{
                ...s.card,
                opacity: visible ? 1 : 0,
                transform: hoveredCard === p.id ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hoveredCard === p.id ? "0 16px 48px rgba(42,92,69,0.14)" : "0 2px 16px rgba(0,0,0,0.07)",
                transition: `transform 0.25s ease, box-shadow 0.25s ease, opacity 0.5s ease ${i * 0.07}s`,
              }}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={s.cardImgWrap}>
                <img src={p.cover} alt={p.name} style={s.cardImg} />
                <span style={s.cardCatTag}>{p.category}</span>
              </div>
              <div style={s.cardBody}>
                <div style={s.cardTop}>
                  <img src={p.img} alt={p.name} style={s.avatar} />
                  <div>
                    <p style={s.cardName}>{p.name}</p>
                    <p style={s.cardLoc}>📍 {p.location}</p>
                  </div>
                </div>
                <div style={s.cardMeta}>
                  <span style={s.rating}><StarIcon /> &nbsp;{p.rating}</span>
                  <span style={s.price}>From {p.price}</span>
                </div>
                <button style={{
                  ...s.cardBtn,
                  background: hoveredCard === p.id ? "#2a5c45" : "transparent",
                  color: hoveredCard === p.id ? "#fff" : "#2a5c45",
                  transition: "all 0.25s ease",
                }}>
                  View Portfolio →
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={s.empty}>
            <CameraIcon size={40} color="#ccc" />
            <p>No photographers found. Try a different filter or search.</p>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section style={s.howSection}>
        <p style={s.howEyebrow}>Simple &amp; fast</p>
        <h2 style={s.howTitle}>How LensLink works</h2>
        <div style={s.stepsGrid}>
          {[
            { icon: "🔍", title: "Browse Portfolios", desc: "Filter by category, location, and price range to find the right fit." },
            { icon: "📋", title: "Compare Packages", desc: "Review service details, pricing, and check photographer availability." },
            { icon: "📅", title: "Book Instantly", desc: "Send a booking request in one step — no phone calls needed." },
          ].map(step => (
            <div key={step.title} style={s.stepCard}>
              <div style={s.stepIcon}>{step.icon}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaInner}>
          <div>
            <h2 style={s.ctaTitle}>Are you a photographer?</h2>
            <p style={s.ctaSub}>Join LensLink and grow your client base across India — for free.</p>
          </div>
          <button style={s.ctaBtn}>Create Your Profile →</button>
        </div>
      </section>

      
    </div>
  );
}

const s = {
  root: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: "#faf9f7", color: "#1a1a1a",
    minHeight: "100vh", overflowX: "hidden",
  },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 60px", background: "#fff",
    borderBottom: "1px solid #ece9e4",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
  },
  navBrand: { display: "flex", alignItems: "center", gap: 10 },
  navLogo: { fontSize: "1.45rem", fontWeight: 700, color: "#2a5c45", letterSpacing: "0.03em" },
  navLinks: { display: "flex", gap: 34 },
  navLink: { color: "#555", textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.03em" },
  navActions: { display: "flex", gap: 10 },
  btnGhost: {
    background: "transparent", border: "1.5px solid #ddd", color: "#333",
    padding: "8px 20px", borderRadius: 7, cursor: "pointer",
    fontSize: "0.87rem", fontFamily: "Georgia, serif",
  },
  btnPrimary: {
    background: "#2a5c45", border: "none", color: "#fff",
    padding: "8px 20px", borderRadius: 7, cursor: "pointer",
    fontSize: "0.87rem", fontWeight: 700, fontFamily: "Georgia, serif",
  },
  hero: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "80px 60px 70px",
    background: "linear-gradient(135deg,#eef7f2 0%,#faf9f7 55%,#fef6ec 100%)",
    position: "relative", overflow: "hidden", gap: 40,
  },
  blob1: {
    position: "absolute", top: -80, right: 320, width: 400, height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle,rgba(42,92,69,.07) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: -60, left: "40%", width: 300, height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle,rgba(232,160,0,.07) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: { flex: 1, maxWidth: 560 },
  eyebrow: {
    display: "inline-block", fontSize: "0.77rem", color: "#2a5c45",
    letterSpacing: "0.12em", textTransform: "uppercase",
    background: "rgba(42,92,69,.09)", padding: "5px 14px", borderRadius: 20, marginBottom: 22,
  },
  heroTitle: {
    fontSize: "clamp(2.4rem,4.5vw,3.8rem)", lineHeight: 1.12,
    fontWeight: 400, margin: "0 0 20px", color: "#1a1a1a",
  },
  heroAccent: { color: "#2a5c45", fontStyle: "italic" },
  heroSub: { fontSize: "1rem", color: "#666", lineHeight: 1.75, marginBottom: 34 },
  searchBar: {
    display: "flex", alignItems: "center", background: "#fff",
    border: "1.5px solid #e0dbd3", borderRadius: 10, overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: 36,
  },
  searchIcon: { padding: "0 14px", display: "flex", alignItems: "center" },
  searchInput: {
    flex: 1, border: "none", outline: "none", background: "transparent",
    color: "#1a1a1a", padding: "13px 0", fontSize: "0.93rem", fontFamily: "Georgia, serif",
  },
  searchBtn: {
    background: "#2a5c45", border: "none", color: "#fff",
    padding: "13px 28px", cursor: "pointer", fontSize: "0.88rem",
    fontWeight: 700, letterSpacing: "0.05em", fontFamily: "Georgia, serif",
  },
  stats: { display: "flex", gap: 36 },
  statItem: { display: "flex", flexDirection: "column", gap: 3 },
  statNum: { fontSize: "1.4rem", fontWeight: 700, color: "#2a5c45" },
  statLabel: { fontSize: "0.74rem", color: "#999", letterSpacing: "0.07em", textTransform: "uppercase" },
  heroVisual: { flexShrink: 0 },
  previewStack: { position: "relative", width: 280, height: 360 },
  previewCard: {
    position: "absolute", width: 220, borderRadius: 14,
    overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.13)",
    border: "3px solid #fff",
  },
  previewImg: { width: "100%", height: 270, objectFit: "cover", display: "block" },
  previewLabel: {
    padding: "9px 14px", background: "#fff", fontSize: "0.77rem",
    color: "#2a5c45", fontWeight: 600, letterSpacing: "0.04em",
  },
  filterSection: {
    padding: "40px 60px 16px", background: "#fff",
    borderBottom: "1px solid #ece9e4",
  },
  filterLabel: {
    fontSize: "0.74rem", color: "#bbb", letterSpacing: "0.1em",
    textTransform: "uppercase", marginBottom: 14,
  },
  filterRow: { display: "flex", gap: 10, flexWrap: "wrap", paddingBottom: 10 },
  filterBtn: {
    padding: "8px 20px", borderRadius: 30,
    background: "#f4f1ec", border: "1.5px solid transparent",
    color: "#555", cursor: "pointer", fontSize: "0.87rem",
    fontFamily: "Georgia, serif", letterSpacing: "0.03em", transition: "all 0.2s",
  },
  filterActive: {
    background: "#2a5c45", border: "1.5px solid #2a5c45", color: "#fff", fontWeight: 700,
  },
  gridSection: { padding: "50px 60px 80px" },
  gridHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 30 },
  gridTitle: { fontSize: "1.55rem", fontWeight: 400, fontStyle: "italic", color: "#1a1a1a" },
  gridCount: { fontSize: "0.85rem", color: "#aaa" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 26 },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #ece9e4", overflow: "hidden", cursor: "pointer" },
  cardImgWrap: { position: "relative", height: 195 },
  cardImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  cardCatTag: {
    position: "absolute", top: 12, right: 12,
    background: "rgba(255,255,255,0.92)", color: "#2a5c45",
    padding: "4px 12px", borderRadius: 20, fontSize: "0.74rem",
    fontWeight: 600, letterSpacing: "0.05em",
  },
  cardBody: { padding: "18px 20px 20px" },
  cardTop: { display: "flex", gap: 12, alignItems: "center", marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #e8f2ed" },
  cardName: { margin: 0, fontSize: "1rem", fontWeight: 600, color: "#1a1a1a" },
  cardLoc: { margin: "4px 0 0", fontSize: "0.8rem", color: "#999" },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  rating: { display: "flex", alignItems: "center", gap: 4, fontSize: "0.86rem", color: "#e8a000", fontWeight: 600 },
  price: { fontSize: "0.86rem", color: "#2a5c45", fontWeight: 700 },
  cardBtn: {
    width: "100%", padding: 10, borderRadius: 8,
    border: "1.5px solid #2a5c45", cursor: "pointer",
    fontSize: "0.86rem", letterSpacing: "0.05em",
    fontFamily: "Georgia, serif", fontWeight: 600,
  },
  empty: {
    textAlign: "center", padding: "60px 0", color: "#bbb",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 16, fontSize: "0.95rem",
  },
  howSection: {
    padding: "80px 60px",
    background: "linear-gradient(180deg,#eef7f2 0%,#faf9f7 100%)",
    textAlign: "center",
  },
  howEyebrow: {
    fontSize: "0.74rem", color: "#2a5c45", letterSpacing: "0.12em",
    textTransform: "uppercase", marginBottom: 10,
  },
  howTitle: { fontSize: "2rem", fontWeight: 400, fontStyle: "italic", marginBottom: 48, color: "#1a1a1a" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 30, maxWidth: 900, margin: "0 auto" },
  stepCard: {
    background: "#fff", borderRadius: 14, padding: "36px 28px",
    border: "1px solid #ece9e4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  stepIcon: { fontSize: "2rem", marginBottom: 18 },
  stepTitle: { fontSize: "1.05rem", fontWeight: 600, marginBottom: 10, color: "#1a1a1a" },
  stepDesc: { fontSize: "0.9rem", color: "#777", lineHeight: 1.7 },
  ctaSection: { padding: "60px", background: "#fff", borderTop: "1px solid #ece9e4" },
  ctaInner: {
    background: "#2a5c45", borderRadius: 16, padding: "48px 56px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 30, flexWrap: "wrap",
    boxShadow: "0 8px 32px rgba(42,92,69,0.18)",
  },
  ctaTitle: { fontSize: "1.7rem", fontWeight: 400, fontStyle: "italic", color: "#fff", marginBottom: 8 },
  ctaSub: { color: "rgba(255,255,255,0.75)", fontSize: "0.95rem" },
  ctaBtn: {
    background: "#fff", border: "none", color: "#2a5c45",
    padding: "14px 32px", borderRadius: 8, cursor: "pointer",
    fontSize: "0.95rem", fontWeight: 700, fontFamily: "Georgia, serif",
    letterSpacing: "0.04em", whiteSpace: "nowrap",
  },
  footer: {
    padding: "26px 60px", borderTop: "1px solid #ece9e4",
    display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff",
  },
  footerBrand: { display: "flex", alignItems: "center" },
  footerText: { fontSize: "0.8rem", color: "#bbb" },
  footerLinks: { display: "flex", gap: 22 },
  footerLink: { fontSize: "0.8rem", color: "#aaa", textDecoration: "none" },
};