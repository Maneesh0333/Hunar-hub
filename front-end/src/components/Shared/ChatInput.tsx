import { useState } from "react";
import { socket } from "../../lib/socket";
import { useAuthStore } from "../../stores/authStore";
import type { User } from "../../hooks/User/useChat";

type PropsType = {
  activeConversation: { id: string; otherUser: User | undefined } | undefined;
};

export default function ChatInput({ activeConversation }: PropsType) {
  const [input, setInput] = useState("");
  const user = useAuthStore((s) => s.user);

  const sendMessage = () => {
    if (!input.trim() || !activeConversation?.id) return;

    const receiver = activeConversation.otherUser

    socket.emit("send_message", {
      conversationId: activeConversation.id,
      senderId: user?.id,
      receiverId: receiver?._id,
      text: input,
    });

    setInput("");
  };

  return (
    <div className="bg-white border-t border-[rgba(196,99,42,0.13)] px-4 py-3">
      <div className="flex items-center gap-2 bg-[#FAF5ED] border border-[rgba(196,99,42,0.13)] rounded-xl px-3 py-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 resize-none bg-transparent outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          className="w-9 h-9 bg-[#C4632A] text-white rounded-lg cursor-pointer"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
