export const getMessageStatus = (
  msg: any,
  currentUserId: string | undefined,
) => {
  if (!currentUserId) return;
  const isMine = msg.sender._id === currentUserId;

  if (!isMine) return "";

  if (msg.readBy.length === 1) return "✓"; // sent
  if (msg.readBy.length > 1) return "✓✓"; // seen

  return "";
};
