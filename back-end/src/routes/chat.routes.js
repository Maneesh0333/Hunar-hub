import express from "express";
import {
  getUserConversations,
  getMessages,
  sendMessage,
  markAsRead,
  createConversation,
} from "../controllers/chat.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("User", "Entrepreneur"))

// Conversation
router.post("/conversation", createConversation);
router.get("/conversation", getUserConversations);

// Messages
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);

router.patch("/messages/read/:conversationId", markAsRead);

export default router;