import About from "../About";
import ProfileHeader from "../ProfileHeader";
import BasicInformationCard from "./BasicInformationCard";
import Header from "../Shared/Header";
import ProfileCompletenessCard from "./ProfileCompletenessCard";
import { useProfile } from "../../hooks/Entrepreneur/useProfile";
import SideSheet from "../Shared/SideSheet";
import { useState } from "react";
import EntrepreneurProfileForm from "../forms/EntrepreneurProfileForm";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import PortfolioSection from "./PortfolioSection";

function Profile() {
  const [open, setOpen] = useState(false);
  const {
    data: profileData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useProfile();

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
    <div className="flex-1 flex flex-col space-y-3 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="My Profile"
        description="Manage your profile information"
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col  gap-5">
          <div className="rounded-2xl border border-[rgba(196,99,42,0.12)] overflow-hidden">
            <ProfileHeader
              page="Entrepreneur"
              data={profileData}
              onEdit={() => setOpen(true)}
            />
          </div>
          <About data={profileData} />

          <div className="flex flex-col lg:flex-row gap-5">
            <BasicInformationCard data={profileData} />
            <div className="flex-1 space-y-5">
              <ProfileCompletenessCard />
              <PortfolioSection page="Entrepreneur" EntrepreneurId="123"/>
            </div>
          </div>
        </div>
      )}

      <SideSheet
        title="Edit Profile"
        discription="Fill the details to edit"
        open={open}
        onClose={() => setOpen(false)}
      >
        <EntrepreneurProfileForm
          profile={profileData}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}

export default Profile;
