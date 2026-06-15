import { Outlet } from "react-router-dom";
import type { SidebarNavSection } from "./Entrepreneur";
import Sidebar from "../components/Entrepreneur/Sidebar";
import { useSideBar } from "../stores/sideBarStore";
import { SidebarIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import SEO from "../components/Shared/SEO";

const sidebarNav: SidebarNavSection[] = [
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
        id: "bookings",
        icon: "📦",
        label: "All Bookings",
        path: "/admin/bookings",
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
    title: "System",
    items: [
      {
        id: "settings",
        icon: "⚙️",
        label: "Settings",
        path: "/admin/settings",
      },
    ],
  },
];

export default function Admin() {
  const setOpen = useSideBar((state) => state.setOpen);
  const init = useSideBar((state) => state.init);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    init(!isMobile);
  }, [isMobile, init]);

  return (
    <>
      <SEO
        title="Admin Dashboard"
        description="Administration panel."
        noIndex
      />
      <div className="h-screen flex flex-col bg-[var(--cream)] font-sans text-[#2C1A0E]">
        {/* MAIN */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar sidebarNav={sidebarNav} />

          <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#FAF5ED]">
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
    </>
  );
}
