import { asyncHandler } from "../middleware/async.middleware.js";
import Complaint from "../models/Complaint.model.js";
import Booking from "../models/Booking.model.js";
import AppError from "../utils/AppError.js";

export const createComplaint = asyncHandler(async (req, res) => {
  const { booking, description, type } = req.body;

  const customer = req.user.id;

  // 🔍 Basic validation (extra safety)
  if (!booking || !description || !type) {
    throw new AppError("Booking, description and type are required", 400);
  }

  const existing = await Complaint.findOne({ booking, customer });

  if (existing) {
    throw new AppError("Complaint already exists for this booking", 400);
  }

  const bookingDoc = await Booking.findById(booking);

  if (!bookingDoc) {
    throw new AppError("Booking not found", 404);
  }

  const complaint = await Complaint.create({
    booking,
    customer,
    entrepreneur: bookingDoc.entrepreneur,
    description,
    type,
  });

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
  });
});

export const getComplaints = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const pipeline = [
    {
      $lookup: {
        from: "bookings",
        localField: "booking",
        foreignField: "_id",
        as: "bookingDetails",
      },
    },
    { $unwind: "$bookingDetails" },

    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
    { $unwind: "$customerInfo" },

    {
      $lookup: {
        from: "entrepreneurs",
        localField: "entrepreneur",
        foreignField: "_id",
        as: "entProfile",
      },
    },
    { $unwind: "$entProfile" },

    // Join with Users again to get the Entrepreneur's name
    {
      $lookup: {
        from: "users",
        localField: "entProfile.user",
        foreignField: "_id",
        as: "entUser",
      },
    },
    { $unwind: "$entUser" },

    // 2. Build Dynamic Match Stage
    {
      $match: {
        ...(status !== "All" ? { status } : {}),
        ...(search
          ? {
              $or: [
                { complaintId: { $regex: search, $options: "i" } },
                { "customerInfo.name": { $regex: search, $options: "i" } },
                { "entUser.name": { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      },
    },

    // 3. Facet for Pagination and Results
    {
      $facet: {
        complaints: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              complaintId: 1,
              type: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              customerName: "$customerInfo.name",
              customerPhone: "$customerInfo.phone",
              entrepreneurName: "$entUser.name",
              bookingId: "$bookingDetails.bookingId",
              bookingStatus: "$bookingDetails.status",
              entrepreneurId: "$entProfile._id",
            },
          },
        ],
        totalFiltered: [{ $count: "count" }],
      },
    },
  ];

  const result = await Complaint.aggregate(pipeline);

  // Safely extract data from facet result
  const complaints = result[0]?.complaints || [];
  const totalFiltered = result[0]?.totalFiltered[0]?.count || 0;

  /* 🔹 Global stats */
  const statsRaw = await Complaint.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Dynamically build stats based on your Enum: ["Open", "In Review", "Resolved"]
  const stats = { Open: 0, "In Review": 0, Resolved: 0 };
  statsRaw.forEach((s) => {
    if (s._id) stats[s._id] = s.count;
  });

  const totalComplaints = await Complaint.countDocuments();

  res.status(200).json({
    success: true,
    message: "Fetched successfully",
    data: {
      complaints,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalComplaints,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: complaints.length,
    },
  });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["In Review", "Resolved"];

  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const complaint = await Complaint.findById(id).select("_id status");

  if (!complaint) {
    throw new AppError("Complaint not found", 404);
  }

  // 🚫 Prevent redundant update
  if (complaint.status === status) {
    return res.status(200).json({
      success: true,
      message: `Complaint already marked as ${status}`,
    });
  }

  // 🚫 Prevent invalid transitions
  if (complaint.status === "Resolved") {
    throw new AppError("Resolved complaints cannot be modified", 400);
  }

  if (complaint.status === "Open" && status === "Resolved") {
    throw new AppError("Move complaint to 'In Review' before resolving", 400);
  }

  // ✅ Valid update
  complaint.status = status;
  await complaint.save();

  res.status(200).json({
    success: true,
    message: "Complaint status updated successfully",
  });
});
