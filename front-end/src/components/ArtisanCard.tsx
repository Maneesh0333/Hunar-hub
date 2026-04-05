import { Link } from "react-router-dom";
import type { EntrepreneurCard } from "../hooks/User/useSearchEntrepreneurs";

type ArtisanCardProps = {
  artisan: EntrepreneurCard;
};

export default function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <div
      className="
        flex flex-col group bg-white rounded-2xl overflow-hidden
        border border-[rgba(196,99,42,0.13)]
        transition-all duration-300 
        hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(196,99,42,0.14)]
      "
    >
      {/* Header */}
      <div>
        {/* Cover */}
        <div className="relative h-[88px] flex items-start p-2.5 bg-gradient-to-br from-[#C4632A] to-[#E8895A]">
          <span className="text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur">
            ⭐ Top Pick
          </span>

        </div>

        {/* Avatar */}
        <div
          className="relative z-10 -mt-7 ml-4 w-14 h-14 rounded-full border-4 border-white bg-[#D4B896]
                      flex items-center justify-center text-xl shadow-md"
        >
          🏺
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col h-full justify-between px-4 pb-4 pt-2">
        <div>
          <h3 className="font-playfair text-[15px] font-bold text-[#1C1008]">
            {artisan.name}
          </h3>

          <p className="text-[13px] font-medium text-[#C4632A] mt-0.5">
            {artisan.bio || "Bio not added"}
          </p>

          <p className="text-[12px] text-[#5C3A1E] mt-1">
            📍 {artisan.city ?? "city not added"}
          </p>

          <div className="flex items-center gap-1.5 text-[12px] mt-1.5">
            {artisan.isAvailableToday ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9E7E] animate-pulse" />
                <span className="text-[#7A9E7E]">Available today</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#b94f25] animate-pulse" />
                <span className="text-[#b94f25]">Not Available today</span>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {artisan.skills.map((tag, index) => (
              <span
                key={index}
                className="
                text-[11px] px-2 py-0.5 rounded-full
                bg-[rgba(196,99,42,0.07)]
                border border-[rgba(196,99,42,0.12)]
                text-[#C4632A] font-medium
              "
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/5">
            <div className="flex items-center gap-1 text-[12px]">
              <span className="text-[#D4A847]">
                {/* {"★".repeat(Math.floor(artisan.rating))} */}★
              </span>
              <span className="font-bold text-[#2C1A0E]">{artisan.rating}</span>
              <span className="text-[#5C3A1E]">({artisan.totalReviews})</span>
            </div>

            <div className="text-[14px] font-bold text-[#C4632A]">
              {artisan.minPrice}{" "}
              <span className="text-[11px] font-normal text-[#5C3A1E]">
                /{artisan?.priceUnit?.split("_")[1]}
              </span>
            </div>
          </div>

          {/* Action */}
          <Link
            to={`/profile/${artisan._id}`}
            className="
            w-full mt-3 py-2 rounded-xl
            border border-[rgba(196,99,42,0.13)]
            bg-[#FAF5ED] text-center
            text-[13px] font-semibold text-[#C4632A]
            transition
            hover:bg-[#C4632A] hover:text-white hover:border-[#C4632A]
          "
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
