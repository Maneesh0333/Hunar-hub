import { Server } from "socket.io";
import Message from "./models/message.model.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("send_message", async (data) => {
      const { conversationId, senderId, receiverId, text } = data;

      const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        text,
        readBy: [senderId],
      });

      const populated = await message.populate("sender", "name");

      // send to conversation
      io.to(conversationId).emit("receive_message", populated);

      // notify receiver
      io.to(receiverId).emit("notification", {
        conversationId,
        message: populated,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};