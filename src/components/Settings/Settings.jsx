import { useSidebar } from "../../contexts/SidebarContext";
import { FaUser } from "react-icons/fa";
import { MdSettingsInputComposite } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { useState, useEffect } from "react";
import Profile from "./Profile";
import Preferences from "./Preferences";
import Account from "./Account";
import Notifications from "./Notifications";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader";
import { MdLogout } from "react-icons/md";
import { toast } from "react-toastify";

const TABS = [
  { key: "profile", label: "Profile", icon: <FaUser /> },
  {
    key: "preferences",
    label: "Preferences",
    icon: <MdSettingsInputComposite />,
  },
  { key: "account", label: "Security & Account", icon: <FaLock /> },
  { key: "notifications", label: "Notifications", icon: <IoMdNotifications /> },
  { key: "logout", label: "Logout", icon: <MdLogout /> },
];

const Settings = () => {
  const { isSidebarOpen } = useSidebar();
  const [selected, setSelected] = useState("profile");
  const { api, logout } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BE_URL}/common/settings`,
        );
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("Failed to load settings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Auto-scroll active tab into view (mobile only UX polish)
  useEffect(() => {
    const el = document.querySelector(`[data-tab="${selected}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [selected]);

  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 ${
        isSidebarOpen ? "w-3/4 ml-[25%] px-16" : "w-full ml-0 md:px-24 px-6"
      } py-9 flex flex-col text-text`}
    >
      {loading && <Loader />}
      <span className="text-2xl text-center mb-4">Settings</span>

      <div className="flex md:flex-row flex-col h-11/12 gap-4">
        {/* -------------------- TABS -------------------- */}
        <div className="card md:basis-1/3 md:p-6 p-2 md:rounded-3xl">
          <div
            className="
              flex
              flex-row md:flex-col
              gap-3
              overflow-x-auto md:overflow-visible
              snap-x snap-mandatory md:snap-none
              scrollbar-hide
            "
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                data-tab={tab.key}
                onClick={() => setSelected(tab.key)}
                className={`
                  flex items-center gap-2
                  px-4 py-2
                  whitespace-nowrap
                  snap-start md:snap-none
                  transition
                  cursor-pointer
                  ${
                    selected === tab.key ? "bg-accent-secondary rounded-xl" : ""
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* -------------------- CONTENT -------------------- */}
        <div className="card md:basis-2/3 md:p-6 p-3 md:rounded-3xl flex flex-col gap-6">
          {selected === "profile" && <Profile settings={settings} />}
          {selected === "preferences" && <Preferences />}
          {selected === "account" && (
            <Account email={settings?.email} createdAt={settings?.createdAt} />
          )}
          {selected === "notifications" && <Notifications />}
          {selected === "logout" && (
            <div className="flex flex-col items-center justify-center h-full">
              <button>
                <MdLogout size={50} className="text-accent mb-4" />
              </button>
              <span className="text-lg">Are you sure you want to logout?</span>
              <button
                className="mt-4 px-6 py-2 bg-accent text-text cursor-pointer rounded-lg hover:bg-accent-secondary transition-colors duration-200"
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
