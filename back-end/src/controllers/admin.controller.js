import User from "../models/User.model.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import Category from "../models/Category.model.js";

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
          ...(view === "entrepreneurs"? [{ $match: { verificationStatus: "Approved" } }]: []),
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
          ...(view === "entrepreneurs"? [{ $match: { verificationStatus: "Approved" } }]: []),
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
  const entrepreneur = await Entrepreneur.findById(req.params.id);

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  entrepreneur.verificationStatus = "Approved";
  await entrepreneur.save();

  // Change user role
  const user = await User.findById(entrepreneur.user);

  if (!user) {
    throw new AppError("Associated user not found", 404);
  }

  user.role = "Entrepreneur";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Entrepreneur approved successfully",
  });
});

export const rejectEntrepreneur = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id);

  if (!entrepreneur) {
    throw new AppError("Entrepreneur not found", 404);
  }

  entrepreneur.verificationStatus = "Rejected";
  await entrepreneur.save();

  res.status(200).json({
    success: true,
    message: "Entrepreneur rejected",
  });
});

export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("customerId")
    .populate("entrepreneurId")
    .populate("serviceId")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: bookings.length,
    data: bookings,
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
