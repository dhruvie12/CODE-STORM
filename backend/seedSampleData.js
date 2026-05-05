/**
 * seedSampleData.js
 * Creates realistic sample photographers, clients, services,
 * availability slots, portfolio images, and bookings.
 * Safe to re-run — skips anything already present.
 */

const {
  sequelize, User, Role, UserRole, Category,
  Photographer, Service, Availability, Booking, Photo,
} = require("./models");
const bcrypt = require("bcryptjs");

// ── helpers ────────────────────────────────────────────────
const hash = (pw) => bcrypt.hash(pw, 10);

// future dates for availability
function futureDates(count, startDaysAhead = 7) {
  const dates = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + startDaysAhead + i * 3);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

async function main() {
  await sequelize.sync();
  console.log("✅ DB synced");

  // ── look up roles & categories ─────────────────────────
  const [adminRole, photographerRole, clientRole] = await Promise.all([
    Role.findOne({ where: { role_name: "admin" } }),
    Role.findOne({ where: { role_name: "photographer" } }),
    Role.findOne({ where: { role_name: "client" } }),
  ]);

  const categories = await Category.findAll();
  const catMap = Object.fromEntries(categories.map(c => [c.category_name, c]));

  if (!photographerRole || !clientRole) {
    console.error("❌ Roles not found — run node seed.js first");
    process.exit(1);
  }

  // ── photographer definitions ────────────────────────────
  const photographerDefs = [
    {
      email: "arjun@lenslink.com", password: "Arjun@123",
      full_name: "Arjun Mehta", phone: "9800001001",
      bio: "Award-winning wedding and portrait photographer based in Mumbai. 8+ years capturing life's most precious moments with a cinematic, story-driven approach.",
      location: "Mumbai", specialization: "Weddings",
      experience_years: 8, rating_avg: 4.9, total_reviews: 42,
      profile_image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
      services: [
        { name: "Full-Day Wedding Coverage", description: "12-hour coverage with two shooters, 600+ edited images, online gallery.", price: 45000, category: "Weddings" },
        { name: "Engagement Session",         description: "2-hour pre-wedding shoot, 80 edited images, same-day previews.",        price: 12000, category: "Portraits" },
        { name: "Bridal Portraits",           description: "Studio or outdoor bridal portrait session, 50 edited images.",           price: 8000,  category: "Portraits" },
      ],
      photos: [
        { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", title: "Beach Wedding", category: "Weddings", is_featured: true },
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", title: "Garden Wedding", category: "Weddings", is_featured: true },
        { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80", title: "Candid Ceremony", category: "Weddings" },
        { url: "https://images.unsplash.com/photo-1520861112841-c2e353b8c55a?w=800&q=80", title: "Bridal Portrait", category: "Portraits" },
      ],
    },
    {
      email: "priya@lenslink.com", password: "Priya@123",
      full_name: "Priya Sharma", phone: "9800001002",
      bio: "Delhi-based portrait and fashion photographer. I believe every face tells a story — my job is to find and freeze that story in a frame.",
      location: "Delhi", specialization: "Portraits",
      experience_years: 5, rating_avg: 4.7, total_reviews: 28,
      profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      services: [
        { name: "Personal Portrait Session", description: "1-hour studio session with lighting setup, 40 edited images.",             price: 5500,  category: "Portraits" },
        { name: "Family Portrait Package",   description: "2-hour outdoor session, up to 6 members, 80 edited images.",               price: 9000,  category: "Portraits" },
        { name: "Fashion Shoot",             description: "Half-day fashion & lifestyle shoot for models or brands, 100+ images.",     price: 18000, category: "Commercial" },
      ],
      photos: [
        { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", title: "Studio Portrait",  category: "Portraits", is_featured: true },
        { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80", title: "Fashion Editorial", category: "Commercial", is_featured: true },
        { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", title: "Natural Light",     category: "Portraits" },
      ],
    },
    {
      email: "rohan@lenslink.com", password: "Rohan@123",
      full_name: "Rohan Das", phone: "9800001003",
      bio: "Bangalore's top event photographer. Corporate events, concerts, product launches — I cover it all with precision and energy.",
      location: "Bangalore", specialization: "Events",
      experience_years: 6, rating_avg: 4.8, total_reviews: 35,
      profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      services: [
        { name: "Corporate Event Coverage", description: "Full-day corporate event, unlimited shots, 300+ edited images, quick 48h delivery.", price: 22000, category: "Events" },
        { name: "Conference & Seminar",     description: "Half-day conference photography, 150 edited images.",                                 price: 12000, category: "Events" },
        { name: "Product Launch",           description: "Product launch event with product detail shots, 200 images + 10 hero edits.",          price: 28000, category: "Commercial" },
      ],
      photos: [
        { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", title: "Conference Stage",   category: "Events", is_featured: true },
        { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80", title: "Concert Crowd",      category: "Events", is_featured: true },
        { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80", title: "Corporate Headshots", category: "Commercial" },
      ],
    },
    {
      email: "karan@lenslink.com", password: "Karan@123",
      full_name: "Karan Joshi", phone: "9800001004",
      bio: "Commercial and advertising photographer from Hyderabad. Worked with 50+ brands. Specialise in product, architecture, and food photography.",
      location: "Hyderabad", specialization: "Commercial",
      experience_years: 10, rating_avg: 5.0, total_reviews: 61,
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      services: [
        { name: "Product Photography",     description: "E-commerce or catalogue shoot, white background + lifestyle, 50 products.",  price: 15000, category: "Commercial" },
        { name: "Architectural Photography", description: "Interior & exterior shoot, HDR edits, 100 images.",                        price: 30000, category: "Commercial" },
        { name: "Food & Beverage Shoot",   description: "Styled food photography for restaurants or brands, 60 final images.",        price: 20000, category: "Commercial" },
      ],
      photos: [
        { url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80", title: "Office Interior",  category: "Commercial", is_featured: true },
        { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", title: "Food Styling",     category: "Commercial", is_featured: true },
        { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", title: "Retail Brand",     category: "Commercial" },
      ],
    },
    {
      email: "meera@lenslink.com", password: "Meera@123",
      full_name: "Meera Iyer", phone: "9800001005",
      bio: "Chennai's favourite wedding storyteller. Specialising in candid moments, rich colours, and South Indian wedding traditions.",
      location: "Chennai", specialization: "Weddings",
      experience_years: 7, rating_avg: 4.9, total_reviews: 53,
      profile_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      services: [
        { name: "Traditional Wedding Package",    description: "Full 2-day wedding coverage, 800+ images, premium album, drone shots.",               price: 55000, category: "Weddings" },
        { name: "Reception Only",                 description: "4-hour reception coverage, 200 edited images.",                                       price: 18000, category: "Weddings" },
        { name: "Mehendi & Haldi Ceremonies",     description: "Pre-wedding ceremony coverage — 1 day, 150 images.",                                  price: 12000, category: "Weddings" },
      ],
      photos: [
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", title: "South Indian Ceremony", category: "Weddings", is_featured: true },
        { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", title: "Mehendi Portraits",     category: "Weddings", is_featured: true },
        { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80", title: "Reception Dance",       category: "Weddings" },
      ],
    },
  ];

  // ── client definitions ──────────────────────────────────
  const clientDefs = [
    { email: "sneha@client.com", password: "Client@123", full_name: "Sneha Rao",    phone: "9900002001" },
    { email: "raj@client.com",   password: "Client@123", full_name: "Raj Kumar",    phone: "9900002002" },
    { email: "anita@client.com", password: "Client@123", full_name: "Anita Mehta",  phone: "9900002003" },
  ];

  // ── create / fetch photographers ───────────────────────
  const createdPhotographers = [];
  for (const def of photographerDefs) {
    let user = await User.findOne({ where: { email: def.email } });
    if (!user) {
      user = await User.create({
        full_name: def.full_name,
        email: def.email,
        password_hash: await hash(def.password),
        phone: def.phone,
        active_role_id: photographerRole.role_id,
        is_active: true,
      });
      await UserRole.create({ user_id: user.user_id, role_id: photographerRole.role_id });
      console.log(`  👤 Created photographer user: ${def.full_name}`);
    }

    let profile = await Photographer.findOne({ where: { user_id: user.user_id } });
    if (!profile) {
      profile = await Photographer.create({
        user_id: user.user_id,
        bio: def.bio,
        location: def.location,
        specialization: def.specialization,
        experience_years: def.experience_years,
        rating_avg: def.rating_avg,
        total_reviews: def.total_reviews,
        profile_image: def.profile_image,
        starting_price: Math.min(...def.services.map(s => s.price)),
      });
      console.log(`  📷 Created photographer profile: ${def.full_name}`);
    }

    // services
    const createdServices = [];
    for (const svcDef of def.services) {
      const cat = catMap[svcDef.category];
      let svc = await Service.findOne({
        where: { photographer_id: profile.photographer_id, name: svcDef.name }
      });
      if (!svc) {
        svc = await Service.create({
          photographer_id: profile.photographer_id,
          category_id: cat?.category_id || null,
          name: svcDef.name,
          description: svcDef.description,
          price: svcDef.price,
        });
        console.log(`    🛎  Service: ${svcDef.name}`);
      }
      createdServices.push(svc);
    }

    // availability (6 upcoming slots)
    const existing = await Availability.count({ where: { photographer_id: profile.photographer_id } });
    if (existing === 0) {
      const dates = futureDates(6);
      for (const date of dates) {
        await Availability.create({
          photographer_id: profile.photographer_id,
          available_date: date,
          start_time: "09:00:00",
          end_time: "18:00:00",
          is_booked: false,
        });
      }
      console.log(`    📅 Added 6 availability slots for ${def.full_name}`);
    }

    // portfolio photos
    const existingPhotos = await Photo.count({ where: { photographer_id: profile.photographer_id } });
    if (existingPhotos === 0) {
      for (let i = 0; i < def.photos.length; i++) {
        const ph = def.photos[i];
        const cat = catMap[ph.category];
        await Photo.create({
          photographer_id: profile.photographer_id,
          category_id: cat?.category_id || null,
          title: ph.title,
          image_url: ph.url,
          is_featured: ph.is_featured || false,
          sort_order: i + 1,
        });
      }
      console.log(`    🖼  Added ${def.photos.length} portfolio images for ${def.full_name}`);
    }

    createdPhotographers.push({ user, profile, services: createdServices });
  }

  // ── create / fetch clients ──────────────────────────────
  const createdClients = [];
  for (const def of clientDefs) {
    let user = await User.findOne({ where: { email: def.email } });
    if (!user) {
      user = await User.create({
        full_name: def.full_name,
        email: def.email,
        password_hash: await hash(def.password),
        phone: def.phone,
        active_role_id: clientRole.role_id,
        is_active: true,
      });
      await UserRole.create({ user_id: user.user_id, role_id: clientRole.role_id });
      console.log(`  👤 Created client: ${def.full_name}`);
    }
    createdClients.push(user);
  }

  // ── create sample bookings ──────────────────────────────
  const existingBookings = await Booking.count();
  if (existingBookings === 0 && createdPhotographers.length > 0 && createdClients.length > 0) {
    const bookingDefs = [
      { clientIdx: 0, pgIdx: 0, svcIdx: 0, status: "approved",   daysAhead: 30  },
      { clientIdx: 1, pgIdx: 2, svcIdx: 0, status: "pending",    daysAhead: 45  },
      { clientIdx: 2, pgIdx: 1, svcIdx: 0, status: "completed",  daysAhead: -10 },
      { clientIdx: 0, pgIdx: 3, svcIdx: 0, status: "pending",    daysAhead: 60  },
      { clientIdx: 1, pgIdx: 4, svcIdx: 0, status: "rejected",   daysAhead: 20  },
    ];

    for (const bd of bookingDefs) {
      const client = createdClients[bd.clientIdx];
      const pg     = createdPhotographers[bd.pgIdx];
      const svc    = pg.services[bd.svcIdx];
      if (!svc) continue;

      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + bd.daysAhead);
      const eventDateStr = eventDate.toISOString().slice(0, 10);

      // get or create an availability slot for this date
      let avail = await Availability.findOne({
        where: { photographer_id: pg.profile.photographer_id, is_booked: false }
      });

      const isBooked = ["approved", "completed"].includes(bd.status);
      if (!avail) {
        avail = await Availability.create({
          photographer_id: pg.profile.photographer_id,
          available_date: eventDateStr,
          start_time: "09:00:00",
          end_time: "18:00:00",
          is_booked: isBooked,
        });
      } else if (isBooked) {
        await avail.update({ is_booked: true });
      }

      await Booking.create({
        user_id: client.user_id,
        service_id: svc.service_id,
        availability_id: avail.availability_id,
        event_date: eventDateStr,
        total_price: svc.price,
        status: bd.status,
      });
    }
    console.log(`  📋 Created ${bookingDefs.length} sample bookings`);
  }

  // ── summary ─────────────────────────────────────────────
  console.log("\n🎉 Sample data seeded!\n");
  console.log("── Photographer accounts ──────────────────");
  for (const def of photographerDefs) {
    console.log(`  ${def.full_name.padEnd(18)} ${def.email}  /  ${def.password}`);
  }
  console.log("\n── Client accounts ────────────────────────");
  for (const def of clientDefs) {
    console.log(`  ${def.full_name.padEnd(18)} ${def.email}  /  ${def.password}`);
  }
  console.log("\n── Admin account ──────────────────────────");
  console.log("  admin@gmail.com  /  Admin123\n");
}

main()
  .then(() => { sequelize.close(); process.exit(0); })
  .catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
