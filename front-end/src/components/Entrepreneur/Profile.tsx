import About from "../About";
import ProfileHeader from "../ProfileHeader";
import AchievementsCard from "./AchievementsCard";
import BasicInformationCard from "./BasicInformationCard";
import Header from "../Shared/Header";
import ProfileCompletenessCard from "./ProfileCompletenessCard";
import { useProfile } from "../../hooks/Entrepreneur/useProfile";
import SideSheet from "../Shared/SideSheet";
import { useState } from "react";
import EntrepreneurProfileForm from "../forms/EntrepreneurProfileForm";
import Spinner from "../Shared/Spinner";

function Profile() {
  const [open, setOpen] = useState(false);
  const { data: profileData, isLoading, isError, error } = useProfile();

  if (isLoading) return <Spinner />;
  if (isError) return <div>{error.message}</div>;
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="My Profile"
        description="Manage your profile information"
      />

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
          <AchievementsCard />
        </div>
      </div>

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
