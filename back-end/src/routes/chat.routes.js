import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/chat.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("User", "Entrepreneur"))

// Conversation
router.post("/conversation", getOrCreateConversation);
router.get("/conversation", getUserConversations);

// Messages
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);

router.patch("/messages/read/:conversationId", markAsRead);

export default router;