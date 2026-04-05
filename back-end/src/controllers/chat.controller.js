import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import AppError from "../utils/AppError.js";

/* ---------------- CREATE / GET CONVERSATION ---------------- */

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;

  if (!receiverId) {
    throw new AppError("Receiver required", 400);
  }

  const participants = [senderId, receiverId].sort();
  const participantsKey = participants.join("_");

  const conversation = await Conversation.findOneAndUpdate(
    { participantsKey },
    {
      $setOnInsert: {
        participants,
        participantsKey,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  res.status(200).json({
    success: true,
    message: "get Create Conversation",
    data: conversation,
  });
});

/* ---------------- GET USER CONVERSATIONS ---------------- */

export const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const conversations = await Conversation.find({
    participants: { $in: [userId] },
  })
    .populate("participants", "name")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: conversations,
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
  });
});
