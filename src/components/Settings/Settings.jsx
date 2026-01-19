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

const Settings = () => {
  const { isSidebarOpen } = useSidebar();
  const [selected, setSelected] = useState("profile");
  const { api } = useAuth();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BE_URL}/settings`
        );
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 ${
        isSidebarOpen ? "w-3/4 ml-[25%] px-16" : "w-full ml-0 md:px-24 px-6"
      } py-9 flex flex-col text-text`}
    >
      <span className="text-2xl text-center mb-4">Settings</span>
      <div className="flex h-11/12 gap-4">
        <div className="card basis-1/3 md:p-6 p-3 md:rounded-3xl flex flex-col gap-6">
          <span
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              setSelected("profile");
            }}
          >
            <FaUser /> Profile
          </span>
          <span
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              setSelected("preferences");
            }}
          >
            <MdSettingsInputComposite /> Preferences
          </span>
          <span
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              setSelected("account");
            }}
          >
            <FaLock /> Account
          </span>
          <span
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              setSelected("notifications");
            }}
          >
            <IoMdNotifications /> Notifications
          </span>
        </div>
        <div className="card basis-2/3 md:p-6 p-3 md:rounded-3xl flex flex-col gap-6">
          {selected === "profile" && <Profile settings={settings} />}
          {selected === "preferences" && <Preferences />}
          {selected === "account" && <Account />}
          {selected === "notifications" && <Notifications />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
