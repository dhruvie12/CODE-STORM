const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Photographer = require("../models/Photographer");
const Availability = require("../models/Availability");
const User = require("../models/User");

const statusMap = {
  pending: "pending",
  approved: "confirmed",
  rejected: "cancelled",
  completed: "completed"
};

exports.getPhotographerBookings = async (req, res) => {
  try {
    if (req.user.role !== "photographer") {
      return res.status(403).json({ message: "Only photographers can view bookings." });
    }

    const photographer = await Photographer.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!photographer) {
      return res.status(400).json({ message: "Create photographer profile first." });
    }

    const services = await Service.findAll({
      where: { photographer_id: photographer.photographer_id }
    });

    const serviceIds = services.map((service) => service.service_id);
    if (serviceIds.length === 0) {
      return res.json({ bookings: [] });
    }

    const bookings = await Booking.findAll({
      where: { service_id: serviceIds }
    });

    const userIds = [...new Set(bookings.map((booking) => booking.user_id))];
    const users = await User.findAll({
      where: { user_id: userIds }
    });

    const userMap = users.reduce((acc, user) => {
      acc[user.user_id] = user;
      return acc;
    }, {});

    const serviceMap = services.reduce((acc, service) => {
      acc[service.service_id] = service;
      return acc;
    }, {});

    const result = bookings.map((booking) => ({
      id: booking.booking_id,
      client: userMap[booking.user_id]?.full_name || userMap[booking.user_id]?.email || "Client",
      service: serviceMap[booking.service_id]?.name || "Service",
      date: booking.booking_date ? booking.booking_date.toISOString().slice(0, 10) : "",
      status: statusMap[booking.status] || "pending",
      amount: parseFloat(serviceMap[booking.service_id]?.price || 0),
    }));

    res.json({ bookings: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { service_id, event_date, notes } = req.body;

    if (!service_id) {
      return res.status(400).json({
        message: "Service must be selected.",
      });
    }

    if (!event_date) {
      return res.status(400).json({
        message: "Event date must be selected.",
      });
    }

    const service = await Service.findByPk(service_id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    const booking = await Booking.create({
      user_id: userId,
      service_id: service.service_id,
      photographer_id: service.photographer_id,
      event_date,
      notes: notes || "",
      total_price: service.price,
      status: "pending",
    });

    return res.status(201).json({
      message: "Booking request submitted successfully.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      message: "Failed to create booking.",
      error: error.message,
    });
  }
};

exports.getClientBookings = async (req, res) => {
  try {
    const clientId = req.user.user_id;
    const bookings = await Booking.findAll({
      where: { user_id: clientId },
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["service_id", "name", "price"],
          include: [
            {
              model: Photographer,
              as: "photographer",
              attributes: ["photographer_id"],
              include: [{ model: User, as: "user", attributes: ["full_name"] }]
            }
          ]
        }
      ],
      order: [["booking_date", "DESC"]]
    });

    const response = bookings.map((b) => ({
      id: b.booking_id,
      photographer: b.service?.photographer?.user?.full_name || "Photographer",
      service: b.service?.name || "Service",
      event_date: b.event_date
        ? new Date(b.event_date).toISOString().slice(0, 10)
        : (b.booking_date ? new Date(b.booking_date).toISOString().slice(0, 10) : "—"),
      status: statusMap[b.status] || "pending",
      total_price: parseFloat(b.total_price || b.service?.price || 0),
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load your bookings." });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can cancel bookings." });
    }
    const { id } = req.params;
    const booking = await Booking.findOne({ where: { booking_id: id, user_id: req.user.user_id } });
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled." });
    }
    await booking.update({ status: "rejected" });
    res.json({ message: "Booking cancelled." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "photographer") {
      return res.status(403).json({ message: "Only photographers can update booking status." });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use approved, rejected, or completed." });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const photographer = await Photographer.findOne({ where: { user_id: req.user.user_id } });
    if (!photographer) {
      return res.status(400).json({ message: "Photographer profile not found." });
    }

    const service = await Service.findOne({
      where: { service_id: booking.service_id, photographer_id: photographer.photographer_id }
    });
    if (!service) {
      return res.status(403).json({ message: "Not authorised to update this booking." });
    }

    await booking.update({ status });
    res.json({ message: "Booking status updated.", status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};