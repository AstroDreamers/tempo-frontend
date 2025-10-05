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
    <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between h-9">
        <div className="flex items-center gap-5">
          <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-widest font-mono">ASTRO DREAMERS</span>
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`transition-all duration-150 px-2 py-0.5 rounded-md font-medium text-gray-700 text-sm hover:bg-indigo-50 hover:text-indigo-700 hover:scale-110 ${location.pathname === item.path ? 'bg-indigo-100 text-indigo-700' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          {user ? <UserIcon username={user.username} /> : null}
          {user ? (
            <button
              onClick={handleLogout}
              className="transition-all duration-150 px-3 py-1 rounded-md font-medium text-sm text-white bg-red-500 hover:bg-red-600 shadow-md hover:scale-110 hover:text-base ml-4"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="transition-all duration-150 px-4 py-1.5 rounded-md font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:scale-110 hover:text-base ml-2"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>
  {showSpacer && (
    location.pathname === '/map'
      ? <div className="h-2" />
      : <div className="h-2" />
  )} {/* Spacer for fixed header only on main pages */}
    </header>
  );
}
