import AppError from "../utils/AppError.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import Wishlist from "../models/Wishlist.model.js";
import mongoose from "mongoose";

export const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id).select("name email phone city");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!Object.keys(req.body).length) {
    throw new AppError("No valid fields provided for update", 400);
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    ).select("name email phone city");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("Email already in use", 400);
    }
    throw err;
  }
});


export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { entrepreneurId } = req.body;

  const exists = await Wishlist.findOne({
    user: userId,
    entrepreneur: entrepreneurId,
  });

  if (exists) {
    return res.status(200).json({
      success: true,
      message: "Already in wishlist",
    });
  }

  await Wishlist.create({
    user: userId,
    entrepreneur: entrepreneurId,
  });

  res.status(201).json({
    success: true,
    message: "Added to wishlist",
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { entrepreneurId } = req.params;

  await Wishlist.findOneAndDelete({
    user: userId,
    entrepreneur: entrepreneurId,
  });

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const todayDay = today.toLocaleString("en-US", { weekday: "long" });

  const pipeline = [
    // 🧾 Get wishlist of user
    {
      $match: {
        user: userId,
      },
    },

    // 🔗 Join entrepreneur
    {
      $lookup: {
        from: "entrepreneurs",
        localField: "entrepreneur",
        foreignField: "_id",
        as: "entrepreneur",
      },
    },
    { $unwind: "$entrepreneur" },

    // 👤 Join user
    {
      $lookup: {
        from: "users",
        localField: "entrepreneur.user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // 📂 Category
    {
      $lookup: {
        from: "categories",
        localField: "entrepreneur.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    // 💰 Services
    {
      $lookup: {
        from: "services",
        let: { entrepreneurId: "$entrepreneur._id" },
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

    // 📅 Availability
    {
      $lookup: {
        from: "entrepreneuravailabilities",
        localField: "entrepreneur._id",
        foreignField: "entrepreneur",
        as: "availability",
      },
    },

    // 🗓 Schedule
    {
      $lookup: {
        from: "entrepreneurschedules",
        localField: "entrepreneur._id",
        foreignField: "entrepreneur",
        as: "schedule",
      },
    },

    // 🧠 Computed fields
    {
      $addFields: {
        availability: { $arrayElemAt: ["$availability", 0] },

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

        todaySchedule: {
          $filter: {
            input: "$schedule",
            as: "s",
            cond: { $eq: ["$$s.day", todayDay] },
          },
        },
      },
    },

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

    // 🎯 Final shape (same as search API)
    {
      $project: {
        _id: "$user._id", 
        name: "$user.name",
        city: "$user.city",
        bio: "$entrepreneur.bio",
        skills: "$entrepreneur.skills",
        category: "$category.name",
        rating: "$entrepreneur.rating.average",
        totalReviews: "$entrepreneur.rating.totalReviews",
        minPrice: 1,
        priceUnit: 1,
        isAvailableToday: 1,
      },
    },
  ];

  const wishlist = await Wishlist.aggregate(pipeline);

  res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully",
    data: wishlist,
  });
});

export const checkWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { entrepreneurId } = req.params;

  const exists = await Wishlist.exists({
    user: userId,
    entrepreneur: entrepreneurId,
  });

  res.status(200).json({
    success: true,
    message: "Wishlist status retrieved successfully",
    data: { isWishlisted: !!exists },
  });
});