import { Server } from "socket.io";
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Connected:", socket.id);

    /* ---------- JOIN USER ---------- */
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.join(userId);
    });

    /* ---------- JOIN CONVERSATION ---------- */
    socket.on("join_conversation", (conversationId) => {
      if (!conversationId) return;
      socket.join(conversationId);
    });

    /* ---------- LEAVE CONVERSATION ---------- */
    socket.on("leave_conversation", (conversationId) => {
      if (!conversationId) return;
      socket.leave(conversationId);
    });

    /* ---------- MARK AS READ ---------- */
    socket.on("mark_as_read", async ({ conversationId, userId }) => {
      try {
        if (!conversationId || !userId) return;

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
        const { conversationId, senderId, receiverId, text } = data;
        if (!conversationId || !senderId || !receiverId || !text) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          text,
          readBy: [senderId], // sender already read
        });

        const populated = await message.populate("sender", "name");

        // update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { lastMessage: text },
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
