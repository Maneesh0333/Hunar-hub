import User from "../models/User.model.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";

export const getUsers = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const query = {
    role: "User",
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ],
  };

  if (status !== "All") {
    query.status = status;
  }

  const statsPromise = User.aggregate([
    { $match: { role: "User" } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const usersPromise = User.find(query)
    .select("-role -signupAs")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalFilteredPromise = User.countDocuments(query);
  const totalUsersPromise = User.countDocuments({ role: "User" });

  const [users, totalFiltered, totalUsers, statsAgg] = await Promise.all([
    usersPromise,
    totalFilteredPromise,
    totalUsersPromise,
    statsPromise,
  ]);

  const stats = {
    Active: 0,
    Blocked: 0,
  };

  statsAgg.forEach((s) => {
    stats[s._id] = s.count;
  });

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    data: {
      users,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalUsers,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: users.length,
    },
  });
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "Admin") {
    throw new AppError("Admin cannot be blocked", 400);
  }

  user.status = "Blocked";
  await user.save();

  res.status(200).json({
    success: true,
    message: "User blocked successfully",
  });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.status = "Active";
  await user.save();

  res.status(200).json({
    success: true,
    message: "User unblocked successfully",
  });
});

export const getEntrepreneurs = asyncHandler(async (req, res) => {
  const {
    status = "All",
    page = 1,
    limit = 5,
    search = "",
    view = "applications",
  } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  /* ---------------- Filters ---------------- */

  const matchStage = {};

  if (status !== "All") {
    if (view === "applications") {
      matchStage.verificationStatus = status;
    }

    if (view === "entrepreneurs") {
      matchStage["user.status"] = status;
    }
  }

  if (view === "entrepreneurs") {
    matchStage.verificationStatus = "Approved";
  }

  if (search) {
    matchStage.$or = [
      { "user.name": { $regex: search, $options: "i" } },
      { "user.email": { $regex: search, $options: "i" } },
      { "user.phone": { $regex: search, $options: "i" } },
    ];
  }

  /* ---------------- Pipeline ---------------- */

  const pipeline = [];

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    },
  });

  pipeline.push({ $unwind: "$user" });

  pipeline.push({
    $facet: {
      entrepreneurs: [
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },

        {
          $project: {
            verificationStatus: 1,
            createdAt: 1,
            bio: 1,
            city: 1,
            rating: 1,
            completedOrders: 1,
            category: 1,
            "user._id": 1,
            "user.name": 1,
            "user.email": 1,
            "user.phone": 1,
            "user.status": 1,
          },
        },
      ],

      stats: [
        ...(view === "entrepreneurs"
          ? [{ $match: { verificationStatus: "Approved" } }]
          : []),
        {
          $group: {
            _id:
              view === "entrepreneurs" ? "$user.status" : "$verificationStatus",
            count: { $sum: 1 },
          },
        },
      ],

      totalFiltered: [{ $match: matchStage }, { $count: "count" }],

      totalEntrepreneurs: [
        ...(view === "entrepreneurs"
          ? [{ $match: { verificationStatus: "Approved" } }]
          : []),
        { $count: "count" },
      ],
    },
  });

  /* ---------------- Execute ---------------- */

  const result = await Entrepreneur.aggregate(pipeline);

  const entrepreneurs = result[0].entrepreneurs;

  const totalFiltered = result[0].totalFiltered[0]?.count || 0;
  const totalEntrepreneurs = result[0].totalEntrepreneurs[0]?.count || 0;

  const statsArray = result[0].stats;

  let stats =
    view === "entrepreneurs"
      ? { Active: 0, Blocked: 0 }
      : { Pending: 0, Approved: 0, Rejected: 0 };

  statsArray.forEach((s) => {
    stats[s._id] = s.count;
  });

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    data: {
      entrepreneurs,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalEntrepreneurs,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: entrepreneurs.length,
    },
  });
});

export const approveEntrepreneur = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Id", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const entrepreneur = await Entrepreneur.findById(id)
      .select("verificationStatus user")
      .session(session);

    if (!entrepreneur) {
      throw new AppError("Entrepreneur not found", 404);
    }

    if (entrepreneur.verificationStatus === "Approved") {
      throw new AppError("Already approved", 400);
    }

    await Entrepreneur.updateOne(
      { _id: id },
      { $set: { verificationStatus: "Approved" } },
      { session },
    );

    const userUpdate = await User.updateOne(
      { _id: entrepreneur.user },
      { $set: { role: "Entrepreneur" } },
      { session },
    );

    if (userUpdate.matchedCount === 0) {
      throw new AppError("Associated user not found", 404);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Entrepreneur approved successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const rejectEntrepreneur = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Id", 400);
  }

  const entrepreneur =
    await Entrepreneur.findById(id).select("verificationStatus");

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  if (entrepreneur.verificationStatus === "Rejected") {
    throw new AppError("Already rejected", 400);
  }

  const result = await Entrepreneur.updateOne(
    { _id: id },
    { $set: { verificationStatus: "Rejected" } },
  );

  // Optional safety check
  if (result.modifiedCount === 0) {
    throw new AppError("Failed to reject entrepreneur", 500);
  }

  res.status(200).json({
    success: true,
    message: "Entrepreneur rejected",
  });
});

export const getAllServicesAdmin = asyncHandler(async (req, res) => {
  const services = await Service.find()
    .populate("entrepreneurId")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: services.length,
    data: services,
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

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  /* ---------------- PARALLEL QUERIES ---------------- */

  const [
    userStats,
    entrepreneurStats,
    bookingStats,
    revenueStats,
    weeklyRevenueStats,
    growth,
  ] = await Promise.all([
    /* ---------------- USERS ---------------- */
    User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$role", "User"] },
                    { $eq: ["$signupAs", "User"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          newUsersToday: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", today] }, 1, 0],
            },
          },
        },
      },
    ]),

    /* ---------------- ENTREPRENEURS ---------------- */
    Entrepreneur.aggregate([
      {
        $group: {
          _id: null,
          totalEntrepreneurs: {
            $sum: {
              $cond: [
                { $ne: ["$verificationStatus", "User"] }, // Changed $net to $ne
                1,
                0,
              ],
            },
          },
          pendingApprovals: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "Pending"] }, 1, 0],
            },
          },
          verifiedEntrepreneurs: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "Approved"] }, 1, 0],
            },
          },
        },
      },
    ]),

    /* ---------------- BOOKINGS ---------------- */
    Booking.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
        },
      },
    ]),

    /* ---------------- TOTAL REVENUE ---------------- */
    Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]),

    /* ---------------- WEEKLY REVENUE ---------------- */
    Booking.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          createdAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: null,
          weeklyRevenue: { $sum: "$totalAmount" },
        },
      },
    ]),

    /* ---------------- USER GROWTH ---------------- */
    User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$role", "User"] },
                    { $eq: ["$signupAs", "User"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  /* ---------------- EXTRACT SAFE VALUES ---------------- */

  const users = userStats[0] || {};
  const entrepreneurs = entrepreneurStats[0] || {};
  const bookings = bookingStats[0] || {};
  const revenue = revenueStats[0] || {};
  const weeklyRevenue = weeklyRevenueStats[0] || {};

  /* ---------------- RESPONSE ---------------- */

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers: users.totalUsers || 0,
        newUsersToday: users.newUsersToday || 0,

        totalEntrepreneurs: entrepreneurs.totalEntrepreneurs || 0,
        pendingApprovals: entrepreneurs.pendingApprovals || 0,
        verifiedEntrepreneurs: entrepreneurs.verifiedEntrepreneurs || 0,

        totalOrders: bookings.totalOrders || 0,
        completedOrders: bookings.completedOrders || 0,

        totalRevenue: revenue.totalRevenue || 0,
        weeklyRevenue: weeklyRevenue.weeklyRevenue || 0,
      },
      charts: {
        growth,
      },
    },
  });
});
