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

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const entrepreneur = await Entrepreneur.findOne({
    userId: id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      totalOrders: entrepreneur.totalOrders,
      completedOrders: entrepreneur.completedOrders,
      rating: entrepreneur.rating,
      verificationStatus: entrepreneur.verificationStatus,
    },
  });
});

export const getEntrepreneurProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const entrepreneur = await Entrepreneur.findOne({ user: id })
    .populate([
      {
        path: "user",
        select: "name phone email",
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID", 400);
  }

  const entrepreneur = await Entrepreneur.findById(id)
    .populate([
      {
        path: "user",
        select: "name phone email",
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
      { new: true, runValidators: true, session },
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
  const { search = "", category = "", page = 1, limit = 10 } = req.query;

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

  if (category) {
    match.category = new mongoose.Types.ObjectId(category);
  }

  const pipeline = [
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
              _id: 1,
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
            },
          },
        ],

        totalFiltered: [{ $count: "count" }],
      },
    },
  ];

  const result = await Entrepreneur.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: result[0],
  });
});
