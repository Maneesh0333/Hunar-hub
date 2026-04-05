import { useRef, useState } from "react";
import Reviews from "./Reviews";
import ProfileHeader from "./ProfileHeader";
import About from "./About";
import Spinner from "./Shared/Spinner";
import { useEntrepreneurPublicProfile } from "../hooks/User/useEntrepreneurPublicProfile";
import { useNavigate, useParams } from "react-router-dom";
import ServicesOffered from "./User/ServicesOffered";
import SideSheet from "./Shared/SideSheet";
import Button from "./Auth/Button";
import BookingForm from "./forms/BookingForm";
import { useAuthStore } from "../stores/authStore";

export default function ProfilePage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);

  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useEntrepreneurPublicProfile(id);

  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const negative = useNavigate();
  const bookRef = useRef<HTMLElement | null>(null);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="min-h-screen bg-[#FAF5ED] text-[#2C1A0E]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4 bg-[#FAF5ED]/95 backdrop-blur border-b">
        <div className="font-serif text-xl font-black text-[#C4632A]">
          Hunar<span className="text-[#2C1A0E]">Hub</span>
        </div>

        <div className="hidden md:flex text-sm text-[#5C3A1E] gap-1">
          <span className="text-[#C4632A] cursor-pointer">Home</span> ›
          <span className="text-[#C4632A] cursor-pointer">Tailors</span> ›
          <span>Rashida Begum</span>
        </div>

        <div className="ml-auto flex gap-2">
          <button className="w-9 h-9 border rounded-lg">🔗</button>
          <button
            className="w-9 h-9 border rounded-lg"
            onClick={() => setSaved(!saved)}
          >
            {saved ? "❤️" : "🤍"}
          </button>
          <button className="px-4 py-2 bg-[#C4632A] text-white rounded-lg text-sm font-semibold">
            Post a Request
          </button>
        </div>
      </nav>

      {/* PROFILE HEADER */}
      <ProfileHeader bookRef={bookRef} data={profileData} page="User" />

      {/* MAIN CONTENT */}
      <main className="flex flex-col gap-5 p-5 max-md:p-3">
        {/* LEFT */}
        <div className="space-y-6 max-md:space-y-3">
          {/* ABOUT */}
          <About data={profileData} />

          {/* SERVICES */}
          <ServicesOffered id={id} />

          {/* Reviews */}
          <Reviews entrepreneurId={id} />

          {/* BOOKING */}
          <section
            ref={bookRef}
            className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            {/* Header */}
            <div>
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                📅 Book Service
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Booking confirmed within 30 minutes
              </p>
            </div>

            {/* Trust badge */}
            <div className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <span>🛡️</span>
              <span>
                Book through our platform for <b>verified professionals</b>,
                secure payments, and reliable support.
              </span>
            </div>

            {/* Warning */}
            <p className="text-[11px] text-gray-400">
              ⚠️ For your safety, avoid booking outside the platform.
            </p>

            {/* CTA */}
            <Button
              label="Confirm Booking →"
              onClick={() => {
                user ? setOpen(true) : negative("/auth");
              }}
            />
          </section>

          {/* Artisan Details */}
          <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 h-fit">
            <h3 className="font-serif text-[var(--ink)] text-[13px] font-semibold mb-3">
              ℹ️ Artisan Details
            </h3>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">📍Location</div>
              <div className="text-[13px] text-[var(--ink)]">
                {profileData?.city || "Not added"}
              </div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">📦 Orders Done</div>
              <div className="text-[13px] text-[var(--ink)]">
                {profileData?.completedOrders || 0}
              </div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">🗣️ Languages</div>
              <div className="text-[13px] text-[var(--ink)]">
                {profileData?.languages.toString() || "Languages not added"}
              </div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)] text-[13px]">
              <div>📱 Phone number</div>
              <div className="text-[var(--ink)] font-medium">
                {profileData?.user.phone || "Not provided"}
              </div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">💳 Payment</div>
              <div className="text-[13px] text-[var(--ink)]">
                {profileData?.payment.toString() || "Payment not added"}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="text-[13px]">⏱ Response Time</div>
              <div className="text-[13px] text-[var(--ink)]">~30 min</div>
            </div>
          </section>

          {/* HunarHub Guarantee */}
          <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 h-fit">
            <h3 className="font-serif text-[var(--ink)] text-[13px] font-semibold mb-3">
              🛡️ HunarHub Guarantee
            </h3>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">✅ ID-verified artisan</div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">
                🔄 Free alteration if not satisfied
              </div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">💬 Direct chat with artisan</div>
            </div>

            <div className="flex items-center justify-between border-b py-2 border-[rgba(196,99,42,0.12)]">
              <div className="text-[13px]">📞 24/7 customer support</div>
            </div>
          </section>
        </div>
      </main>

      <SideSheet
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={"Book Service"}
        discription={"Fill details to Book service"}
      >
        <BookingForm
          visitType={profileData?.visitType}
          servicesId={id}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
