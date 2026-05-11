import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useLogout } from "../hooks/Auth/useLogout";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="sticky top-0 z-10 w-full
                 bg-[rgba(250,245,237,0.92)]
                 backdrop-blur-[12px]
                 border-b border-[rgba(196,99,42,0.12)]"
    >
      <div className="flex items-center justify-between px-10 max-md:px-6 py-4">
        {/* Logo */}
        <Link
          to={"/home"}
          className="font-playfair font-black text-2xl tracking-tight text-[var(--clay)]"
        >
          Hunar<span className="text-[var(--ink)]">Hub</span>
        </Link>

        {/* Desktop */}
        {user ? (
          <div className="hidden md:flex items-center gap-3">
            <button className="w-fit h-9 border text-xs px-3 border-[rgba(196,99,42,0.12)] rounded-full bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer">
              📍 Hazratganj, Lucknow
            </button>
            <button className="w-9 h-9 border border-[rgba(196,99,42,0.12)] rounded-lg  bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer">
              🔔
            </button>

            <Link
              to={"/user/chat"}
              state={{ openList: true }}
              className="w-9 h-9 flex items-center justify-center  border border-[rgba(196,99,42,0.12)] rounded-lg  bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer"
            >
              💬
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 bg-[var(--clay-dark)] text-white font-bold rounded-lg cursor-pointer"
              >
                {user.name[0]}
              </button>

              {profileOpen && (
                <div className="flex flex-col gap-1 absolute top-10 right-0 rounded-2xl border border-[rgba(196,99,42,0.12)] bg-white text-[var(--earth)] p-3">
                  <Link
                    to={"/user/profile"}
                    onClick={() => setProfileOpen(false)}
                    className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to={"/user/orders"}
                    onClick={() => setProfileOpen(false)}
                    className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    📦 My Orders
                  </Link>
                  <Link
                    to={"/user/wishlist"}
                    onClick={() => setProfileOpen(false)}
                    className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    ❤️ Wishlist
                  </Link>
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    ⚙️ Settings
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
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
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={"/auth"}
              className="px-5 py-2 border border-[var(--clay)]
                       rounded-md text-sm font-medium
                       text-[var(--clay)] transition
                       hover:bg-[var(--clay)] hover:text-white cursor-pointer"
            >
              Log in
            </Link>

            <Link
              to={"/auth"}
              state={{ page: "signup" }}
              className="px-5 py-2 rounded-md text-sm font-semibold
                       text-white bg-[var(--clay)]
                       shadow-[0_4px_14px_rgba(196,99,42,0.35)]
                       transition hover:bg-[var(--clay-dark)] cursor-pointer"
            >
              Join Free
            </Link>
          </div>
        )}

        {/* Mobile Toggle */}
        <div className="md:hidden flex gap-5 items-center justify-center">
          {user && (
            <Link
              to={"/user/chat"}
              onClick={() => setMobileOpen(false)}
              state={{ openList: true }}
              className="w-9 h-9 flex items-center justify-center  border border-[rgba(196,99,42,0.12)] rounded-lg  bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer"
            >
              💬
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-2xl cursor-pointer text-[var(--clay)]"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden relative">
          {user ? (
            <div className="absolute top-0 left-0 border-y border-[rgba(196,99,42,0.12)] bg-[rgba(250,245,237,0.97)] py-4 px-2 flex flex-col gap-2 w-full">
              <Link
                to={"/user/profile"}
                onClick={() => setMobileOpen(false)}
                className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer text-left"
              >
                👤 My Profile
              </Link>
              <Link
                to={"/user/orders"}
                onClick={() => setMobileOpen(false)}
                className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer text-left"
              >
                📦 My Orders
              </Link>
              <Link
                to={"/user/wishlist"}
                onClick={() => setMobileOpen(false)}
                className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer text-left"
              >
                ❤️ Wishlist
              </Link>
              <span className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer text-left">
                ⚙️ Settings
              </span>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
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
          ) : (
            <div className="absolute top-0 left-0 border-y border-[rgba(196,99,42,0.12)] bg-[rgba(250,245,237,0.97)] px-6 py-4 flex flex-col gap-4 w-full">
              <Link
                to={"/auth"}
                className="w-full px-4 py-2 border border-[var(--clay)] rounded-md text-sm font-medium text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white"
              >
                Log in
              </Link>

              <Link
                to={"/auth"}
                state={{ page: "signup" }}
                className="w-full px-4 py-2 rounded-md text-sm font-semibold text-white bg-[var(--clay)] shadow-[0_4px_14px_rgba(196,99,42,0.35)] hover:bg-[var(--clay-dark)]"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
