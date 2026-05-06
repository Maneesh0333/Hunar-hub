import { Link, useNavigate } from "react-router-dom";

import { useIsWishlisted, useToggleWishlist } from "../hooks/User/useWishlist";
import { useAuthStore } from "../stores/authStore";
import Stat from "./Stat";
import type { EntrepreneurProfile } from "../hooks/User/useEntrepreneurPublicProfile";
import { useCreateConversation } from "../hooks/User/useChat";
import Spinner from "./Shared/Spinner";

type ProfileHeaderProp = {
  page: "Entrepreneur" | "User";
  data: EntrepreneurProfile | undefined;
  onEdit?: () => void;
  bookRef?: React.RefObject<HTMLElement | null>;
};

function ProfileHeader({ page, data, onEdit, bookRef }: ProfileHeaderProp) {
  const { data: isWishlisted } = useIsWishlisted(data?._id);
  const toggleWishlist = useToggleWishlist();

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const createConversation = useCreateConversation();

  const handleChatClick = () => {
    if (user) {
      createConversation.mutate({ receiverId: data?.user._id });
      navigate(`/user/chat`, { state: { openList: false } });
    } else {
      navigate("/auth");
    }
  };
  return (
    <>
      {/* COVER */}
      <div className="h-56 p-6 max-md:h-40 bg-gradient-to-r from-[#3B1A06] via-[#8B3E15] to-[#C4632A]">
        {page === "User" && (
          <Link
            to="/search"
            className="text-sm bg-transparent text-white hover:text-[var(--clay-light)] cursor-pointer"
          >
            ← Back to browse
          </Link>
        )}
      </div>

      <section className="bg-white border-b px-6 pt-6 border-[rgba(196,99,42,0.12)]">
        <div className="flex flex-col md:flex-row gap-6 justify-between pb-6">
          <div className="flex-1">
            <div className="-mt-13 p-1 rounded-2xl bg-white w-fit ">
              <div className="w-22 h-22 font-semibold rounded-2xl bg-[#D4B896] flex items-center justify-center text-4xl shadow">
                {data?.user.name[0]}
              </div>
            </div>
            <h1 className="font-serif text-3xl font-black mt-3">
              {data?.user?.name}
            </h1>
            <p className="text-sm text-[#5C3A1E] mt-1">
              {data?.bio?.length === 0 ? "Bio not added" : data?.bio}
            </p>

            <div className="grid gap-3 grid-cols-2 mt-4 w-fit">
              <div className="flex items-center">
                <div className="text-xl">📍</div>
                <div className="text-xs text-[#5C3A1E]">
                  {data?.user?.city || "city not added"}
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-xl">💬</div>
                <div className="text-xs text-[#5C3A1E]">
                  {data?.languages.length === 0
                    ? "Languages not added"
                    : data?.languages.toString()}
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-xl">⚡</div>
                <div className="text-xs text-[#5C3A1E]">
                  Usually responds in 30 min
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-xl">🏠</div>
                <div className="text-xs text-[#5C3A1E]">
                  {data?.visitType.includes("visit_home")
                    ? "Home visits available"
                    : "Home visits not available"}
                </div>
              </div>
            </div>

            <div className="flex gap-6 mt-6">
              <Stat value={data?.rating.average ?? 0} label="★ Rating" />
              <Stat value={data?.rating.totalReviews ?? 0} label="Reviews" />
              <Stat value={data?.completedOrders ?? 0} label="Orders" />
              <Stat value={data?.experienceYears ?? 0} label="Years" />
            </div>
          </div>

          <div className="flex items-end  gap-3">
            <button
              onClick={
                page === "User"
                  ? () => {
                      if (!bookRef?.current) return;

                      bookRef?.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  : onEdit
              }
              className="px-5 py-3 h-fit bg-[var(--clay)] hover:bg-[var(--clay-dark)] text-white rounded-xl font-semibold shadow cursor-pointer hover:-translate-y-1 transition-all duration-200"
            >
              {page === "User" ? "📅 Book Now" : "Edit Profile"}
            </button>

            {page === "User" && (
              <>
                <button
                  onClick={() => handleChatClick()}
                  disabled={createConversation.isPending}
                  className="px-5 py-3 h-fit bg-[var(--cream)] border border-[rgba(196,99,42,0.12)] hover:border-[var(--clay)] cursor-pointer text-white rounded-xl font-bold"
                >
                  {!createConversation.isPending ? (
                    "💬"
                  ) : (
                    <Spinner className="h-6! w-6!" />
                  )}
                </button>

                <button
                  onClick={
                    user
                      ? () =>
                          toggleWishlist.mutate({
                            entrepreneurId: data?._id,
                            isWishlisted: isWishlisted,
                          })
                      : () => navigate("/auth")
                  }
                  className="px-5 py-3 h-fit bg-[var(--cream)] border border-[rgba(196,99,42,0.12)] hover:border-[var(--clay)] cursor-pointer text-white rounded-xl font-bold"
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfileHeader;
