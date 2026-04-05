import { useEffect, useRef } from "react";
import { useAuthStore } from "../../stores/authStore";
import { formatMessageTime } from "../../utils/FormatMessageTime ";
import { getMessageStatus } from "../../utils/GetMessageStatus ";
import { useMessages, type User } from "../../hooks/User/useChat";

type PropsType = {
  activeConversation: { id: string; otherUser: User | undefined } | undefined;
};

export default function MessageList({ activeConversation }: PropsType) {
  const user = useAuthStore((state) => state.user);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data: messageData } = useMessages(activeConversation?.id);
  const messages = messageData?.data || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${
            msg.sender._id === user?.id ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-xl max-w-xs ${
              msg.sender._id === user?.id
                ? "bg-[#C4632A] text-white rounded-br-md"
                : "bg-white border border-[rgba(196,99,42,0.13)] rounded-bl-md"
            }`}
          >
            {msg.text}

            <div className="text-[10px] opacity-70 mt-1 text-right">
              {formatMessageTime(msg.createdAt)}{" "}
              {getMessageStatus(msg, user?.id)}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
