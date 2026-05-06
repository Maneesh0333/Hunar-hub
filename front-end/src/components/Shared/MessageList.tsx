import { useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "../../stores/authStore";
import { formatMessageTime } from "../../utils/FormatMessageTime ";
import { getMessageStatus } from "../../utils/GetMessageStatus ";
import { useMessages, type User } from "../../hooks/User/useChat";
import Spinner from "./Spinner";
import ErrorState from "../../pages/ErrorState";

type PropsType = {
  activeConversation: { id: string; otherUser: User | undefined } | undefined;
};

export default function MessageList({ activeConversation }: PropsType) {
  const user = useAuthStore((state) => state.user);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    data: messageData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMessages(activeConversation?.id);

  const messages = useMemo(() => {
    return messageData?.data ?? [];
  }, [messageData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load message"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">No message</div>
    );
  }

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
              {getMessageStatus(
                msg,
                user?.id,
                activeConversation?.otherUser?._id,
              )}{" "}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
