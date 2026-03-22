import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";

export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { service } = req.body;

  const serviceResult = await Service.findById(service);
  if (!serviceResult) {
    throw new AppError("Service not found", 404);
  }

  await Booking.create({
    customer: userId,
    entrepreneur: serviceResult.entrepreneur,
    totalAmount: serviceResult.price,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Booking successfully",
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    customer: req.user.id,
  })
    .populate("service")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: bookings.length,
    data: bookings,
  });
});

export const getEntrepreneurBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, search = "", status = "All" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 20);
  const skip = (pageNum - 1) * limitNum;

  /* ---------------- Get Entrepreneur ---------------- */

  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  /* ---------------- Base + Filter Match ---------------- */

  const baseMatch = {
    entrepreneur: entrepreneur._id,
  };

  const filterMatch = { ...baseMatch };

  if (status !== "All") {
    filterMatch.status = status;
  }

  /* ---------------- Pipeline ---------------- */

  const pipeline = [];

  // 🔥 Always filter by entrepreneur first (performance)
  pipeline.push({ $match: baseMatch });

  // 👤 Customer
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "customer",
      foreignField: "_id",
      as: "customer",
    },
  });

  pipeline.push({ $unwind: "$customer" });

  // 🛠 Service
  pipeline.push({
    $lookup: {
      from: "services",
      localField: "service",
      foreignField: "_id",
      as: "service",
    },
  });

  pipeline.push({ $unwind: "$service" });

  // 🔍 Search
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { bookingId: { $regex: search, $options: "i" } },
          { "customer.name": { $regex: search, $options: "i" } },
          { "customer.email": { $regex: search, $options: "i" } },
          { "customer.phone": { $regex: search, $options: "i" } },
          { "service.title": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  /* ---------------- Facet ---------------- */

  pipeline.push({
    $facet: {
      /* ---------------- BOOKINGS (filtered) ---------------- */
      bookings: [
        { $match: filterMatch },

        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },

        {
          $project: {
            bookingId: 1,
            totalAmount: 1,
            visitType: 1,
            status: 1,
            paymentStatus: 1,
            createdAt: 1,

            "customer._id": 1,
            "customer.name": 1,
            "customer.email": 1,
            "customer.phone": 1,

            "service._id": 1,
            "service.title": 1,
            "service.price": 1,
          },
        },
      ],

      /* ---------------- STATS (NOT filtered by status) ---------------- */
      stats: [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ],

      /* ---------------- TOTAL FILTERED ---------------- */
      totalFiltered: [
        { $match: filterMatch },
        { $count: "count" },
      ],

      /* ---------------- TOTAL ALL ---------------- */
      totalBookings: [{ $count: "count" }],
    },
  });

  /* ---------------- Execute ---------------- */

  const result = await Booking.aggregate(pipeline);

  const bookings = result[0].bookings;

  const totalFiltered = result[0].totalFiltered[0]?.count || 0;
  const totalBookings = result[0].totalBookings[0]?.count || 0;

  const statsArray = result[0].stats;

  let stats = {
    Pending: 0,
    Confirmed: 0,
    Declined: 0,
    Completed: 0,
    Cancelled: 0,
  };

  statsArray.forEach((s) => {
    stats[s._id] = s.count;
  });

  /* ---------------- Response ---------------- */

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data: {
      bookings,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalBookings,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: bookings.length,
    },
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("customerId", "name email")
    .populate("entrepreneurId")
    .populate("serviceId")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: bookings.length,
    data: bookings,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("customerId", "name email")
    .populate("entrepreneurId")
    .populate("serviceId");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // USER access
  if (req.user.role === "USER") {
    if (booking.customerId._id.toString() !== req.user.id) {
      throw new AppError("Not authorized", 403);
    }
  }

  // ENTREPRENEUR access
  if (req.user.role === "ENTREPRENEUR") {
    const entrepreneur = await Entrepreneur.findOne({
      userId: req.user.id,
    });

    if (
      !entrepreneur ||
      booking.entrepreneurId._id.toString() !== entrepreneur._id.toString()
    ) {
      throw new AppError("Not authorized", 403);
    }
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});


export const declineBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "Pending") {
    throw new AppError("Booking cannot be declined", 400);
  }

  booking.status = "Declined";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking Declined",
    data: booking,
  });
});


export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status === "Completed") {
    throw new AppError("Completed bookings cannot be cancelled", 400);
  }

  booking.status = "Cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled",
  });
});


export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  /* ---------------- Allowed Status ---------------- */

  const allowedStatuses = ["Confirmed", "Declined", "Completed"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid status update", 400);
  }

  /* ---------------- Find Entrepreneur ---------------- */

  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  /* ---------------- Find Booking ---------------- */

  const booking = await Booking.findOne({
    _id: id,
    entrepreneur: entrepreneur._id,
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  /* ---------------- Status Transition Rules ---------------- */

  const currentStatus = booking.status;

  // 🔒 Prevent invalid transitions
  if (currentStatus === "Completed" || currentStatus === "Cancelled") {
    throw new AppError("Cannot update completed/cancelled booking", 400);
  }

  if (status === "Confirmed" && currentStatus !== "Pending") {
    throw new AppError("Only pending bookings can be confirmed", 400);
  }

  if (status === "Declined" && currentStatus !== "Pending") {
    throw new AppError("Only pending bookings can be declined", 400);
  }

  if (status === "Completed" && currentStatus !== "Confirmed") {
    throw new AppError("Only confirmed bookings can be completed", 400);
  }

  /* ---------------- Update ---------------- */

  booking.status = status;

  // 📊 Update stats (optional but 🔥)
  if (status === "Completed") {
    await Entrepreneur.findByIdAndUpdate(entrepreneur._id, {
      $inc: {
        completedOrders: 1,
        totalOrders: 1,
      },
    });
  }

  if (status === "Confirmed") {
    await Entrepreneur.findByIdAndUpdate(entrepreneur._id, {
      $inc: { totalOrders: 1 },
    });
  }

  await booking.save();

  /* ---------------- Response ---------------- */

  res.status(200).json({
    success: true,
    message: `Booking ${status} successfully`,
    data: booking,
  });
});