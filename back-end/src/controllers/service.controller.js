import Service from "../models/Service.model.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import Category from "../models/Category.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";

export const createService = asyncHandler(async (req, res) => {
  const { title, description, price, category, priceUnit, deliveryTime } =
    req.body;

  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  // ✅ Validate category
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    throw new AppError("Invalid category", 400);
  }

  // ✅ Prevent duplicate service title per entrepreneur
  const existing = await Service.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
    entrepreneur: entrepreneur._id,
  });

  if (existing) {
    throw new AppError("Service already exists", 400);
  }

  const service = await Service.create({
    entrepreneur: entrepreneur._id,
    title,
    description,
    price,
    priceUnit,
    category: categoryDoc._id,
    deliveryTime,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

export const getAllServices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", category } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const matchStage = {
    isActive: true,
  };

  /* 🔍 SEARCH (optimized using text index) */
  if (search) {
    matchStage.$text = { $search: search };
  }

  /* 📂 CATEGORY FILTER */
  if (category) {
    matchStage.category = category;
  }

  const pipeline = [
    { $match: matchStage },

    {
      $facet: {
        services: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },

          /* 👇 populate replacement */
          {
            $lookup: {
              from: "entrepreneurs",
              localField: "entrepreneur",
              foreignField: "_id",
              as: "entrepreneur",
            },
          },
          { $unwind: "$entrepreneur" },
        ],

        totalFiltered: [{ $count: "count" }],
      },
    },
  ];

  const result = await Service.aggregate(pipeline);

  const services = result[0].services;
  const totalFiltered = result[0].totalFiltered[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: "Services fetched successfully",
    data: {
      services,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: services.length,
    },
  });
});

export const getServiceByEntrepreneurIdPublic = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid ID", 400);
    }

    const service = await Service.find({
      entrepreneur: id,
      isActive: true,
    })
      .select("-category -isActive -createdAt -updatedAt -__v -entrepreneur")
      .lean();

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  },
);

export const getMyServices = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  const matchStage = {
    entrepreneur: entrepreneur._id,
  };

  if (status !== "All") {
    matchStage.isActive = status === "Active";
  }

  console.log(search);

  if (search) {
    matchStage.$text = { $search: search };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $facet: {
        services: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
        ],
        totalFiltered: [{ $count: "count" }],
      },
    },
  ];

  const result = await Service.aggregate(pipeline);

  const services = result[0].services;
  const totalFiltered = result[0].totalFiltered[0]?.count || 0;

  const statsRaw = await Service.aggregate([
    {
      $match: { entrepreneur: entrepreneur._id },
    },
    {
      $group: {
        _id: "$isActive",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = { Active: 0, Inactive: 0 };

  statsRaw.forEach((s) => {
    if (s._id) stats.Active = s.count;
    else stats.Inactive = s.count;
  });

  const totalServices = await Service.countDocuments({
    entrepreneur: entrepreneur._id,
  });

  res.status(200).json({
    success: true,
    message: "Fetched successfully",
    data: {
      services,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalServices,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: services.length,
    },
  });
});

export const enableService = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  }).select("_id");

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  const service = await Service.findOneAndUpdate(
    {
      _id: req.params.id,
      entrepreneur: entrepreneur._id,
    },
    { isActive: true },
    { new: true, runValidators: true },
  );

  if (!service) {
    throw new AppError("Service not found or not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Service enabled successfully",
  });
});

export const disableService = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  }).select("_id");

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  const service = await Service.findOneAndUpdate(
    {
      _id: req.params.id,
      entrepreneur: entrepreneur._id,
    },
    { isActive: false },
    { new: true, runValidators: true },
  );

  if (!service) {
    throw new AppError("Service not found or not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Service disabled successfully",
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({
    user: req.user.id,
  }).select("_id");

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  const service = await Service.findOneAndUpdate(
    {
      _id: req.params.id,
      entrepreneur: entrepreneur._id,
    },
    req.body,
    { new: true, runValidators: true },
  );

  if (!service) {
    throw new AppError("Service not found or not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
});
