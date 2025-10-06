import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "../api/user";

const navItems = [
  { name: "Getting Started", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Map", path: "/map" },
  { name: "Subscriptions", path: "/subscriptions" },
];

function UserIcon({ username }) {
  return (
    <div className="flex items-center gap-2 ml-4">
      <span className="inline-block w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-lg">
        {username ? username[0].toUpperCase() : "U"}
      </span>
      <span className="font-medium text-gray-700 text-sm">{username}</span>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const noSpacerRoutes = ["/login", "/signup", "/verify"];
  const showSpacer = !noSpacerRoutes.includes(location.pathname);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setUser(null);
      }
    }
    const token = localStorage.getItem("token");
    if (token) fetchUser();
    else setUser(null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="w-full bg-white/60 shadow-md fixed top-0 left-0 z-[1300]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        <div className="flex items-center gap-4">
          <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-widest font-mono">ASTRO DREAMERS</span>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-all duration-150 px-2 py-1 rounded-md font-medium text-gray-700 text-sm hover:bg-indigo-50 hover:text-indigo-700 ${location.pathname === item.path ? 'bg-indigo-100 text-indigo-700' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center">
            {user ? <UserIcon username={user.username} /> : null}
            {user ? (
              <button
                onClick={handleLogout}
                className="transition-all duration-150 px-3 py-1 rounded-md font-medium text-sm text-white bg-red-500 hover:bg-red-600 shadow-md ml-4"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="transition-all duration-150 px-3 py-1 rounded-md font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md ml-2"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md border border-transparent hover:bg-gray-100"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} onClick={() => setMobileOpen(false)} className={`block px-3 py-2 rounded-md font-medium text-gray-700 ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}>
                {item.name}
              </Link>
            ))}
            <div className="border-t mt-2 pt-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <UserIcon username={user.username} />
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-3 py-1 rounded-md bg-red-500 text-white">Log Out</button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md bg-indigo-600 text-white text-center">Log In</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {showSpacer && (
        <div className="h-2" />
      )}
    </header>
  );
}
