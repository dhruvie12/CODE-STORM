import { useNavigate } from "react-router-dom";

export default function ForPhotographers() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>
      <div style={s.container}>
        <div style={s.hero}>
          <h1 style={s.title}>Grow Your Photography Business</h1>
          <p style={s.subtitle}>Join 500+ photographers on LensLink and connect with clients who value your work</p>
          <button style={s.heroBtn} onClick={() => navigate("/register")}>Sign Up as Photographer →</button>
        </div>

        <div style={s.benefitsSection}>
          <h2 style={s.sectionTitle}>Why Join LensLink?</h2>
          <div style={s.benefitsGrid}>
            {[
              { icon: "📊", title: "Reach More Clients", desc: "Access a growing network of clients actively looking for photographers in your area." },
              { icon: "💰", title: "Get Paid Fairly", desc: "Set your own rates and keep 85% of earnings. No hidden fees — transparent pricing." },
              { icon: "📱", title: "Easy Management", desc: "Dashboard to manage bookings, portfolios, and client communication all in one place." },
              { icon: "⭐", title: "Build Your Reputation", desc: "Earn ratings and reviews to establish credibility and attract more quality clients." },
              { icon: "🛡️", title: "Secure Payments", desc: "All payments processed securely through LensLink. Get paid on time, every time." },
              { icon: "🚀", title: "Grow Without Overhead", desc: "No studio rent, assistant costs, or marketing spend required to get started." },
            ].map((benefit, i) => (
              <div key={i} style={s.benefitCard}>
                <div style={s.benefitIcon}>{benefit.icon}</div>
                <h3 style={s.benefitTitle}>{benefit.title}</h3>
                <p style={s.benefitDesc}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={s.howSection}>
          <h2 style={s.sectionTitle}>How to Get Started</h2>
          <div style={s.stepsGrid}>
            {[
              { num: 1, title: "Create Your Profile", desc: "Sign up, add your experience, and upload a profile photo. Takes just 5 minutes." },
              { num: 2, title: "Showcase Your Work", desc: "Upload your portfolio. Display 10-20 of your best work samples by category." },
              { num: 3, title: "Set Your Packages", desc: "Define photography packages and pricing. Clients can book based on your offerings." },
              { num: 4, title: "Accept Bookings", desc: "Receive booking requests, chat with clients, and complete projects at your pace." },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={s.stepNum}>{step.num}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={s.statsSection}>
          <h2 style={s.sectionTitle}>Our Community</h2>
          <div style={s.statsGrid}>
            {[
              { num: "500+", label: "Active Photographers" },
              { num: "12K+", label: "Successful Bookings" },
              { num: "4.9 ★", label: "Average Rating" },
              { num: "180+", label: "Cities Covered" },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statNum}>{stat.num}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.ctaSection}>
          <h2 style={s.ctaTitle}>Ready to Grow Your Business?</h2>
          <p style={s.ctaSubtitle}>Join photographers already earning on LensLink</p>
          <button style={s.ctaBtn} onClick={() => navigate("/register")}>Get Started Free →</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { fontFamily: "'Georgia', 'Times New Roman', serif", background: "#faf9f7", color: "#1a1a1a", minHeight: "100vh" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "40px 20px" },
  hero: { textAlign: "center", padding: "60px 20px", marginBottom: 60 },
  title: { fontSize: "2.8rem", fontWeight: 400, fontStyle: "italic", marginBottom: 16 },
  subtitle: { fontSize: "1.1rem", color: "#666", marginBottom: 32, lineHeight: 1.6 },
  heroBtn: { background: "#2a5c45", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Georgia, serif" },
  benefitsSection: { marginBottom: 80 },
  sectionTitle: { fontSize: "2rem", fontWeight: 400, fontStyle: "italic", marginBottom: 40, textAlign: "center" },
  benefitsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 },
  benefitCard: { background: "#fff", borderRadius: 14, border: "1px solid #ece9e4", padding: "32px 28px", textAlign: "center" },
  benefitIcon: { fontSize: "2.5rem", marginBottom: 16 },
  benefitTitle: { fontSize: "1.1rem", fontWeight: 600, marginBottom: 10, color: "#2a5c45", margin: "0 0 10px" },
  benefitDesc: { fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: 0 },
  howSection: { marginBottom: 80 },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 },
  stepCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "28px 24px", position: "relative" },
  stepNum: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: "#eef7f2", color: "#2a5c45", borderRadius: "50%", fontWeight: 700, fontSize: "1.2rem", marginBottom: 16 },
  stepTitle: { fontSize: "1rem", fontWeight: 600, marginBottom: 10, margin: "0 0 10px", color: "#1a1a1a" },
  stepDesc: { fontSize: "0.88rem", color: "#666", lineHeight: 1.6, margin: 0 },
  statsSection: { marginBottom: 80 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 },
  statCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "40px 24px", textAlign: "center" },
  statNum: { fontSize: "2.2rem", fontWeight: 700, color: "#2a5c45", marginBottom: 8 },
  statLabel: { fontSize: "0.9rem", color: "#666", fontWeight: 600 },
  ctaSection: { background: "#2a5c45", borderRadius: 16, padding: "60px 40px", textAlign: "center", color: "#fff" },
  ctaTitle: { fontSize: "2rem", fontWeight: 400, fontStyle: "italic", marginBottom: 12 },
  ctaSubtitle: { fontSize: "1rem", color: "rgba(255,255,255,0.8)", marginBottom: 32 },
  ctaBtn: { background: "#fff", color: "#2a5c45", border: "none", padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Georgia, serif" },
};
