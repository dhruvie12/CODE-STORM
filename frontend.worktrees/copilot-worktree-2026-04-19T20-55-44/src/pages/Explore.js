import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const categories = ["All", "Weddings", "Portraits", "Events", "Commercial", "Fashion"];

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#e8a000" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingNotes, setBookingNotes] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.map((service) => ({
          ...service,
          category: service.category || service.Category?.category_name || "General",
          photographerId: service.photographerId || service.photographer_id,
          photographerName: service.photographerName || service.photographer?.user?.full_name || "Photographer",
          photographerImage: service.photographerImage || service.photographer?.profile_image || null,
          description: service.description || "Professional photography package.",
          priceLabel: `$${parseFloat(service.price || 0).toLocaleString()}`,
        })));
      } catch (error) {
        console.error(error);
        alert("Unable to load services. Please try again later.");
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchCat = activeCategory === "All" || service.category === activeCategory;
    const searchText = `${service.name} ${service.description}`.toLowerCase();
    const matchSearch = searchText.includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const openBookingModal = async (service) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.activeRole !== "client") {
      alert("Please log in as a client to book a photographer.");
      return;
    }

    setSelectedService(service);
    setBookingModalOpen(true);
    setSelectedAvailability("");
    setBookingNotes("");
    setAvailabilities([]);
    setBookingLoading(true);

    try {
      const response = await api.get(`/availability/${service.photographerId}`);
      setAvailabilities(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load available dates for this service.");
    } finally {
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setBookingModalOpen(false);
    setSelectedService(null);
    setSelectedAvailability("");
    setBookingNotes("");
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedAvailability) {
      alert("Please select a date before booking.");
      return;
    }

    setBookingLoading(true);
    try {
      await api.post("/bookings", {
        service_id: selectedService.service_id,
        availability_id: selectedAvailability,
        notes: bookingNotes,
      });
      setTimeout(() => {
        closeModal();
        navigate("/dashboard/client");
      }, 900);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to submit booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.container}>
        <h1 style={s.title}>Explore Services</h1>
        <p style={s.subtitle}>Browse available packages and book the photographer you love.</p>

        <div style={s.filterSection}>
          <div>
            <p style={s.filterLabel}>Filter by category</p>
            <div style={s.filterRow}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ ...s.filterBtn, ...(activeCategory === cat ? s.filterActive : {}) }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={s.searchWrap}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, categories, or style"
              style={s.searchInput}
            />
          </div>
        </div>

        <div style={s.gridHeader}>
          <div>
            <h2 style={s.gridTitle}>
              {activeCategory === "All" ? "Featured Packages" : `${activeCategory} Packages`}
            </h2>
            <p style={s.gridSubtitle}>{loadingServices ? "Loading available packages..." : `${filteredServices.length} results`}</p>
          </div>
          <button style={s.ctaBtn} onClick={() => navigate("/dashboard/client")}>My Bookings</button>
        </div>

        <div style={s.grid}>
          {loadingServices && <div style={s.loadingText}>Loading services…</div>}
          {!loadingServices && filteredServices.length === 0 && (
            <div style={s.emptyState}>No services matched your search. Try a different keyword.</div>
          )}

          {filteredServices.map((service) => (
            <div key={service.service_id} style={s.card}>
              <div style={s.cardImgWrap}>
                <img
                  src={service.photographerImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80"}
                  alt={service.name}
                  style={s.cardImg}
                />
                <span style={s.cardCatTag}>{service.category}</span>
              </div>
              <div style={s.cardBody}>
                <p style={s.cardName}>{service.name}</p>
                <p style={s.cardLoc}>📍 {service.photographerName}</p>
                <p style={s.cardDescription}>{service.description}</p>
                <div style={s.cardMeta}>
                  <span style={s.price}>{service.priceLabel}</span>
                  <span style={s.rating}><StarIcon /> &nbsp;{service.rating || "4.8"}</span>
                </div>
                <button style={s.cardBtn} onClick={() => openBookingModal(service)}>
                  Book Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {bookingModalOpen && selectedService && (
        <div style={s.modalOverlay} onClick={closeModal}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div>
                <h3 style={s.modalTitle}>Book {selectedService.name}</h3>
                <p style={s.modalSubtitle}>Select a date and confirm your booking request.</p>
              </div>
              <button style={s.closeButton} onClick={closeModal}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={s.modalField}>
                <label style={s.fieldLabel}>Package</label>
                <div style={s.fieldValue}>{selectedService.name}</div>
              </div>
              <div style={s.modalField}>
                <label style={s.fieldLabel}>Price</label>
                <div style={s.fieldValue}>{selectedService.priceLabel}</div>
              </div>
              <div style={s.modalField}>
                <label style={s.fieldLabel}>Choose a date</label>
                {bookingLoading ? (
                  <div style={s.fieldValue}>Loading dates…</div>
                ) : availabilities.length === 0 ? (
                  <div style={s.fieldValue}>No available dates for this photographer yet.</div>
                ) : (
                  <select
                    style={s.select}
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                  >
                    <option value="">Select a date</option>
                    {availabilities.map((slot) => (
                      <option key={slot.availability_id} value={slot.availability_id}>
                        {slot.available_date}
                      </option>
                    ))}
                  </select>
                )}
              </div>
                      <div style={s.modalField}>
                <label style={s.fieldLabel}>Notes (optional)</label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  style={s.textarea}
                  placeholder="A short note will help the photographer prepare."
                />
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.secondaryBtn} onClick={closeModal}>Cancel</button>
              <button
                style={s.primaryBtn}
                onClick={handleBooking}
                disabled={bookingLoading || availabilities.length === 0}
              >
                {bookingLoading ? "Sending request…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: { fontFamily: "'Georgia', 'Times New Roman', serif", background: "#faf9f7", color: "#1a1a1a", minHeight: "100vh", padding: "40px 20px" },
  container: { maxWidth: 1200, margin: "0 auto" },
  title: { fontSize: "2rem", fontWeight: 400, fontStyle: "italic", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: "1rem", color: "#666", textAlign: "center", marginBottom: 30 },
  filterSection: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 30 },
  filterLabel: { fontSize: "0.74rem", color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 },
  filterRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  searchWrap: { minWidth: 240, flex: 1 },
  searchInput: { width: "100%", maxWidth: 420, padding: "12px 16px", borderRadius: 10, border: "1px solid #dcd8d2", fontSize: "0.95rem", fontFamily: "Georgia, serif", outline: "none", color: "#1a1a1a", background: "#fff" },
  filterBtn: { padding: "8px 20px", borderRadius: 30, background: "#f4f1ec", border: "1.5px solid transparent", color: "#555", cursor: "pointer", fontSize: "0.87rem", fontFamily: "Georgia, serif", transition: "all 0.2s" },
  filterActive: { background: "#2a5c45", border: "1.5px solid #2a5c45", color: "#fff", fontWeight: 700 },
  gridHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 24 },
  gridTitle: { fontSize: "1.55rem", fontWeight: 400, fontStyle: "italic", margin: 0 },
  gridSubtitle: { margin: 0, color: "#777" },
  ctaBtn: { background: "#2a5c45", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, fontFamily: "Georgia, serif" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 },
  loadingText: { gridColumn: "1 / -1", padding: 24, background: "#fff", borderRadius: 16, border: "1px solid #ece9e4", textAlign: "center", color: "#777" },
  emptyState: { gridColumn: "1 / -1", padding: 24, background: "#fff", borderRadius: 16, border: "1px solid #ece9e4", textAlign: "center", color: "#777" },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #ece9e4", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.25s" },
  cardImgWrap: { position: "relative", minHeight: 180 },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardCatTag: { position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.92)", color: "#2a5c45", padding: "4px 12px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 600 },
  cardBody: { padding: "22px 20px", display: "flex", flexDirection: "column", gap: 16, flex: 1 },
  cardTop: { display: "flex", gap: 12, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", background: "#f4f1ec" },
  cardName: { margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a" },
  cardLoc: { margin: "4px 0 0", fontSize: "0.86rem", color: "#777" },
  cardDescription: { fontSize: "0.9rem", lineHeight: 1.6, color: "#555", flex: 1 },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  rating: { display: "flex", alignItems: "center", gap: 4, fontSize: "0.86rem", color: "#e8a000", fontWeight: 600 },
  price: { fontSize: "0.92rem", color: "#2a5c45", fontWeight: 700 },
  cardBtn: { width: "100%", padding: 12, borderRadius: 10, border: "none", background: "#2a5c45", color: "#fff", cursor: "pointer", fontSize: "0.92rem", fontFamily: "Georgia, serif", fontWeight: 700 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 1000 },
  modal: { width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 24px 80px rgba(0,0,0,0.12)", position: "relative" },
  modalHeader: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 24 },
  modalTitle: { margin: 0, fontSize: "1.35rem", fontWeight: 700 },
  modalSubtitle: { margin: "8px 0 0", color: "#666" },
  closeButton: { border: "none", background: "transparent", fontSize: "1.25rem", cursor: "pointer", color: "#777" },
  modalBody: { display: "grid", gap: 18 },
  modalField: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: { fontSize: "0.85rem", color: "#555", fontWeight: 700 },
  fieldValue: { background: "#f7f6f3", padding: "14px 16px", borderRadius: 12, color: "#333", fontSize: "0.95rem" },
  select: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #dcd8d2", fontSize: "0.95rem", fontFamily: "Georgia, serif", outline: "none", background: "#fff" },
  textarea: { width: "100%", borderRadius: 12, border: "1px solid #dcd8d2", padding: "12px 14px", minHeight: 112, fontSize: "0.95rem", fontFamily: "Georgia, serif", outline: "none", resize: "vertical", color: "#333" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 },
  secondaryBtn: { border: "1px solid #ccc", background: "#fff", color: "#444", padding: "12px 22px", borderRadius: 10, cursor: "pointer", fontSize: "0.92rem", fontFamily: "Georgia, serif" },
  primaryBtn: { border: "none", background: "#2a5c45", color: "#fff", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: "0.92rem", fontFamily: "Georgia, serif", fontWeight: 700 },
};
