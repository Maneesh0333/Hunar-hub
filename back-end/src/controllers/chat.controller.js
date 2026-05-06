import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const createConversation = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;

  if (!receiverId) {
    throw new AppError("Receiver required", 400);
  }

  if (senderId === receiverId) {
    throw new AppError("Cannot chat with yourself", 400);
  }

  /* ---------- CREATE UNIQUE KEY ---------- */
  const participants = [senderId, receiverId].sort();
  const participantsKey = participants.join("_");

  /* ---------- ATOMIC OPERATION ---------- */
  await Conversation.findOneAndUpdate(
    { participantsKey },
    {
      $setOnInsert: {
        participants,
        participantsKey,
      },
    },
    {
      new: true,
      upsert: true,
    },
  ).populate("participants", "name");

  return res.status(200).json({
    success: true,
    message: "Conversation fetched/created",
  });
});

export const getUserConversations = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 20);
  const skip = (pageNum - 1) * limitNum;

  const userId = new mongoose.Types.ObjectId(req.user.id);

  const aggregation = await Conversation.aggregate([
    // 1. Match conversations where user is a participant
    {
      $match: {
        participants: userId,
      },
    },

    // 2. Lookup only required user fields
    {
      $lookup: {
        from: "users",
        let: { participantIds: "$participants" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$participantIds"] },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "participants",
      },
    },

    // 3. Apply search (if provided)
    ...(search
      ? [
          {
            $match: {
              "participants.name": {
                $regex: search,
                $options: "i",
              },
            },
          },
        ]
      : []),

    // 4. Split into data + metadata
    {
      $facet: {
        data: [
          { $sort: { updatedAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              _id: 1,
              participants: 1,
              lastMessage: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        metadata: [{ $count: "total" }],
      },
    },
  ]);

  const conversations = aggregation[0]?.data || [];
  const total = aggregation[0]?.metadata[0]?.total || 0;

  res.status(200).json({
    success: true,
    message: "Conversations fetched",
    data: conversations,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
    },
  });
});

/* ---------------- GET MESSAGES ---------------- */

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "name")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    message: "Message fetched.",
    data: messages,
  });
});

/* ---------------- SEND MESSAGE (API fallback) ---------------- */

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;
  const sender = req.user.id;

  const message = await Message.create({
    conversation: conversationId,
    sender,
    text,
    readBy: [sender],
  });

  res.status(200).json({
    success: true,
    data: message,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { conversationId } = req.params;

  if (!conversationId) {
    throw new AppError("Conversation ID required", 400);
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
    },
  );

  res.status(200).json({
    success: true,
    message: "marked as read",
  });
});
