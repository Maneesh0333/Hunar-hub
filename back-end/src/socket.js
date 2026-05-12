import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import Message from "./models/Message.model.js";
import Conversation from "./models/conversation.model.js";
import AppError from "./utils/AppError.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  /* ✅ SOCKET AUTH */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.accessToken;

      if (!token) {
        return next(new AppError("Unauthorized", 401));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      socket.user = decoded;

      next();
    } catch (err) {
      next(new AppError("Invalid token", 401));
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Connected:", socket.id);

    /* ✅ AUTO JOIN USER ROOM */
    socket.join(socket.user.id);

    /* ---------- JOIN CONVERSATION ---------- */
    socket.on("join_conversation", async (conversationId) => {
      if (!conversationId) return;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) return;

      const isMember = conversation.participants.some(
        (id) => id.toString() === socket.user.id,
      );

      if (!isMember) return;

      socket.join(conversationId);
    });

    /* ---------- LEAVE CONVERSATION ---------- */
    socket.on("leave_conversation", (conversationId) => {
      if (!conversationId) return;

      socket.leave(conversationId);
    });

    /* ---------- MARK AS READ ---------- */
    socket.on("mark_as_read", async ({ conversationId }) => {
      try {
        if (!conversationId) return;

        const userId = socket.user.id;

        await Message.updateMany(
          {
            conversation: conversationId,
            readBy: { $ne: userId },
          },
          {
            $addToSet: { readBy: userId },
          },
        );

        io.to(conversationId).emit("messages_read", {
          conversationId,
          userId,
        });
      } catch (err) {
        console.error("mark_as_read error:", err);
      }
    });

    /* ---------- SEND MESSAGE ---------- */
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, receiverId, text } = data;

        const senderId = socket.user.id;

        if (!conversationId || !receiverId || !text?.trim()) {
          return;
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) return;

        const isMember = conversation.participants.some(
          (id) => id.toString() === senderId,
        );

        if (!isMember) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          text: text.trim(),
          readBy: [senderId],
        });

        const populated = await message.populate("sender", "name");

        await Conversation.findByIdAndUpdate(conversationId, {
          $set: {
            lastMessage: text,
          },
        });

        io.to(conversationId).emit("receive_message", populated);

        io.to(receiverId).emit("notification", {
          conversationId,
          message: populated,
        });
      } catch (err) {
        console.error("send_message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};
