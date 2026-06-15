import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SEO from "../components/Shared/SEO";

export default function UserDashboardHero() {
  return (
    <>
      <SEO
        title="User Dashboard"
        description="Manage bookings and profile."
        noIndex
      />
      <div className="flex flex-col h-screen">
        <NavBar />

        <Outlet />
      </div>
    </>
  );
}
