import Sidebar from "../components/Entrepreneur/Sidebar";
import { Outlet } from "react-router-dom";
import { useSideBar } from "../stores/sideBarStore";
import { Sidebar as SidebarIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";

export type SidebarProfile = {
  name: string;
  role: string;
  icon: string;
};

export type SidebarNavItem = {
  id: string;
  icon: string;
  label: string;
  path: string;
  badge?: string;
};

export type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};

const sidebarNav: SidebarNavSection[] = [
  {
    title: "Main",
    items: [
      {
        id: "overview",
        icon: "📊",
        label: "Overview",
        path: "/entrepreneur",
      },
      {
        id: "booking",
        icon: "📦",
        label: "Booking & Requests",
        path: "/entrepreneur/booking",
      },
      {
        id: "services",
        icon: "🛍️",
        label: "Services & Products",
        path: "/entrepreneur/services",
      },
      {
        id: "schedule",
        icon: "🕒",
        label: "Schedule",
        path: "/entrepreneur/schedule",
      },
      {
        id: "availability",
        icon: "📅",
        label: "Availability",
        path: "/entrepreneur/availability",
      },
      {
        id: "earnings",
        icon: "💰",
        label: "Earnings",
        path: "/entrepreneur/earnings",
      },
    ],
  },
  {
    title: "Engage",
    items: [
      {
        id: "messages",
        icon: "💬",
        label: "Messages",
        path: "/entrepreneur/messages",
      },
      {
        id: "reviews",
        icon: "⭐",
        label: "Reviews",
        path: "/entrepreneur/reviews",
      },
      {
        id: "profile",
        icon: "👤",
        label: "My Profile",
        path: "/entrepreneur/profile",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        id: "settings",
        icon: "⚙️",
        label: "Settings",
        path: "/entrepreneur/settings",
      },
    ],
  },
];

export default function Entrepreneur() {
  const setOpen = useSideBar((state) => state.setOpen);
  const init = useSideBar((state) => state.init);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    init(!isMobile);
  }, [isMobile, init]);

  return (
    <div className="h-screen flex flex-col bg-[var(--cream)] font-sans text-[#2C1A0E]">
      {/* MAIN */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar sidebarNav={sidebarNav} />
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <button
            onClick={() => setOpen()}
            className="text-black p-2 w-fit z-10 bg-[var(--color-white)] text-[#6B4A2D] border border-[rgba(196,99,42,0.12)] cursor-pointer rounded-xl mb-2"
          >
            <SidebarIcon size={18} />
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
