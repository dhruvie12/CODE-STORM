export default function HowItWorks() {

  return (
    <div style={s.root}>
      <div style={s.container}>
        <h1 style={s.title}>How LensLink Works</h1>

        <div style={s.stepsGrid}>
          {[
            { num: 1, icon: "🔍", title: "Browse Photographers", desc: "Explore our community of talented photographers. Filter by category, location, price, and ratings to find the perfect match for your needs." },
            { num: 2, icon: "📋", title: "Compare Packages", desc: "Review detailed service offerings, pricing, portfolios, and availability. Check ratings and client reviews to make an informed decision." },
            { num: 3, icon: "📅", title: "Book Instantly", desc: "Send a booking request directly through LensLink. No phone calls needed — communicate with photographers securely in your dashboard." },
            { num: 4, icon: "✅", title: "Collaborate & Deliver", desc: "Finalize details, share requirements, and coordinate timing. Photographers deliver edited photos directly to you." },
          ].map(step => (
            <div key={step.num} style={s.stepCard}>
              <div style={s.stepNum}>{step.num}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={s.faqSection}>
          <h2 style={s.faqTitle}>Frequently Asked Questions</h2>
          <div style={s.faqGrid}>
            {[
              { q: "How does payment work?", a: "You pay after confirming the booking. LensLink securely processes all payments and holds funds until the photographer delivers the final photos." },
              { q: "Can I communicate directly with photographers?", a: "Yes! Once you book, you get a private chat to discuss details, schedules, and any special requests." },
              { q: "What if I'm not satisfied?", a: "We offer a satisfaction guarantee. If you're unhappy, contact our support team within 7 days of delivery." },
              { q: "How are photographers verified?", a: "All photographers undergo a review process. We verify their work and collect feedback from clients." },
            ].map((faq, i) => (
              <div key={i} style={s.faqCard}>
                <h4 style={s.faqQuestion}>{faq.q}</h4>
                <p style={s.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { fontFamily: "'Georgia', 'Times New Roman', serif", background: "#faf9f7", color: "#1a1a1a", minHeight: "100vh", padding: "60px 20px" },
  container: { maxWidth: 1000, margin: "0 auto" },
  title: { fontSize: "2.5rem", fontWeight: 400, fontStyle: "italic", marginBottom: 48, textAlign: "center" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 30, marginBottom: 60 },
  stepCard: { background: "#fff", borderRadius: 14, border: "1px solid #ece9e4", padding: "32px 28px", textAlign: "center", position: "relative" },
  stepNum: { position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", width: 30, height: 30, background: "#2a5c45", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  stepIcon: { fontSize: "2.5rem", marginBottom: 16 },
  stepTitle: { fontSize: "1.1rem", fontWeight: 600, marginBottom: 10, margin: "20px 0 10px" },
  stepDesc: { fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: 0 },
  faqSection: { marginTop: 60 },
  faqTitle: { fontSize: "1.8rem", fontWeight: 400, fontStyle: "italic", marginBottom: 32, textAlign: "center" },
  faqGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 },
  faqCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "24px" },
  faqQuestion: { fontSize: "1rem", fontWeight: 600, color: "#2a5c45", margin: "0 0 10px" },
  faqAnswer: { fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: 0 },
};
