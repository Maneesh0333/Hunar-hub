import type { EntrepreneurProfile } from "../hooks/Entrepreneur/useProfile";
import Stat from "./Stat";

type ProfileHeaderProp = {
  page: "Entrepreneur" | "User";
  data: EntrepreneurProfile | undefined;
  onEdit?: () => void;
};

function ProfileHeader({ page, data, onEdit }: ProfileHeaderProp) {
  return (
    <>
      {/* COVER */}
      <div className="h-56 bg-gradient-to-r from-[#3B1A06] via-[#8B3E15] to-[#C4632A]" />

      <section className="bg-white border-b px-6 pt-6 border-[rgba(196,99,42,0.12)]">
        <div className="flex flex-col md:flex-row gap-6 justify-between pb-6">
          <div className="flex-1">
            <div className="-mt-13 p-1 rounded-2xl bg-white w-fit ">
              <div className="w-24 h-24 rounded-2xl bg-[#D4B896] flex items-center justify-center text-4xl shadow">
                🧵
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
                  {data?.city.length === 0 ? "city not added" : data?.city}
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
                  Home visits available
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
                page === "User" ? () => console.log("User Action") : onEdit
              }
              className="px-8 py-3 h-fit bg-[var(--clay)] hover:bg-[var(--clay-dark)] text-white rounded-xl font-semibold shadow cursor-pointer hover:-translate-y-1 transition-all duration-200"
            >
              {page === "User" ? "📅 Book Now" : "Edit Profile"}
            </button>

            {page === "User" && (
              <>
                <button className="px-5 py-3 h-fit bg-[var(--cream)] border border-[rgba(196,99,42,0.12)] hover:border-[var(--clay)] cursor-pointer text-white rounded-xl font-bold">
                  💬
                </button>

                <button className="px-5 py-3 h-fit bg-[var(--cream)] border border-[rgba(196,99,42,0.12)] hover:border-[var(--clay)] cursor-pointer text-white rounded-xl font-bold">
                  🤍
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3 border-t border-[rgba(196,99,42,0.12)] ">
          <span className="inline-block text-[14px] text-[var(--clay)] px-5 py-3 font-semibold border-b-2 border-[var(--clay)]">
            Overview
          </span>

          <span className="inline-block text-[14px] text-[var(--earth-mid)] px-5 py-3 font-semibold">
            Services
          </span>

          <span className="inline-block text-[14px] text-[var(--earth-mid)] px-5 py-3 font-semibold">
            Reviews
          </span>

          <span className="inline-block text-[14px] text-[var(--earth-mid)] px-5 py-3 font-semibold">
            Availability
          </span>
        </div>
      </section>
    </>
  );
}

export default ProfileHeader;
