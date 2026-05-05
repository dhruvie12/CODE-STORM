const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/photographers", require("./routes/photographerRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/photos", require("./routes/photoRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/portfolio-albums", require("./routes/portfolioAlbumRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });