import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function UserDashboardHero() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />

      <Outlet />
    </div>
  );
}
