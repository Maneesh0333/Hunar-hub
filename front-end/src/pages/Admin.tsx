import { Outlet } from "react-router-dom";
import type { SidebarNavSection, SidebarProfile } from "./Entrepreneur";
import Sidebar from "../components/Entrepreneur/Sidebar";

export const sidebarProfile: SidebarProfile = {
  name: "Neha Gupta",
  role: "Super Admin",
  icon: "👑",
};

export const sidebarNav: SidebarNavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        id: "overview",
        icon: "📊",
        label: "Overview",
        path: "/admin",
      },
      {
        id: "approvals",
        icon: "✅",
        label: "Approvals",
        path: "/admin/approvals",
      },
    ],
  },

  {
    title: "Management",
    items: [
      {
        id: "users",
        icon: "👥",
        label: "Users",
        path: "/admin/users",
      },
      {
        id: "entrepreneurs",
        icon: "🧵",
        label: "Entrepreneurs",
        path: "/admin/entrepreneurs",
      },
      {
        id: "orders",
        icon: "📦",
        label: "All Orders",
        path: "/admin/orders",
      },
      {
        id: "categories",
        icon: "🏷️",
        label: "Categories",
        path: "/admin/categories",
      },
    ],
  },

  {
    title: "Moderation",
    items: [
      {
        id: "complaints",
        icon: "🚨",
        label: "Complaints",
        path: "/admin/complaints",
      },
      {
        id: "reviews",
        icon: "⭐",
        label: "Reviews",
        path: "/admin/reviews",
      },
    ],
  },

  {
    title: "Insights",
    items: [
      {
        id: "analytics",
        icon: "📈",
        label: "Analytics",
        path: "/admin/analytics",
      },
      {
        id: "reports",
        icon: "📄",
        label: "Reports",
        path: "/admin/reports",
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        id: "settings",
        icon: "⚙️",
        label: "Settings",
        path: "/admin/settings",
      },
      {
        id: "activity-logs",
        icon: "🗒️",
        label: "Activity Logs",
        path: "/admin/activity-logs",
      },
    ],
  },
];

export default function Admin() {
  return (
    <div className="h-screen flex flex-col bg-[var(--cream)] font-sans text-[#2C1A0E]">
      {/* MAIN */}
      <div className="flex overflow-hidden">
        <Sidebar
          sidebarProfile={sidebarProfile}
          sidebarNav={sidebarNav}
          role="Admin"
        />

        <Outlet />
      </div>
    </div>
  );
}
