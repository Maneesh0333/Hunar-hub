import { useEffect, useMemo, useState } from "react";
import { useConversations, type User } from "../../hooks/User/useChat";
import { useAuthStore } from "../../stores/authStore";
import Spinner from "./Spinner";
import SearchInput from "./SearchInput";
import { useMediaQuery } from "react-responsive";

type PropsType = {
  openList: boolean;
  activeConversation: { id: string; otherUser: User | undefined } | undefined;
  setActiveConversation: (data: {
    id: string;
    otherUser: User | undefined;
    setInUseEffect?: boolean;
  }) => void;
};

export default function Sidebar({
  activeConversation,
  setActiveConversation,
  openList
}: PropsType) {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useConversations(search);

  const conversations = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  /* ✅ AUTO SELECT FIRST CONVO */
  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      const otherUser = conversations[0].participants.find(
        (p) => p._id !== user?.id,
      );

      if (!isMobile || !openList) {
        setActiveConversation({
          id: conversations[0]._id,
          otherUser,
          setInUseEffect: true,
        });
      }
    }
  }, [conversations, activeConversation, user?.id, setActiveConversation, isMobile, openList]);

  useEffect(() => {
    if (
      conversations.length > 0 &&
      conversations[0]?._id !== activeConversation?.id
    ) {
      const otherUser = conversations[0].participants.find(
        (p) => p._id !== user?.id,
      );

      if (!openList) {
        setActiveConversation({
          id: conversations[0]._id,
          otherUser,
          setInUseEffect: true,
        });
      } 
    }
  }, [conversations, openList, setActiveConversation, user?.id]);

  /* INFINITE SCROLL */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="w-full md:w-80 bg-white border-r border-[rgba(196,99,42,0.13)] flex flex-col">
      <div className="p-4 font-bold text-lg border-b border-[rgba(196,99,42,0.13)]">
        Messages
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search conversations..."
          className="w-full bg-[var(--warm-white)] mt-2 font-normal"
        />
      </div>

      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : conversations.length > 0 ? (
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
                      : ""
                  } flex justify-between border-b border-[rgba(196,99,42,0.13)] cursor-pointer`}
                >
                  <div className="flex items-center px-4 py-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br font-semibold from-[#8B3E15] to-[#C4632A] flex items-center justify-center text-white">
                      {otherUser?.name?.[0] || "U"}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-sm">
                        {otherUser?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-[var(--ink)] truncate">
                        {convo.lastMessage || "No message"}
                      </div>
                    </div>
                  </div>

                  {activeConversation?.id === convo._id && (
                    <div className="w-1 rounded-2xl bg-[var(--clay)]"></div>
                  )}
                </div>
              );
            })}

            {/* bottom loader */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Spinner />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-sm">
            No Conversations
          </div>
        )}
      </div>
    </div>
  );
}
