import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";

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

export const getUserBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, search = "", status = "All" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 20);
  const skip = (pageNum - 1) * limitNum;

  const userId = new mongoose.Types.ObjectId(req.user.id);

  /* ---------------- Base + Filter ---------------- */

  const baseMatch = {
    customer: userId,
  };

  const filterMatch = { ...baseMatch };

  if (status !== "All") {
    filterMatch.status = status;
  }

  /* ---------------- Pipeline ---------------- */

  const pipeline = [];

  pipeline.push({ $match: baseMatch });

  /* ---------------- SERVICE ---------------- */

  pipeline.push({
    $lookup: {
      from: "services",
      localField: "service",
      foreignField: "_id",
      as: "service",
    },
  });

  pipeline.push({
    $unwind: {
      path: "$service",
      preserveNullAndEmptyArrays: true,
    },
  });

  /* ---------------- ENTREPRENEUR ---------------- */

  pipeline.push({
    $lookup: {
      from: "entrepreneurs",
      localField: "entrepreneur",
      foreignField: "_id",
      as: "entrepreneur",
    },
  });

  pipeline.push({
    $unwind: {
      path: "$entrepreneur",
      preserveNullAndEmptyArrays: true,
    },
  });

  /* ---------------- ENTREPRENEUR USER ---------------- */

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "entrepreneur.user",
      foreignField: "_id",
      as: "entrepreneurUser",
    },
  });

  pipeline.push({
    $unwind: {
      path: "$entrepreneurUser",
      preserveNullAndEmptyArrays: true,
    },
  });

  pipeline.push({
    $addFields: {
      "entrepreneur.user": "$entrepreneurUser",
    },
  });

  /* ---------------- ⭐ REVIEW LOOKUP ---------------- */

  pipeline.push({
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "booking",
      as: "reviews",
    },
  });

  pipeline.push({
    $lookup: {
      from: "complaints",
      localField: "_id",
      foreignField: "booking",
      as: "complaints",
    },
  });

  /* ---------------- ADD isReviewed ---------------- */

  pipeline.push({
    $addFields: {
      isReviewed: { $gt: [{ $size: { $ifNull: ["$reviews", []] } }, 0] },
      isComplained: { $gt: [{ $size: { $ifNull: ["$complaints", []] } }, 0] },
    },
  });

  /* ---------------- SEARCH ---------------- */

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { bookingId: { $regex: search, $options: "i" } },
          { "service.title": { $regex: search, $options: "i" } },
          { "entrepreneur.user.name": { $regex: search, $options: "i" } },
          { "entrepreneur.user.phone": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  /* ---------------- FACET ---------------- */

  pipeline.push({
    $facet: {
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
            isReviewed: 1,
            isComplained: 1,

            // Service
            "service._id": 1,
            "service.title": 1,
            "service.price": 1,

            // Entrepreneur
            "entrepreneur._id": 1,
            "entrepreneur.user._id": 1,
            "entrepreneur.user.name": 1,
            "entrepreneur.user.phone": 1,
          },
        },
      ],

      stats: [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ],

      totalFiltered: [{ $match: filterMatch }, { $count: "count" }],

      totalBookings: [{ $count: "count" }],
    },
  });

  /* ---------------- EXECUTE ---------------- */
  const result = await Booking.aggregate(pipeline);

  const bookings = result[0]?.bookings || [];
  const totalFiltered = result[0]?.totalFiltered[0]?.count || 0;
  const totalBookings = result[0]?.totalBookings[0]?.count || 0;
  const statsArray = result[0]?.stats || [];

  /* ---------------- FORMAT STATS ---------------- */

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

  /* ---------------- RESPONSE ---------------- */

  res.status(200).json({
    success: true,
    message: "User bookings fetched successfully",
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
            requirements: 1,
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
      totalFiltered: [{ $match: filterMatch }, { $count: "count" }],

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

export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", status = "All" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  /* ---------------- FILTER OBJECT ---------------- */

  const filterMatch = {};

  // 🔍 Search
  if (search) {
    filterMatch.$or = [
      { bookingId: { $regex: search, $options: "i" } },
      { "service.title": { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "entrepreneur.user.name": { $regex: search, $options: "i" } },
    ];
  }

  // 🚦 Status filter
  if (status !== "All") {
    filterMatch.status = status;
  }

  /* ---------------- PIPELINE ---------------- */

  const pipeline = [
    /* 🔗 SERVICE */
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },

    /* 🔗 ENTREPRENEUR */
    {
      $lookup: {
        from: "entrepreneurs",
        localField: "entrepreneur",
        foreignField: "_id",
        as: "entrepreneur",
      },
    },
    { $unwind: { path: "$entrepreneur", preserveNullAndEmptyArrays: true } },

    /* 🔗 ENTREPRENEUR USER */
    {
      $lookup: {
        from: "users",
        localField: "entrepreneur.user",
        foreignField: "_id",
        as: "entrepreneurUser",
      },
    },
    {
      $unwind: {
        path: "$entrepreneurUser",
        preserveNullAndEmptyArrays: true,
      },
    },

    /* 🔗 CUSTOMER */
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },

    /* 🧠 MERGE USER INTO ENTREPRENEUR */
    {
      $addFields: {
        "entrepreneur.user": "$entrepreneurUser",
      },
    },

    /* ---------------- FACET ---------------- */

    {
      $facet: {
        /* 📦 BOOKINGS (FILTERED) */
        bookings: [
          { $match: filterMatch },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },

          {
            $project: {
              _id: 1,
              bookingId: 1,
              totalAmount: 1,
              visitType: 1,
              status: 1,
              paymentStatus: 1,
              createdAt: 1,

              "service.title": 1,

              "customer.name": 1,
              "customer.phone": 1,

              "entrepreneur.user.name": 1,
            },
          },
        ],

        /* 🔢 TOTAL FILTERED */
        totalFiltered: [{ $match: filterMatch }, { $count: "count" }],

        /* 🔢 TOTAL ALL */
        total: [{ $count: "count" }],

        /* 📊 GLOBAL STATS (UNFILTERED) */
        stats: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];

  /* ---------------- EXECUTE ---------------- */

  const result = await Booking.aggregate(pipeline);

  const bookings = result[0]?.bookings || [];
  const total = result[0]?.total[0]?.count || 0;
  const totalFiltered = result[0]?.totalFiltered[0]?.count || 0;
  const statsArray = result[0]?.stats || [];

  /* ---------------- FORMAT STATS ---------------- */

  const stats = {
    Pending: 0,
    Confirmed: 0,
    Declined: 0,
    Completed: 0,
    Cancelled: 0,
  };

  statsArray.forEach((s) => {
    stats[s._id] = s.count;
  });

  /* ---------------- RESPONSE ---------------- */

  res.status(200).json({
    success: true,
    message: "Admin bookings fetched successfully",
    data: {
      bookings,
      stats,
      total, // all bookings
      totalFiltered, // filtered count
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: bookings.length,
    },
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  /* ---------------- Validate Input ---------------- */
  const allowedStatuses = ["Paid"];

  if (!paymentStatus) {
    throw new AppError("Payment status is required", 400);
  }

  if (!allowedStatuses.includes(paymentStatus)) {
    throw new AppError("Invalid payment status", 400);
  }

  /* ---------------- Find Entrepreneur ---------------- */
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  })
    .select("_id")
    .lean();

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  /* ---------------- Find Booking ---------------- */
  const booking = await Booking.findOne({
    _id: id,
    entrepreneur: entrepreneur._id,
  }).select("_id paymentStatus");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  /* ---------------- Prevent Invalid Transition ---------------- */
  if (booking.paymentStatus === "Paid") {
    throw new AppError("Already Paid", 400);
  }

  /* ---------------- Update Status ---------------- */
  booking.paymentStatus = paymentStatus;
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking payment status updated successfully",
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
  })
    .select("_id")
    .lean();

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  /* ---------------- Find Booking ---------------- */
  const booking = await Booking.findOne({
    _id: id,
    entrepreneur: entrepreneur._id,
  }).select("_id status");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  /* ---------------- Status Transition Rules ---------------- */
  const currentStatus = booking.status;

  // Prevent invalid transitions
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

  // Update stats
  if (status === "Completed") {
    await Entrepreneur.findByIdAndUpdate(entrepreneur._id, {
      $inc: {
        completedOrders: 1,
      },
    });
  }

  if (status === "Confirmed") {
    await Entrepreneur.findByIdAndUpdate(entrepreneur._id, {
      $inc: { totalOrders: 1 },
    });
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    success: true,
    message: `Booking ${status} successfully`,
  });
});

export const updateUserBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  /* ---------------- Allowed Status ---------------- */

  const allowedStatuses = ["Cancelled"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid status update", 400);
  }

  /* ---------------- Find Booking ---------------- */

  const booking = await Booking.findOne({
    _id: id,
    customer: req.user.id,
  }).select("_id status");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  /* ---------------- Status Rules ---------------- */

  const currentStatus = booking.status;

  // ❌ Only Pending bookings can be cancelled
  if (currentStatus !== "Pending") {
    throw new AppError("Only pending bookings can be cancelled", 400);
  }

  /* ---------------- Update ---------------- */

  booking.status = "Cancelled";
  await booking.save();

  /* ---------------- Response ---------------- */

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
  });
});
