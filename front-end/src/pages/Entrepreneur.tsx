import Sidebar from "../components/Entrepreneur/Sidebar";
import { Outlet } from "react-router-dom";

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

const sidebarProfile: SidebarProfile = {
  name: "Rashida Begum",
  role: "Entrepreneur · Verified",
  icon: "🧵",
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
        badge: "5",
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
        badge: "2",
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
        id: "analytics",
        icon: "📈",
        label: "Analytics",
        path: "/entrepreneur/analytics",
      },
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
  return (
    <div className="h-screen flex flex-col bg-[var(--cream)] font-sans text-[#2C1A0E]">
      {/* MAIN */}
      <div className="flex overflow-hidden">
        <Sidebar
          sidebarProfile={sidebarProfile}
          sidebarNav={sidebarNav}
          role="Entrepreneur"
        />

        <Outlet />
      </div>
    </div>
  );
}
