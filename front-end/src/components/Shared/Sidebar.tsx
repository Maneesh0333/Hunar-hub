import { useEffect } from "react";
import { useConversations, type User } from "../../hooks/User/useChat";
import { useAuthStore } from "../../stores/authStore";
import Spinner from "./Spinner";

type PropsType = {
  activeConversation: { id: string; otherUser: User | undefined } | undefined;
  setActiveConversation: (data: {
    id: string;
    otherUser: User | undefined;
  }) => void;
};

export default function Sidebar({
  activeConversation,
  setActiveConversation,
}: PropsType) {
  const user = useAuthStore((state) => state.user);

  const { data: convoData, isLoading: isLoadingConvo } = useConversations();
  const conversations = convoData?.data || [];

  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      const otherUser = conversations[0].participants.find(
        (p) => p._id !== user?.id,
      );

      setActiveConversation({
        id: conversations[0]._id,
        otherUser: otherUser,
      });
    }
  }, [conversations]);

  return (
    <div className="w-80 bg-white border-r border-[rgba(196,99,42,0.13)] hidden md:flex flex-col">
      <div className="p-4 font-bold text-lg border-b border-[rgba(196,99,42,0.13)]">
        Messages
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoadingConvo ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : (
          <>
            {conversations.length > 0 ? (
              <>
                {conversations.map((convo) => {
                  const otherUser = convo.participants.find(
                    (p) => p._id !== user?.id,
                  );

                  return (
                    <div
                      key={convo._id}
                      onClick={() =>
                        setActiveConversation({ id: convo._id, otherUser })
                      }
                      className={`${
                        activeConversation?.id === convo._id
                          ? "bg-[var(--warm-white)]"
                          : "bg-[var(--cream)]]"
                      } flex justify-between  border-b border-[rgba(196,99,42,0.13)] cursor-pointer`}
                    >
                      <div className="flex items-center px-4 py-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B3E15] to-[#C4632A] flex items-center justify-center text-white">
                          🧵
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-sm">
                            {otherUser?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-[var(--ink)] truncate">
                            I can do the blouse in 2 days…
                          </div>
                        </div>
                      </div>

                      {activeConversation?.id === convo._id && (
                        <div className="w-1 rounded-2xl bg-[var(--clay)]"></div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-sm">
                No Message
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
