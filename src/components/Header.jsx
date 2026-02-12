// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { AiFillSun, AiFillMoon } from "react-icons/ai";
import SideBar from "./SideBar";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { PiBowlFoodFill } from "react-icons/pi";
import { BiMenu } from "react-icons/bi";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";

const THEME_KEY = "theme-preference"; // values: "light" | "dark" | "system"

const Header = () => {
  const { isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  // determine initial theme: stored preference -> system -> light
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system")
      return stored;
    return "system";
  };

  const [themePref, setThemePref] = useState(getInitialTheme);

  // helper to resolve actual theme (light|dark) from pref
  const resolveTheme = (pref) => {
    if (pref === "light" || pref === "dark") return pref;
    // system
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  // Apply theme attribute whenever resolved theme or pref changes
  useEffect(() => {
    const applied = resolveTheme(themePref);
    // use data-theme attribute on <html>
    document.documentElement.setAttribute("data-theme", applied);
    // persist only explicit choices (light/dark/system)
    localStorage.setItem(THEME_KEY, themePref);
  }, [themePref]);

  // If user is following system ("system" pref), react to system changes at runtime.
  useEffect(() => {
    if (themePref !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const newResolved = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newResolved);
    };

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, [themePref]);

  // Toggle explicitly between light <-> dark and set explicit preference
  const toggleTheme = () => {
    setThemePref((prev) => {
      // If currently system, compute resolved then toggle
      const resolved = resolveTheme(prev);
      const next = resolved === "dark" ? "light" : "dark";
      return next; // user explicitly chose next theme
    });
  };

  // Optionally: function to reset to system follow
  const followSystem = () => setThemePref("system");

  // For display icon (reflect resolved theme)
  const resolved = resolveTheme(themePref);

  return (
    <header className="shrink-0 bg-[color:var(--color-primary)] border-b dark:border-white/10 border-zinc-200 flex items-center px-6 justify-between text-zinc-700 dark:text-white w-full py-4 fixed top-0 z-50">
      <div
        className="group flex flex-row gap-4 items-center"
        onClick={() => {
          openSidebar();
        }}
      >
        {!isSidebarOpen && user && (
          <button
            className="focus:outline-none group cursor-pointer top-2 left-2"
            aria-label="Toggle sidebar"
          >
            <PiBowlFoodFill
              size={24}
              className="block group-hover:hidden transition-all duration-200"
            />
            <BiMenu
              size={24}
              className="hidden group-hover:block transition-all duration-200"
            />
          </button>
        )}

        {isSidebarOpen && (
          <SideBar isLoggingOut={loggingOut} setLoggingOut={setLoggingOut} />
        )}

        <h1
          className="text-xl font-semibold dark:text-gray-100 leading-none cursor-pointer"
          onClick={() => {
            navigate("/dashboard");
            localStorage.setItem("currentPage", "dashboard");
          }}
        >
          NibbleNotes
        </h1>
      </div>

      {/* Upcoming search feature
      {!isMobile && user && (
        <input
          type="text"
          value={name}
          className="dark:text-white/80 min-w-[35%] rounded-lg leading-none border border-zinc-400 dark:border-0 p-1.5 bg-transparent placeholder:opacity-70"
          onChange={(e) => setName(e.target.value)}
          placeholder="🔍︎ Search..."
          aria-label="Search"
        />
      )} */}

      <div className="flex items-center gap-2">
        {/* Optional: small 'follow system' button */}
        {/* <button onClick={followSystem} className="text-sm px-2 py-1">System</button> */}

        <button
          onClick={toggleTheme}
          aria-label={
            resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={
            resolved === "dark" ? "Switch to Light mode" : "Switch to Dark mode"
          }
          className="p-1 rounded"
        >
          {resolved === "dark" ? (
            <AiFillSun size={24} className="text-text cursor-pointer" />
          ) : (
            <AiFillMoon size={24} className="text-text cursor-pointer" />
          )}
        </button>
      </div>
      <ConfirmationDialog
        isOpen={loggingOut}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={() => {
          logout();
          setLoggingOut(false);
          closeSidebar();
        }}
        onCancel={() => {
          setLoggingOut(false);
        }}
      />
    </header>
  );
};

export default Header;
