import { useState } from "react";
import SideSheet from "../components/Shared/SideSheet";
import Spinner from "../components/Shared/Spinner";
import { useProfile } from "../hooks/User/useProfile ";
import UserProfileForm from "../components/forms/UserProfileForm";
import Header from "../components/Shared/Header";
import { Link } from "react-router-dom";
import ErrorState from "./ErrorState";
import NoInternet from "./NoInternet";
import { useNetworkStatus } from "../hooks/Shared/useNetworkStatus";

export default function UserProfile() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProfile();
  const [open, setOpen] = useState(false);
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load profile"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#FAF5ED] text-[#2C1A0E] space-y-6">
      {/* Header */}
      <Link
        to="/home"
        className="text-sm bg-transparent text-[var(--clay-light)] hover:text-[var(--clay)] cursor-pointer"
      >
        ← Back to Home
      </Link>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          <Header
            title="My Profile"
            description="Manage your personal details and preferences"
          />

          {/* Profile Card */}
          <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 flex gap-6 max-lg:gap-3 items-center">
            <div className="w-15 h-15 max-lg:w-10 max-lg:h-10 shrink-0 font-semi-bold text-3xl max-lg:text-base rounded-2xl bg-[var(--clay)] text-white flex items-center justify-center">
              {profile?.name[0]}
            </div>

            <div className="flex-1">
              <div className="text-lg font-semibold">{profile?.name}</div>
              <div className="text-sm text-[#6B4A2D]">
                {profile?.email} {profile?.phone}
              </div>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 text-sm cursor-pointer font-semibold rounded-lg border border-[var(--clay)] text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white transition"
            >
              Edit Profile
            </button>
          </section>

          {/* Personal Information */}
          <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
            <h2 className="font-serif font-bold text-lg mb-4">
              📄 Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ["Full Name", profile?.name],
                ["Email", profile?.email],
                ["Phone", profile?.phone],
                ["City", profile?.city || "City not added"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-[var(--cream)] rounded-xl p-4 border border-[rgba(196,99,42,0.12)]"
                >
                  <div className="text-xs text-[#6B4A2D]">{label}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          {/* <section className="bg-white rounded-2xl border border-red-200 p-6">
            <h2 className="font-serif font-bold text-lg mb-3 text-red-600">
              🚨 Account
            </h2>

            <button className="text-sm font-semibold text-red-600 hover:underline">
              Deactivate Account
            </button>
          </section> */}

          <SideSheet
            open={open}
            onClose={() => setOpen(false)}
            title="Edit Profile"
            discription="Change the details to edit"
          >
            <UserProfileForm
              profile={profile}
              closeSheet={() => setOpen(false)}
            />
          </SideSheet>
        </>
      )}
    </div>
  );
}
