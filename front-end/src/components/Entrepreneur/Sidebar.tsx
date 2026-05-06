import { useLogout } from "../../hooks/Auth/useLogout";
import type { SidebarNavSection } from "../../pages/Entrepreneur";
import { useAuthStore } from "../../stores/authStore";
import { useSideBar } from "../../stores/sideBarStore";
import NavItem from "./NavItem";

type SidebarProps = {
  sidebarNav: SidebarNavSection[];
};

export default function Sidebar({ sidebarNav }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const open = useSideBar((state) => state.open);
  const logoutMutation = useLogout();
  const setOpen = useSideBar((state) => state.setOpen);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <div
        onClick={() => setOpen()}
        className={`${open ? "w-full" : "w-0"} bg-transparent fixed max-md:z-10 backdrop-blur-sm h-full hidden max-md:flex transform transition-all duration-200`}
      />
      <aside
        className={`${open ? "w-72" : "w-0 max-md:-translate-x-52"} max-md:z-20 max-md:fixed overflow-hidden bg-[#2C1A0E] text-white flex flex-col h-screen transform transition-all duration-200`}
      >
        {/* TOP */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex flex-col text-2xl font-black mb-6">
            <span>
              Hunar<span className="text-[var(--clay)]">Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] px-2.5 py-3 rounded-2xl">
            <div className="w-11 h-11 rounded-xl bg-[#C4632A] flex items-center justify-center text-lg">
              🧑‍💼
            </div>

            <div>
              <div className="font-semibold leading-tight">{user?.name}</div>
              <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.4)]">
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
          style={{ scrollbarWidth: "none" }}
        >
          {/* MAIN */}

          {sidebarNav.map((item) => (
            <div key={item.title}>
              <div className="px-3 mb-2 text-[10px] uppercase tracking-wide text-white/40">
                {item.title}
              </div>

              <div className="space-y-1">
                {item.items.map((item) => (
                  <NavItem
                    key={item.id}
                    id={item.id}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    path={item.path}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/10 rounded-lg w-full transition cursor-pointer disabled:opacity-50"
          >
            <span className="text-lg">🚪</span>
            {logoutMutation.isPending ? (
              <>
                <span className="flex items-center justify-center w-10">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                </span>
              </>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
