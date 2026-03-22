import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore(state=>state.accessToken);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 w-full
                 bg-[rgba(250,245,237,0.92)]
                 backdrop-blur-[12px]
                 border-b border-[rgba(196,99,42,0.12)]"
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-4">
        {/* Logo */}
        <h1 className="font-playfair font-black text-2xl tracking-tight text-[var(--clay)]">
          Hunar<span className="text-[var(--ink)]">Hub</span>
        </h1>

        {/* Desktop */}
        {user ? (
          <div className="hidden md:flex items-center gap-3">
            <button className="w-fit h-9 border text-xs px-3 border-[rgba(196,99,42,0.12)] rounded-full bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer">
              📍 Hazratganj, Lucknow
            </button>
            <button className="w-9 h-9 border border-[rgba(196,99,42,0.12)] rounded-lg  bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer">
              🔔
            </button>

            <button className="w-9 h-9 border border-[rgba(196,99,42,0.12)] rounded-lg  bg-[var(--white)] hover:border-[var(--clay)] cursor-pointer">
              💬
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 bg-[var(--clay-dark)] rounded-lg cursor-pointer"
              >
                👩
              </button>

              {profileOpen && (
                <div className="flex flex-col gap-1 absolute top-10 right-0 rounded-2xl border border-[rgba(196,99,42,0.12)] bg-white text-[var(--earth)] p-3">
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    👤 My Profile
                  </span>
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    📦 My Orders
                  </span>
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    ❤️ Wishlist
                  </span>
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    🏆 Loyalty Points
                  </span>
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    ⚙️ Settings
                  </span>
                  <span className="whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer">
                    🚪 Sign Out
                  </span>
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

            <button
              className="px-5 py-2 rounded-md text-sm font-semibold
                       text-white bg-[var(--clay)]
                       shadow-[0_4px_14px_rgba(196,99,42,0.35)]
                       transition hover:bg-[var(--clay-dark)] cursor-pointer"
            >
              Join Free
            </button>
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl text-[var(--clay)]"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[rgba(196,99,42,0.12)]
                     bg-[rgba(250,245,237,0.97)] px-6 py-4"
        >
          {user ? (
            <div className="flex flex-col gap-3 text-[var(--earth)]">
              <span className="hover:text-[var(--clay)] cursor-pointer">
                👤 My Profile
              </span>
              <span className="hover:text-[var(--clay)] cursor-pointer">
                📦 My Orders
              </span>
              <span className="hover:text-[var(--clay)] cursor-pointer">
                ❤️ Wishlist
              </span>
              <span className="hover:text-[var(--clay)] cursor-pointer">
                🏆 Loyalty Points
              </span>
              <span className="hover:text-[var(--clay)] cursor-pointer">
                ⚙️ Settings
              </span>
              <span className="hover:text-[var(--clay)] cursor-pointer">
                🚪 Sign Out
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button className="w-full px-4 py-2 border border-[var(--clay)] rounded-md text-sm font-medium text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white">
                Log in
              </button>

              <button className="w-full px-4 py-2 rounded-md text-sm font-semibold text-white bg-[var(--clay)] shadow-[0_4px_14px_rgba(196,99,42,0.35)] hover:bg-[var(--clay-dark)]">
                Join Free
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}