import { Outlet } from "react-router-dom";
import Categories from "../components/Categories";
import NavBar from "../components/NavBar";

export default function UserDashboardHero() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
