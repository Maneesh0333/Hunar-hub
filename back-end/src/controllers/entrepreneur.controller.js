import AppError from "../utils/AppError.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import calculateProfileCompleteness from "../utils/calculateProfileCompleteness.js";
import Service from "../models/Service.model.js";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import EntrepreneurSchedule from "../models/EntrepreneurSchedule.model.js";
import EntrepreneurAvailability from "../models/EntrepreneurAvailability.model.js";
import minutesToTime from "../utils/MinutesToTime.js";
import timeToMinutes from "../utils/TimeToMinutes.js";
import Review from "../models/Review.model.js";
import Booking from "../models/Booking.model.js";

export const getEntrepreneurProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const entrepreneur = await Entrepreneur.findOne({ user: id })
    .populate([
      {
        path: "user",
        select: "name phone email city",
      },
      {
        path: "category",
        select: "_id name",
      },
    ])
    .select("-updatedAt -isActive -verificationStatus");

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile feached.",
    data: entrepreneur,
  });
});

export const getEntrepreneurProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const entrepreneur = await Entrepreneur.findOne({ user: id })
    .populate([
      {
        path: "user",
        select: "name phone email city",
      },
      {
        path: "category",
        select: "_id name",
      },
    ])
    .select("-updatedAt -isActive -verificationStatus")
    .lean();

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile feached.",
    data: entrepreneur,
  });
});

export const getProfileCompletenessStats = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const entrepreneur = await Entrepreneur.findOne({ user: req.user.id })
    .populate("user")
    .populate("category");

  const servicesCount = await Service.countDocuments({
    entrepreneur: entrepreneur._id,
  });

  const completeness = calculateProfileCompleteness(
    entrepreneur,
    servicesCount,
  );

  res.status(200).json({
    success: true,
    message: "ProfileCompleteness fetched.",
    data: { profileCompleteness: completeness },
  });
});

export const updateEntrepreneurProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!Object.keys(req.body).length) {
    throw new AppError("No fields provided for update", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userFields = ["name", "email", "phone", "city"];
    const userUpdates = {};
    const entrepreneurUpdates = {};

    for (const [key, value] of Object.entries(req.body)) {
      (userFields.includes(key) ? userUpdates : entrepreneurUpdates)[key] =
        value;
    }

    if (Object.keys(userUpdates).length) {
      await User.findByIdAndUpdate(
        id,
        { $set: userUpdates },
        { runValidators: true, session },
      );
    }

    const entrepreneur = await Entrepreneur.findOneAndUpdate(
      { user: id },
      { $set: entrepreneurUpdates },
      { returnDocument: "after", runValidators: true, session },
    );

    if (!entrepreneur)
      throw new AppError("Entrepreneur profile not found", 404);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

export const getSchedule = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  const schedules = await EntrepreneurSchedule.find({
    entrepreneur: entrepreneur._id,
  }).sort({
    createdAt: 1,
  });

  const formattedSchedules = schedules.map((s) => ({
    ...s.toObject(),
    start: minutesToTime(s.start),
    end: minutesToTime(s.end),
  }));

  res.status(200).json({
    success: true,
    message: "Schedules fetched successfully",
    data: formattedSchedules,
  });
});

export const createSchedule = asyncHandler(async (req, res) => {
  const { day, start = "09:00", end = "17:00", working = true } = req.body;

  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  const startInMinutes = timeToMinutes(start);
  const endInMinutes = timeToMinutes(end);

  // Prevent duplicate day
  const existing = await EntrepreneurSchedule.findOne({
    entrepreneur: entrepreneur._id,
    day,
  });

  if (existing) {
    throw new AppError("Schedule already exists for this day", 400);
  }

  const schedule = await EntrepreneurSchedule.create({
    entrepreneur: entrepreneur._id,
    day,
    start: startInMinutes,
    end: endInMinutes,
    working,
  });

  res.status(201).json({
    success: true,
    message: "Schedule created successfully",
    data: schedule,
  });
});

export const updateSchedule = asyncHandler(async (req, res) => {
  const scheduleId = req.params.id;

  // ❌ No data sent
  if (!Object.keys(req.body).length) {
    throw new AppError("No fields provided for update", 400);
  }

  // 🔍 Get entrepreneur
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  // 🔍 Get existing schedule
  const record = await EntrepreneurSchedule.findOne({
    entrepreneur: entrepreneur._id,
    _id: scheduleId,
  });

  if (!record) {
    throw new AppError("Schedule not found", 404);
  }

  // ✅ Allow only specific fields
  const allowedFields = ["day", "start", "end", "working"];
  const updateData = {};

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updateData[key] = req.body[key];
    }
  }

  // ✅ Convert time (HH:mm → minutes)
  if (updateData.start !== undefined) {
    updateData.start = timeToMinutes(updateData.start);
  }

  if (updateData.end !== undefined) {
    updateData.end = timeToMinutes(updateData.end);
  }

  // ✅ FINAL VALUES (merge existing + new)
  const finalStart =
    updateData.start !== undefined ? updateData.start : record.start;

  const finalEnd = updateData.end !== undefined ? updateData.end : record.end;

  const finalWorking =
    updateData.working !== undefined ? updateData.working : record.working;

  // ✅ VALIDATION (like pre-save)
  if (finalWorking) {
    if (finalStart >= finalEnd) {
      throw new AppError("Start time must be before end time", 400);
    }
  }

  // ✅ Apply updates
  Object.assign(record, updateData);

  await record.save();

  res.status(200).json({
    success: true,
    message: "Schedule updated successfully",
    data: record,
  });
});

export const getAvailability = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  const availability = await EntrepreneurAvailability.findOne({
    entrepreneur: entrepreneur._id,
  });

  res.status(200).json({
    success: true,
    data: {
      unavailableDates: availability?.unavailableDates || [],
    },
  });
});

export const saveAvailability = asyncHandler(async (req, res) => {
  const { unavailableDates } = req.body;

  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  const updated = await EntrepreneurAvailability.findOneAndUpdate(
    { entrepreneur: entrepreneur._id },
    { unavailableDates },
    { new: true, upsert: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Availability updated",
  });
});

export const getSearchEntrepreneurProfile = asyncHandler(async (req, res) => {
  const {
    search = "",
    category = "All",
    rating = "Any",
    availableToday,
    homeService,
    page = 1,
    limit = 10,
  } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const todayDay = today.toLocaleString("en-US", { weekday: "long" });

  const match = {
    "user.status": "Active",
  };

  if (search) {
    match.$or = [
      { "user.name": { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
    ];
  }

  if (category !== "All") {
    match["category._id"] = new mongoose.Types.ObjectId(category);
  }

  if (availableToday !== "false") {
    match.isAvailableToday = true;
  }

  if (homeService !== "false") {
    match.homeServiceAvailable = true;
  }

  const pipeline = [
    ...(rating !== "Any"
      ? [{ $match: { "rating.average": { $gte: parseInt(rating.charAt(0)) } } }]
      : []),

    // 👤 User
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // 📂 Category
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    // 💰 Services (optimized)
    {
      $lookup: {
        from: "services",
        let: { entrepreneurId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$entrepreneur", "$$entrepreneurId"],
              },
            },
          },
        ],
        as: "services",
      },
    },

    // ✅ ONLY entrepreneurs with services
    {
      $match: {
        "services.0": { $exists: true },
      },
    },

    // 📅 Availability
    {
      $lookup: {
        from: "entrepreneuravailabilities",
        localField: "_id",
        foreignField: "entrepreneur",
        as: "availability",
      },
    },

    // 🗓 Schedule
    {
      $lookup: {
        from: "entrepreneurschedules",
        localField: "_id",
        foreignField: "entrepreneur",
        as: "schedule",
      },
    },

    // 🧠 Compute fields
    {
      $addFields: {
        availability: { $arrayElemAt: ["$availability", 0] },

        // ⭐ find cheapest service
        minService: {
          $reduce: {
            input: "$services",
            initialValue: null,
            in: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$$value", null] },
                    { $lt: ["$$this.price", "$$value.price"] },
                  ],
                },
                "$$this",
                "$$value",
              ],
            },
          },
        },

        // 📅 today schedule
        todaySchedule: {
          $filter: {
            input: "$schedule",
            as: "s",
            cond: { $eq: ["$$s.day", todayDay] },
          },
        },
      },
    },

    // 🔥 Extract values
    {
      $addFields: {
        minPrice: "$minService.price",
        priceUnit: "$minService.priceUnit",
        homeServiceAvailable: { $in: ["visit_home", "$visitType"] },

        isAvailableToday: {
          $and: [
            { $gt: [{ $size: "$todaySchedule" }, 0] },
            {
              $eq: [{ $arrayElemAt: ["$todaySchedule.working", 0] }, true],
            },
            {
              $not: {
                $in: [todayISO, "$availability.unavailableDates"],
              },
            },
          ],
        },
      },
    },

    // 🔍 Apply search + filters
    { $match: match },

    // 📊 Pagination + response
    {
      $facet: {
        entrepreneurs: [
          { $sort: { isAvailableToday: -1, "rating.average": -1 } },
          { $skip: skip },
          { $limit: limitNum },

          {
            $project: {
              _id: "$user._id",
              bio: 1,
              skills: 1,
              city: "$user.city",
              name: "$user.name",
              category: "$category.name",
              rating: "$rating.average",
              totalReviews: "$rating.totalReviews",
              minPrice: 1,
              priceUnit: 1,
              isAvailableToday: 1,
              verificationStatus: 1,
            },
          },
        ],

        totalFiltered: [{ $count: "count" }],
      },
    },
  ];

  const result = await Entrepreneur.aggregate(pipeline);
  const total = result[0]?.totalFiltered?.[0]?.count || 0;
  const entrepreneurResult = result[0].entrepreneurs || {};

  res.status(200).json({
    success: true,
    message: "Search entrepreneurs fetched",
    data: { entrepreneurs: entrepreneurResult },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
    },
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  /* ---------------- Validate ---------------- */
  if (!rating || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("booking not found", 404);
  }

  const service = await Service.findById(booking.service);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  /* ---------------- Prevent Duplicate Review ---------------- */

  const existingReview = await Review.findOne({
    customer: req.user.id,
    booking: bookingId,
  });

  if (existingReview) {
    throw new AppError("You already reviewed this service", 400);
  }

  /* ---------------- Create Review ---------------- */

  const review = await Review.create({
    customer: req.user.id,
    entrepreneur: service.entrepreneur,
    service: booking.service,
    booking: booking._id,
    rating,
    comment,
  });

  /* ---------------- Update Entrepreneur Rating ---------------- */

  const stats = await Review.aggregate([
    { $match: { entrepreneur: service.entrepreneur } },
    {
      $group: {
        _id: "$entrepreneur",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating || 0;
  const totalReviews = stats[0]?.totalReviews || 0;

  await Entrepreneur.findByIdAndUpdate(service.entrepreneur, {
    "rating.average": avgRating,
    "rating.totalReviews": totalReviews,
  });

  /* ---------------- Response ---------------- */

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    data: review,
  });
});

export const getReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 20);
  const skip = (pageNum - 1) * limitNum;

  const entrepreneur = await Entrepreneur.findOne({
    user: id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  const matchStage = {
    entrepreneur: entrepreneur._id,
  };

  /* ---------------- AGGREGATION ---------------- */

  const result = await Review.aggregate([
    { $match: matchStage },

    {
      $facet: {
        /* 📦 PAGINATED REVIEWS */
        reviews: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },

          {
            $lookup: {
              from: "users",
              localField: "customer",
              foreignField: "_id",
              as: "customer",
            },
          },
          { $unwind: "$customer" },

          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "service",
            },
          },
          { $unwind: "$service" },

          {
            $project: {
              rating: 1,
              comment: 1,
              createdAt: 1,

              "customer._id": 1,
              "customer.name": 1,

              "service._id": 1,
              "service.title": 1,
            },
          },
        ],

        /* 📊 STATS */
        stats: [
          {
            $group: {
              _id: null,
              average: { $avg: "$rating" },
              total: { $sum: 1 },

              five: {
                $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
              },
              four: {
                $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] },
              },
              three: {
                $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] },
              },
              two: {
                $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] },
              },
              one: {
                $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] },
              },
            },
          },
        ],

        /* 🔢 TOTAL (for pagination) */
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  /* ---------------- FORMAT ---------------- */

  const reviews = result[0]?.reviews || [];
  const stats = result[0]?.stats[0] || {};
  const total = result[0]?.totalCount[0]?.count || 0;

  const average = stats.average ? Number(stats.average.toFixed(1)) : 0;

  const breakdown = {
    5: stats.five || 0,
    4: stats.four || 0,
    3: stats.three || 0,
    2: stats.two || 0,
    1: stats.one || 0,
  };

  /* ---------------- RESPONSE ---------------- */

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: {
      reviews,
      average,
      total,
      breakdown,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const entrepreneur = await Entrepreneur.findOne({ user: userId });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  const entrepreneurId = entrepreneur._id;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  /* ---------------- SINGLE FACET QUERY ---------------- */

  const [result] = await Booking.aggregate([
    { $match: { entrepreneur: entrepreneurId } },

    {
      $facet: {
        /* 🔹 BASIC STATS */
        stats: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalEarnings: {
                $sum: {
                  $cond: [
                    { $eq: ["$paymentStatus", "Paid"] },
                    "$totalAmount",
                    0,
                  ],
                },
              },
              pendingToday: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", "Pending"] },
                        { $gte: ["$createdAt", todayStart] },
                        { $lte: ["$createdAt", todayEnd] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],

        /* 🔹 MONTHLY BOOKINGS */
        monthly: [
          {
            $group: {
              _id: { $month: "$createdAt" },
              count: { $sum: 1 },
            },
          },
        ],

        /* 🔹 STATUS STATS */
        status: [
          {
            $group: {
              _id: "$status",
              value: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  /* ---------------- FORMAT STATS ---------------- */

  const statsData = result.stats[0] || {
    totalOrders: 0,
    totalEarnings: 0,
    pendingToday: 0,
  };

  /* ---------------- MONTHLY TRANSFORM ---------------- */

  const monthlyBookings = Array.from({ length: 12 }, (_, i) => {
    const found = result.monthly.find((m) => m._id === i + 1);

    return {
      month: MONTHS[i],
      bookings: found?.count || 0,
    };
  });

  /* ---------------- STATUS TRANSFORM ---------------- */

  const statusMap = {
    Pending: 0,
    Confirmed: 0,
    Declined: 0,
    Completed: 0,
    Cancelled: 0,
  };

  result.status.forEach((s) => {
    if (s._id in statusMap) {
      statusMap[s._id] = s.value;
    }
  });

  const statusStats = Object.keys(statusMap).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  /* ---------------- RESPONSE ---------------- */

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalEarnings: statsData.totalEarnings,
        totalOrders: statsData.totalOrders,
        avgRating: entrepreneur.rating?.average || 0,
        totalReviews: entrepreneur.rating?.totalReviews || 0,
        pendingToday: statsData.pendingToday,
      },
      charts: {
        monthlyBookings,
        statusStats,
      },
    },
  });
});
