import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../lib/socket";

import { useAuthStore } from "../stores/authStore";
import {
  useMessages,
  type Message,
  type MessageResponse,
  type User,
} from "../hooks/User/useChat";

import { useQueryClient } from "@tanstack/react-query";
import ChatInput from "./Shared/ChatInput";
import MessageList from "./Shared/MessageList";
import Sidebar from "./Shared/Sidebar";

export default function Chat() {
  const location = useLocation();
  const openList = location.state?.openList;

  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [activeConversation, setActiveConversation] = useState<
    { id: string; otherUser: User | undefined } | undefined
  >();

  const [showChat, setShowChat] = useState(() => {
    if (openList) {
      return false; // show conversation list
    } else {
      return true;
    }
  });

  const { data: messageData } = useMessages(activeConversation?.id);

  /* ================= JOIN / LEAVE ================= */
  useEffect(() => {
    if (!activeConversation?.id || !user) return;

    socket.emit("join", user.id);
    socket.emit("join_conversation", activeConversation.id);

    return () => {
      socket.emit("leave_conversation", activeConversation.id);
    };
  }, [activeConversation?.id, user]);

  /* ================= MARK AS READ ================= */
  useEffect(() => {
    if (!activeConversation?.id || !user || !messageData) return;

    const hasUnread = messageData.data.some(
      (m) => m.sender._id !== user.id && !m.readBy.includes(user.id),
    );

    if (!hasUnread) return;

    socket.emit("mark_as_read", {
      conversationId: activeConversation.id,
      userId: user.id,
    });
  }, [messageData, activeConversation?.id, user]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      queryClient.setQueryData<MessageResponse>(
        ["messages", msg.conversation],
        (old) => {
          if (!old) {
            return {
              success: true,
              message: "",
              data: [msg],
            };
          }

          const exists = old.data.some((m) => m._id === msg._id);
          if (exists) return old;

          return {
            ...old,
            data: [...old.data, msg],
          };
        },
      );
    };

    const handleRead = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      queryClient.setQueryData<MessageResponse>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((msg) =>
              msg.readBy.includes(userId)
                ? msg
                : {
                    ...msg,
                    readBy: [...msg.readBy, userId],
                  },
            ),
          };
        },
      );
    };

    socket.on("receive_message", handleMessage);
    socket.on("messages_read", handleRead);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("messages_read", handleRead);
    };
  }, [queryClient]);

  const handleSetActiveConversation = useCallback(
    (data: {
      id: string;
      otherUser: User | undefined;
      setInUseEffect?: boolean | undefined;
    }) => {
      setActiveConversation({ id: data.id, otherUser: data.otherUser });
      if (!data?.setInUseEffect) {
        setShowChat(true);
      }
    },
    [],
  );

  return (
    <div className="flex-1 h-screen flex bg-[#FAF5ED] overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <div className={`${showChat ? "hidden" : "flex"} md:flex max-md:flex-1`}>
        <Sidebar
          openList={openList}
          activeConversation={activeConversation}
          setActiveConversation={handleSetActiveConversation}
        />
      </div>

      {/* ================= CHAT AREA ================= */}
      <div
        className={`${showChat ? "flex" : "hidden"} md:flex flex-col flex-1`}
      >
        {activeConversation?.id ? (
          <>
            {/* HEADER */}
            <div className="p-4 bg-white border-b border-[rgba(196,99,42,0.13)] flex items-center gap-2">
              {/* 📱 BACK BUTTON */}
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden text-lg cursor-pointer"
              >
                ←
              </button>

              <div className="font-semibold">
                {activeConversation.otherUser?.name}
              </div>
            </div>

            <MessageList activeConversation={activeConversation} />
            <ChatInput activeConversation={activeConversation} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
