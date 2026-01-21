import { useState } from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { PiSidebarSimpleDuotone } from "react-icons/pi";
import { HiHome } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";
import { BsFileBarGraph } from "react-icons/bs";
import { FaCookieBite } from "react-icons/fa6";
import { AiOutlineSetting } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

const SideBar = ({ setLoggingOut }) => {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem("currentPage") || "dashboard",
  );
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const optionSelected = (option) => {
    if (option !== "logout") {
      setSelectedPage(option);
      localStorage.setItem("currentPage", option);
      closeSidebar();
      navigate(`/${option}`);
    } else {
      setLoggingOut(true);
    }
  };

  return (
    <div
      className="fixed left-0 top-0 h-full md:w-1/4 w-full
    bg-sidebar-bg backdrop-blur-md border-r dark:border-white/20 border-zinc-300 dark:bg-[#242424] dark:text-gray-100 text-zinc-600
    flex flex-col justify-start gap-12 p-2 z-9999"
    >
      <button
        className="self-end p-2 right-0 top-0 text-gray-400 dark:hover:text-white hover:brightness-90 hover:bg-secondary focus:outline-none cursor-pointer rounded"
        onClick={(e) => {
          isSidebarOpen && closeSidebar();
          e.stopPropagation();
        }}
      >
        <PiSidebarSimpleDuotone size={24} />
      </button>
      <div className="flex justify-center items-center bg-sidebar-bg mx-8">
        <ul className="flex flex-col justify-around h-full gap-6">
          <li
            onClick={(e) => {
              optionSelected("dashboard");
              e.stopPropagation();
            }}
            className={`p-3 sidebar-btn ${
              selectedPage === "dashboard" ? "bg-accent" : ""
            }`}
          >
            <HiHome />
            <span className="leading-none">Dashboard</span>
          </li>
          <li
            onClick={(e) => {
              optionSelected("create-log");
              e.stopPropagation();
            }}
            className={`p-3 sidebar-btn ${
              selectedPage === "create-log" ? "bg-accent" : ""
            }`}
          >
            <FaPlus />
            <span className="leading-none">Create Log</span>
          </li>
          {/* <li
            onClick={() => setSelectedPage("dashboard")}
            className="text-gray-300 hover:text-white focus:outline-none cursor-pointer"
          >
            Calendar
          </li> */}
          <li
            onClick={(e) => {
              optionSelected("insights");
              e.stopPropagation();
            }}
            className={`p-3 sidebar-btn ${
              selectedPage === "insights" ? "bg-accent" : ""
            }`}
          >
            <BsFileBarGraph />
            <span className="leading-none">Insights</span>
          </li>
          <li
            onClick={(e) => {
              optionSelected("recipes");
              e.stopPropagation();
            }}
            className={`p-3 sidebar-btn ${
              selectedPage === "recipes" ? "bg-accent" : ""
            }`}
          >
            <FaCookieBite />
            <span className="leading-none">Recipes</span>
          </li>
          <li
            onClick={(e) => {
              optionSelected("settings");
              e.stopPropagation();
            }}
            className={`p-3 sidebar-btn ${
              selectedPage === "settings" ? "bg-accent" : ""
            }`}
          >
            <AiOutlineSetting />
            <span className="leading-none">Settings</span>
          </li>
          <li
            onClick={(e) => {
              optionSelected("logout");
              e.stopPropagation();
            }}
            className={`p-3 sidebar-btn ${
              selectedPage === "settings" ? "bg-accent" : ""
            }`}
          >
            <MdLogout />
            <span className="leading-none">Logout</span>
          </li>
          <li className="dark:text-gray-100 mt-8">Tip</li>
          <li className="dark:text-gray-100">
            Click on <i>Create Log</i> to quickly add a new meal.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
