import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../lib/socket";

import { useAuthStore } from "../stores/authStore";
import {
  useConversations,
  useCreateConversation,
  useMarkAsRead,
  useMessages,
  type Message,
  type MessageResponse,
  type User,
} from "../hooks/User/useChat";

import { useQueryClient } from "@tanstack/react-query";
import { formatMessageTime } from "../utils/FormatMessageTime ";
import { getMessageStatus } from "../utils/GetMessageStatus ";
import Spinner from "./Shared/Spinner";
import ChatInput from "./Shared/ChatInput";
import MessageList from "./Shared/MessageList";
import Sidebar from "./Shared/Sidebar";

export default function Chat() {
  const location = useLocation();
  const receiverId = location.state?.entrepreneurId;
  const user = useAuthStore((s) => s.user);

  const queryClient = useQueryClient();

  const [activeConversation, setActiveConversation] = useState<
    { id: string; otherUser: User | undefined } | undefined
  >();

  /* ================= Mark As Read ================= */
  const markAsRead = useMarkAsRead();

  /* ================= CREATE CONVERSATION ================= */
  const createConversation = useCreateConversation();

  useEffect(() => {
    if (!activeConversation?.id) return;

    markAsRead.mutate(activeConversation.id);
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!receiverId) return;

    createConversation.mutate(
      { receiverId },
      {
        onSuccess: (data) => {
          const otherUser = data.data.participants.find(
            (p) => p._id !== user?.id,
          );
          setActiveConversation({
            id: data.data._id,
            otherUser: otherUser,
          });
        },
      },
    );
  }, [receiverId]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!activeConversation?.id || !user) return;

    socket.emit("join", user?.id);
    socket.emit("join_conversation", activeConversation.id);

    const handleMessage = (msg: Message) => {
      queryClient.setQueryData<MessageResponse>(
        ["messages", activeConversation?.id],
        (old) => {
          // 1. If no cache exists, just return it (or return a default structure)
          if (!old || !old.data) return old;

          const exists = old.data.some((m: Message) => m._id === msg._id);
          if (exists) return old;

          // 3. Return the typed object
          return {
            ...old,
            data: [...old.data, msg],
          };
        },
      );
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [activeConversation?.id, user, queryClient]);

  return (
    <div className="flex-1 h-screen flex bg-[#FAF5ED] overflow-y-auto">
      <Sidebar
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
      />

      {/* ================= CHAT AREA ================= */}
      {activeConversation?.id ? (
        <div className="flex flex-col flex-1">
          {/* HEADER */}
          <div className="p-4 bg-white border-b border-[rgba(196,99,42,0.13)] font-semibold">
            {activeConversation.otherUser?.name}
          </div>

          <MessageList activeConversation={activeConversation} />

          <ChatInput activeConversation={activeConversation} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}
