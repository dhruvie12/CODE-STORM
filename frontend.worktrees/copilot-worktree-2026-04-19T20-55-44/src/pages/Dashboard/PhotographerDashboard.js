import { useState, useEffect } from "react";
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
  camera:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  package:  "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  image:    "M21 15l-5-5L5 21M21 3H3v18h18V3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  check:    "M20 6L9 17l-5-5",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
};

const mockPortfolio = [
  
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

export default function PhotographerDashboard() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings]   = useState([]);
  const [services, setServices]   = useState([]);
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({ title: "", category: "", price: "", duration: "" });
  const [portfolioFilter, setPortfolioFilter] = useState("All");
  const [uploadedPortfolio, setUploadedPortfolio] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDetails, setUploadDetails] = useState({ title: "", category: "Weddings" });
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      try {
        setLoading(true);

        const [profileRes, servicesRes, bookingsRes] = await Promise.all([
          api.get("/photographers/me"),
          api.get("/services/me"),
          api.get("/bookings/photographer"),
        ]);

        setProfile(profileRes.data.profile);
        setServices(servicesRes.data.services.map((service) => ({
          ...service,
          category: service.category || `Category ${service.category_id || ""}`,
          bookings: service.bookings || 0,
          id: service.service_id || service.id,
          price: Number(service.price || 0),
        })));
        setBookings(bookingsRes.data.bookings.map((booking) => ({
          ...booking,
          id: booking.id,
        })));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "Georgia, serif", color: "#444" }}>
        Loading your photographer dashboard...
      </div>
    );
  }

  const addService = () => {
    if (!newService.title.trim() || !newService.category.trim() || !newService.price || !newService.duration) {
      alert("Please fill all fields");
      return;
    }
    setServices([...services, {
      id: services.length + 1,
      title: newService.title,
      category: newService.category,
      price: parseInt(newService.price),
      duration: parseInt(newService.duration),
      bookings: 0
    }]);
    setNewService({ title: "", category: "", price: "", duration: "" });
    setShowAddServiceModal(false);
  };

  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!uploadDetails.category) {
      alert("Please select a category");
      return;
    }
    if (files.length === 0) {
      alert("Please select images");
      return;
    }

    const albumTitle = uploadDetails.title.trim() || "Album " + new Date().getTime();
    const images = [];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        images.push(event.target.result);
        loadedCount++;

        if (loadedCount === files.length) {
          // All images loaded, create one album with all images
          const newAlbum = {
            id: Date.now(),
            title: albumTitle,
            category: uploadDetails.category,
            cover: images[0],
            images: images
          };

          setUploadedPortfolio([...uploadedPortfolio, newAlbum]);
          setUploadDetails({ title: "", category: "Weddings" });
          setShowUploadModal(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const filteredPortfolio = portfolioFilter === "All"
    ? mockPortfolio
    : mockPortfolio.filter(p => p.category === portfolioFilter);

  const updateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const totalEarnings  = bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.amount, 0);
  const pendingCount   = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const startingPrice = services.length > 0 ? Math.min(...services.map(s => Number(s.price) || 0)) : "";

  const navItems = [
    { key: "overview",  label: "Overview",  icon: icons.grid     },
    { key: "bookings",  label: "Bookings",  icon: icons.calendar },
    { key: "services",  label: "Services",  icon: icons.package  },
    { key: "portfolio", label: "Portfolio", icon: icons.image    },
    { key: "settings",  label: "Settings",  icon: icons.settings },
  ];

  return (
    <div style={s.root}>
      <style>{`
        @media (max-width: 768px) {
          [data-mobile-menu] { display: flex !important; }
          [data-sidebar] { position: fixed !important; left: -240px !important; transition: left 0.3s ease !important; z-index: 998 !important; }
          [data-sidebar].open { left: 0 !important; }
          [data-mobile-close] { display: block !important; }
          [data-main] { padding: 60px 20px 40px !important; }
          [data-page-header] { flex-direction: column !important; gap: 16px !important; }
          [data-page-title] { font-size: 1.4rem !important; }
          [data-add-btn] { width: 100% !important; }
          [data-stats-grid] { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          [data-table-head] { display: none !important; }
          [data-table-row] { grid-template-columns: 1fr !important; gap: 8px !important; padding: 16px !important; margin-bottom: 12px !important; background: #fff !important; border-radius: 10px !important; border: 1px solid #ece9e4 !important; }
          [data-portfolio-grid] { grid-template-columns: 1fr !important; }
          [data-services-grid] { grid-template-columns: 1fr !important; }
          [data-section-header] { flex-direction: column !important; gap: 12px !important; }
        }
        @media (max-width: 640px) {
          [data-stats-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ADD SERVICE MODAL */}
      {showAddServiceModal && (
        <div style={s.modalOverlay} onClick={() => setShowAddServiceModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Add New Service</h2>
              <button style={s.modalClose} onClick={() => setShowAddServiceModal(false)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Service Title</label>
                <input type="text" placeholder="e.g. Wedding Photography" value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  style={s.formInput} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Category</label>
                <select value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  style={s.formInput}>
                  <option value="">Select Category</option>
                  <option value="Weddings">Weddings</option>
                  <option value="Portraits">Portraits</option>
                  <option value="Events">Events</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Price ($)</label>
                <input type="number" placeholder="e.g. 250" value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  style={s.formInput} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Duration (hours)</label>
                <input type="number" placeholder="e.g. 4" value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                  style={s.formInput} />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={() => setShowAddServiceModal(false)}>Cancel</button>
              <button style={s.confirmBtn} onClick={addService}>Add Service</button>
            </div>
          </div>
        </div>
      )}

      {/* ALBUM VIEWER MODAL */}
      {selectedAlbum && (
        <div style={s.modalOverlay} onClick={() => setSelectedAlbum(null)}>
          <div style={s.galleryModalContent} onClick={(e) => e.stopPropagation()}>
            <button style={s.galleryModalClose} onClick={() => setSelectedAlbum(null)}>✕</button>

            <img src={selectedAlbum.images[currentImageIndex]} alt={selectedAlbum.title} style={s.galleryModalImg} />

            {selectedAlbum.images.length > 1 && (
              <>
                <button style={s.galleryPrevBtn} onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedAlbum.images.length - 1 : prev - 1)}>❮</button>
                <button style={s.galleryNextBtn} onClick={() => setCurrentImageIndex(prev => prev === selectedAlbum.images.length - 1 ? 0 : prev + 1)}>❯</button>
              </>
            )}

            <div style={s.galleryInfo}>
              <h3 style={s.galleryTitle}>{selectedAlbum.title}</h3>
              <span style={s.galleryCat}>{selectedAlbum.category}</span>
              {selectedAlbum.images.length > 1 && (
                <p style={s.galleryCounter}>{currentImageIndex + 1} / {selectedAlbum.images.length}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div style={s.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Upload Portfolio Photos</h2>
              <button style={s.modalClose} onClick={() => setShowUploadModal(false)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Album Title (Optional)</label>
                <input type="text" placeholder="e.g. Wedding — Mehta Family" value={uploadDetails.title}
                  onChange={(e) => setUploadDetails({...uploadDetails, title: e.target.value})}
                  style={s.formInput} />
                <p style={{fontSize: "0.75rem", color: "#999", margin: "4px 0 0"}}>If left empty, image filenames will be used</p>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Category *</label>
                <select value={uploadDetails.category}
                  onChange={(e) => setUploadDetails({...uploadDetails, category: e.target.value})}
                  style={s.formInput}>
                  <option value="">Select Category</option>
                  <option value="Weddings">Weddings</option>
                  <option value="Portraits">Portraits</option>
                  <option value="Events">Events</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Select Images *</label>
                <input type="file" multiple accept="image/*"
                  onChange={handlePortfolioUpload}
                  style={s.formInput} />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={() => setShowUploadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU BUTTON */}
      <button style={s.mobileMenuBtn} data-mobile-menu onClick={() => setSidebarOpen(!sidebarOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* SIDEBAR */}
      <aside style={{...s.sidebar, ...(sidebarOpen ? s.sidebarOpen : {})}} data-sidebar className={sidebarOpen ? 'open' : ''}>
        <button style={s.mobileCloseBtn} data-mobile-close onClick={() => setSidebarOpen(false)}>✕</button>
        <div style={s.sideTop}>
          <div style={s.sideLogo} onClick={() => navigate("/")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span style={s.sideLogoText}>LensLink</span>
          </div>
          <div style={s.sideProfile}>
            <div style={s.sideAvatar}>{user?.name?.charAt(0).toUpperCase() || "P"}</div>
            <div>
              <p style={s.sideName}>{user?.name || "Photographer"}</p>
              <p style={s.sideRole}>📷 Photographer</p>
            </div>
          </div>
          <nav style={s.sideNav}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
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
      <main style={s.main} data-main>
        <div style={s.pageHeader} data-page-header>
          <div>
            <h1 style={s.pageTitle} data-page-title>
              {activeTab === "overview"  && "Dashboard Overview"}
              {activeTab === "bookings"  && "Booking Requests"}
              {activeTab === "services"  && "My Services"}
              {activeTab === "portfolio" && "My Portfolio"}
              {activeTab === "settings"  && "Account Settings"}
            </h1>
            <p style={s.pageSubtitle}>
              {activeTab === "overview"  && `Welcome back, ${user?.name?.split(" ")[0] || "there"}!`}
              {activeTab === "bookings"  && `You have ${pendingCount} pending request${pendingCount !== 1 ? "s" : ""}`}
              {activeTab === "services"  && "Manage your photography packages"}
              {activeTab === "portfolio" && "Showcase your best work"}
              {activeTab === "settings"  && "Update your profile and preferences"}
            </p>
          </div>
          {activeTab === "services"  && <button style={s.addBtn} data-add-btn onClick={() => setShowAddServiceModal(true)}>+ Add Service</button>}
          {activeTab === "portfolio" && <button style={s.addBtn} data-add-btn>+ Upload Photos</button>}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={s.statsGrid} data-stats-grid>
              {[
                { label: "Total Earnings",     value: `$${totalEarnings.toLocaleString()}`, icon: icons.star,     color: "#2a5c45" },
                { label: "Pending Requests",   value: pendingCount,                          icon: icons.clock,    color: "#b07d00" },
                { label: "Confirmed Bookings", value: confirmedCount,                        icon: icons.check,    color: "#1a6fa8" },
                { label: "Completed Sessions", value: completedCount,                        icon: icons.camera,   color: "#555"    },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statIcon, color: stat.color }}><Icon d={stat.icon} size={22} /></div>
                  <p style={s.statValue}>{stat.value}</p>
                  <p style={s.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={s.section}>
              <div style={s.sectionHeader} data-section-header>
                <h2 style={s.sectionTitle}>Recent Bookings</h2>
                <button style={s.viewAllBtn} onClick={() => setActiveTab("bookings")}>View All →</button>
              </div>
              <div style={s.table}>
                <div style={s.tableHead} data-table-head>
                  {["Client", "Service", "Date", "Amount", "Status", "Action"].map(h => (
                    <span key={h} style={s.th}>{h}</span>
                  ))}
                </div>
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} style={s.tableRow} data-table-row>
                    <span style={s.td}>{b.client}</span>
                    <span style={s.td}>{b.service}</span>
                    <span style={s.td}>{b.date}</span>
                    <span style={{ ...s.td, color: "#2a5c45", fontWeight: 600 }}>${b.amount.toLocaleString()}</span>
                    <span style={s.td}><StatusBadge status={b.status} /></span>
                    <span style={s.td}>
                      {b.status === "pending" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={s.acceptBtn} onClick={() => updateStatus(b.id, "confirmed")}>Accept</button>
                          <button style={s.rejectBtn} onClick={() => updateStatus(b.id, "cancelled")}>Decline</button>
                        </div>
                      )}
                      {b.status !== "pending" && <span style={{ color: "#bbb", fontSize: "0.82rem" }}>—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.section}>
              <div style={s.sectionHeader} data-section-header>
                <h2 style={s.sectionTitle}>Portfolio Preview</h2>
                <button style={s.viewAllBtn} onClick={() => setActiveTab("portfolio")}>Manage →</button>
              </div>
              <div style={s.portfolioGrid} data-portfolio-grid>
                {mockPortfolio.map(p => (
                  <div key={p.id} style={s.portfolioCard}>
                    <img src={p.cover} alt={p.title} style={s.portfolioImg} />
                    <div style={s.portfolioInfo}>
                      <p style={s.portfolioTitle}>{p.title}</p>
                      <span style={s.portfolioCat}>{p.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div style={s.section}>
            <div style={s.table}>
              <div style={s.tableHead} data-table-head>
                {["Client", "Service", "Date", "Amount", "Status", "Action"].map(h => (
                  <span key={h} style={s.th}>{h}</span>
                ))}
              </div>
              {bookings.map(b => (
                <div key={b.id} style={s.tableRow} data-table-row>
                  <span style={s.td}>{b.client}</span>
                  <span style={s.td}>{b.service}</span>
                  <span style={s.td}>{b.date}</span>
                  <span style={{ ...s.td, color: "#2a5c45", fontWeight: 600 }}>${b.amount.toLocaleString()}</span>
                  <span style={s.td}><StatusBadge status={b.status} /></span>
                  <span style={s.td}>
                    {b.status === "pending" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={s.acceptBtn} onClick={() => updateStatus(b.id, "confirmed")}>Accept</button>
                        <button style={s.rejectBtn} onClick={() => updateStatus(b.id, "cancelled")}>Decline</button>
                      </div>
                    )}
                    {b.status === "confirmed" && (
                      <button style={s.acceptBtn} onClick={() => updateStatus(b.id, "completed")}>Mark Done</button>
                    )}
                    {(b.status === "completed" || b.status === "cancelled") && (
                      <span style={{ color: "#bbb", fontSize: "0.82rem" }}>—</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div style={s.servicesGrid} data-services-grid>
            {services.map(sv => (
              <div key={sv.id} style={s.serviceCard}>
                <div style={s.serviceCardTop}>
                  <span style={s.serviceCat}>{sv.category}</span>
                  <button style={s.editBtn}>Edit</button>
                </div>
                <h3 style={s.serviceTitle}>{sv.title}</h3>
                <div style={s.serviceMeta}>
                  <span style={s.serviceMetaItem}>⏱ {sv.duration} hrs</span>
                  <span style={s.serviceMetaItem}>📋 {sv.bookings} bookings</span>
                </div>
                <p style={s.servicePrice}>${sv.price.toLocaleString()}</p>
              </div>
            ))}
            <div style={s.addServiceCard} onClick={() => setShowAddServiceModal(true)}>
              <span style={s.addServicePlus}>+</span>
              <p style={s.addServiceText}>Add New Service</p>
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {activeTab === "portfolio" && (
          <div>
            <div style={s.portfolioFilterSection}>
              <p style={s.portfolioFilterLabel}>Filter by category</p>
              <div style={s.portfolioFilterRow}>
                {["All", "Weddings", "Portraits", "Events"].map(cat => (
                  <button key={cat} onClick={() => setPortfolioFilter(cat)}
                    style={{ ...s.portfolioFilterBtn, ...(portfolioFilter === cat ? s.portfolioFilterActive : {}) }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Upload Section */}
            <div style={s.mainUploadSection}>
              <h3 style={s.mainUploadTitle}>Add to Your Portfolio</h3>
              <button style={s.mainUploadBtn} onClick={() => setShowUploadModal(true)}>
                <span style={s.uploadIcon}>📷</span>
                <p style={s.uploadText}>Upload Photos</p>
              </button>
            </div>

            {/* Portfolio Grid */}
            <div style={s.portfolioGridContainer}>
              <div style={s.portfolioCount}>
                {filteredPortfolio.length + (portfolioFilter === "All" ? uploadedPortfolio.length : uploadedPortfolio.filter(p => p.category === portfolioFilter).length)} items
              </div>
              <div style={s.portfolioGrid} data-portfolio-grid>
                {filteredPortfolio.filter(p => portfolioFilter === "All" || p.category === portfolioFilter).map(p => (
                  <div key={p.id} style={s.portfolioCard}>
                    <img src={p.cover} alt={p.title} style={s.portfolioImg} />
                    <div style={s.portfolioInfo}>
                      <p style={s.portfolioTitle}>{p.title}</p>
                      <span style={s.portfolioCat}>{p.category}</span>
                    </div>
                  </div>
                ))}
                {(portfolioFilter === "All" ? uploadedPortfolio : uploadedPortfolio.filter(p => p.category === portfolioFilter)).map(album => (
                  <div key={album.id} style={s.portfolioCard} onClick={() => { setSelectedAlbum(album); setCurrentImageIndex(0); }}>
                    <div style={s.portfolioImgWrapper}>
                      <img src={album.cover} alt={album.title} style={s.portfolioImg} />
                      {album.images.length > 1 && (
                        <div style={s.imageCountBadge}>{album.images.length} images</div>
                      )}
                    </div>
                    <div style={s.portfolioInfo}>
                      <p style={s.portfolioTitle}>{album.title}</p>
                      <span style={s.portfolioCat}>{album.category}</span>
                      <button style={s.deleteUploadBtn} onClick={(e) => { e.stopPropagation(); setUploadedPortfolio(uploadedPortfolio.filter(a => a.id !== album.id)); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS — updated to match actual DB columns */}
        {activeTab === "settings" && (
          <div style={s.settingsWrap}>
            {/* User info — from users table */}
            <div style={s.settingsCard}>
              <h3 style={s.settingsSection}>Account Information</h3>
              <p style={s.settingsNote}>Fields from your account (users table)</p>
              {[
                { label: "Full Name", value: user?.name  || "", type: "text",  field: "full_name" },
                { label: "Email",     value: user?.email || "", type: "email", field: "email"     },
                { label: "Phone",     value: user?.phone || "", type: "tel",   field: "phone"     },
              ].map(f => (
                <div key={f.label} style={s.settingsField}>
                  <label style={s.settingsLabel}>{f.label}</label>
                  <input type={f.type} defaultValue={f.value}
                    placeholder={`Enter your ${f.label.toLowerCase()}`}
                    style={s.settingsInput} />
                </div>
              ))}
              <button style={s.saveBtn}>Save Account Info</button>
            </div>

            {/* Photographer profile — from photographers table */}
            <div style={{ ...s.settingsCard, marginTop: 20 }}>
              <h3 style={s.settingsSection}>Photographer Profile</h3>
              <p style={s.settingsNote}>Fields from your photographer profile (photographers table)</p>
              {[
                { label: "Specialization",    value: profile?.specialization || "", type: "text",     placeholder: "e.g. Weddings, Portraits"  },
                { label: "Starting Price ($)", value: startingPrice || "", type: "number",  placeholder: "e.g. 250"               },
                { label: "Bio",               value: profile?.bio || "", type: "textarea", placeholder: "Tell clients about yourself..." },
              ].map(f => (
                <div key={f.label} style={s.settingsField}>
                  <label style={s.settingsLabel}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea defaultValue={f.value} placeholder={f.placeholder}
                      style={{ ...s.settingsInput, height: 100, resize: "vertical" }} />
                  ) : (
                    <input type={f.type} defaultValue={f.value}
                      placeholder={f.placeholder} style={s.settingsInput} />
                  )}
                </div>
              ))}
              <button style={s.saveBtn}>Save Photographer Profile</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  root: { display: "flex", minHeight: "100vh", background: "#f6f5f2", fontFamily: "Georgia, 'Times New Roman', serif", position: "relative" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 12, boxShadow: "0 12px 48px rgba(0,0,0,0.15)", maxWidth: 500, width: "90%", maxHeight: "90vh", overflow: "auto" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid #ece9e4" },
  modalTitle: { fontSize: "1.2rem", fontWeight: 600, color: "#1a1a1a", margin: 0 },
  modalClose: { background: "transparent", border: "none", color: "#888", fontSize: "1.5rem", cursor: "pointer", padding: 0 },
  modalBody: { padding: "28px" },
  formGroup: { marginBottom: 20 },
  formLabel: { display: "block", fontSize: "0.85rem", color: "#444", fontWeight: 600, marginBottom: 8 },
  formInput: { width: "100%", border: "1.5px solid #e0dbd3", borderRadius: 8, padding: "10px 12px", fontSize: "0.9rem", color: "#1a1a1a", fontFamily: "Georgia, serif", outline: "none", background: "#faf9f7", boxSizing: "border-box" },
  modalFooter: { display: "flex", gap: 12, padding: "20px 28px", borderTop: "1px solid #ece9e4" },
  cancelBtn: { flex: 1, background: "transparent", border: "1.5px solid #ddd", color: "#444", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, fontFamily: "Georgia, serif" },
  confirmBtn: { flex: 1, background: "#2a5c45", border: "none", color: "#fff", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.88rem", fontWeight: 700, fontFamily: "Georgia, serif" },

  mobileMenuBtn: {
    display: "none", position: "fixed", top: 20, left: 20, zIndex: 999, background: "#2a5c45",
    border: "none", color: "#fff", padding: "8px 12px", borderRadius: 6, cursor: "pointer",
  },

  mobileCloseBtn: {
    display: "none", position: "absolute", top: 16, right: 16, background: "transparent",
    border: "none", color: "#666", fontSize: "1.5rem", cursor: "pointer",
  },

  sidebar: {
    width: 240, background: "#fff", borderRight: "1px solid #ece9e4", display: "flex",
    flexDirection: "column", justifyContent: "space-between", padding: "28px 0",
    position: "sticky", top: 0, height: "100vh", overflowY: "auto",
  },

  sidebarOpen: {
    left: 0
  },

  sideTop: { display: "flex", flexDirection: "column", gap: 0 },
  sideLogo: { display: "flex", alignItems: "center", gap: 8, padding: "0 24px 24px", cursor: "pointer", borderBottom: "1px solid #ece9e4", marginBottom: 24 },
  sideLogoText: { fontSize: "1.2rem", fontWeight: 700, color: "#2a5c45" },
  sideProfile: { display: "flex", alignItems: "center", gap: 12, padding: "0 24px 24px", borderBottom: "1px solid #ece9e4", marginBottom: 16 },
  sideAvatar: { width: 42, height: 42, borderRadius: "50%", background: "#2a5c45", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700 },
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
  tableHead: { display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.9fr 1.2fr", padding: "12px 20px", background: "#f6f5f2", borderBottom: "1px solid #ece9e4" },
  tableRow: { display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.9fr 1.2fr", padding: "14px 20px", borderBottom: "1px solid #f0ede8", alignItems: "center" },
  th: { fontSize: "0.74rem", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 },
  td: { fontSize: "0.88rem", color: "#333" },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 600 },
  acceptBtn: { padding: "5px 12px", background: "#eef7f2", border: "1px solid #2a5c45", color: "#2a5c45", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, fontFamily: "Georgia, serif" },
  rejectBtn: { padding: "5px 12px", background: "#fff0f0", border: "1px solid #e05555", color: "#e05555", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, fontFamily: "Georgia, serif" },

  portfolioGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 },
  portfolioCard: { borderRadius: 12, overflow: "hidden", border: "1px solid #ece9e4", background: "#fff" },
  portfolioImg: { width: "100%", height: 180, objectFit: "cover", display: "block" },
  portfolioInfo: { padding: "14px 16px" },
  portfolioTitle: { margin: "0 0 6px", fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a" },
  portfolioCat: { fontSize: "0.74rem", color: "#2a5c45", background: "#eef7f2", padding: "3px 10px", borderRadius: 20, fontWeight: 600 },
  uploadCard: { borderRadius: 12, border: "2px dashed #d0cbc3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", minHeight: 200, background: "#faf9f7" },
  uploadIcon: { fontSize: "2rem" },
  uploadText: { fontSize: "0.88rem", color: "#aaa", margin: 0 },

  portfolioFilterSection: { marginBottom: 32, padding: "20px", background: "#fff", borderRadius: 12, border: "1px solid #ece9e4" },
  portfolioFilterLabel: { fontSize: "0.74rem", color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, margin: 0 },
  portfolioFilterRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  portfolioFilterBtn: { padding: "8px 18px", borderRadius: 30, background: "#f4f1ec", border: "1.5px solid transparent", color: "#555", cursor: "pointer", fontSize: "0.87rem", fontFamily: "Georgia, serif", transition: "all 0.2s ease", outline: "none" },
  portfolioFilterActive: { background: "#2a5c45", border: "1.5px solid #2a5c45", color: "#fff", fontWeight: 700 },
  portfolioGridContainer: { marginBottom: 24 },
  portfolioCount: { fontSize: "0.85rem", color: "#aaa", marginBottom: 16 },

  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 },
  serviceCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "22px" },
  serviceCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  serviceCat: { fontSize: "0.74rem", color: "#2a5c45", background: "#eef7f2", padding: "3px 10px", borderRadius: 20, fontWeight: 600 },
  editBtn: { background: "transparent", border: "1px solid #ddd", color: "#888", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontFamily: "Georgia, serif" },
  serviceTitle: { fontSize: "1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 10px" },
  serviceMeta: { display: "flex", gap: 14, marginBottom: 12 },
  serviceMetaItem: { fontSize: "0.8rem", color: "#888" },
  servicePrice: { fontSize: "1.3rem", fontWeight: 700, color: "#2a5c45", margin: 0 },
  addServiceCard: { borderRadius: 12, border: "2px dashed #d0cbc3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", minHeight: 160, background: "#faf9f7" },
  addServicePlus: { fontSize: "2rem", color: "#ccc" },
  addServiceText: { fontSize: "0.88rem", color: "#aaa", margin: 0 },

  settingsWrap: { maxWidth: 600 },
  settingsCard: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "32px" },
  settingsSection: { fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" },
  settingsNote: { fontSize: "0.78rem", color: "#bbb", margin: "0 0 20px" },
  settingsField: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 },
  settingsLabel: { fontSize: "0.83rem", color: "#444", fontWeight: 600 },
  settingsInput: { border: "1.5px solid #e0dbd3", borderRadius: 8, padding: "10px 14px", fontSize: "0.91rem", color: "#1a1a1a", fontFamily: "Georgia, serif", outline: "none", background: "#faf9f7", width: "100%", boxSizing: "border-box" },
  saveBtn: { background: "#2a5c45", border: "none", color: "#fff", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: "0.92rem", fontWeight: 700, fontFamily: "Georgia, serif", marginTop: 8 },

  mainUploadSection: { background: "#fff", borderRadius: 12, border: "1px solid #ece9e4", padding: "40px 32px", marginBottom: 40, textAlign: "center" },
  mainUploadTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 24px" },
  mainUploadBtn: { background: "transparent", border: "2px dashed #d0cbc3", borderRadius: 12, padding: "32px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minHeight: 150, justifyContent: "center", width: "100%", fontFamily: "Georgia, serif", transition: "all 0.2s ease" },
  deleteUploadBtn: { marginTop: 8, width: "100%", padding: "6px 8px", background: "#fef0f0", border: "1px solid #e05555", color: "#e05555", borderRadius: 6, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, fontFamily: "Georgia, serif" },

  portfolioImgWrapper: { position: "relative", height: 180, overflow: "hidden" },
  imageCountBadge: { position: "absolute", bottom: 8, right: 8, background: "rgba(42,92,69,0.9)", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600 },

  galleryModalContent: { position: "relative", maxWidth: 900, width: "90%", background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  galleryModalClose: { position: "absolute", top: 16, right: 16, background: "#fff", border: "none", color: "#1a1a1a", fontSize: "1.8rem", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", zIndex: 10 },
  galleryModalImg: { width: "100%", height: "auto", maxHeight: 600, objectFit: "cover", display: "block" },
  galleryPrevBtn: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", width: 40, height: 40, borderRadius: "50%", fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  galleryNextBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", width: 40, height: 40, borderRadius: "50%", fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  galleryInfo: { padding: "24px 28px", background: "#fff" },
  galleryTitle: { fontSize: "1.3rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" },
  galleryCat: { fontSize: "0.8rem", color: "#2a5c45", background: "#eef7f2", padding: "4px 12px", borderRadius: 20, fontWeight: 600 },
  galleryCounter: { fontSize: "0.9rem", color: "#888", fontWeight: 600, marginTop: 12, marginBottom: 0 },
};