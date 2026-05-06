import type { Message } from "../hooks/User/useChat";

export const getMessageStatus = (
  msg: Message,
  currentUserId?: string,
  otherUserId?: string
) => {
  if (!currentUserId || !otherUserId) return "";

  if (msg.sender._id !== currentUserId) return "";

  return msg.readBy.includes(otherUserId) ? "✓✓" : "✓";
};