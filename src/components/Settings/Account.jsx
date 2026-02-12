import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { getLocalDateStringVerbose } from "../../utils/date";
import { IoKeySharp } from "react-icons/io5";

const Account = ({ email, createdAt }) => {
  const [settingClicked, setSettingClicked] = useState(false);
  const [passwordSettingClicked, setPasswordSettingClicked] = useState(false);
  const { api } = useAuth();

  const updateAccount = (newEmail, newPassword) => {
    if (
      (newEmail && newEmail !== email) ||
      (newPassword && newPassword.length > 0)
    ) {
      api
        .patch(`${import.meta.env.VITE_BE_URL}/update-account-details`, {
          newEmail,
          newPassword,
        })
        .then((response) => {
          toast.success("Email changed successfully!");
        })
        .catch((error) => {
          console.error("Error changing email:", error);
          toast.error("Failed to change email. Please try again.");
        });
    } else {
      toast.info("Please enter a different email address.");
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Account Info</h2>

        <div
          className={`bg-color-secondary border-1 border-zinc-600 p-3 rounded-lg flex justify-between items-center cursor-pointer ${settingClicked ? "" : "mb-4"}`}
          onClick={() => {
            setSettingClicked((prev) => !prev);
          }}
        >
          <div className="flex flex-col">
            <div className="text-md font-semibold">Email</div>
            <div className="text-sm text-secondary my-1">
              You can change your email address associated with your account.
            </div>
            <span className="mr-4 dark:text-gray-300 text-text">{email}</span>
          </div>
          {settingClicked ? (
            <MdOutlineKeyboardArrowUp size={35} />
          ) : (
            <MdOutlineKeyboardArrowRight size={35} />
          )}
        </div>
        {settingClicked && (
          <div className="bg-color-secondary p-2 rounded-lg text-text flex justify-between mb-4">
            <input
              type="email"
              id="newEmail"
              className="w-2/3 px-3 py-2 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent h-10"
              placeholder="Enter your new email"
            />
            <button
              className="px-4 py-2 bg-accent rounded-md hover:brightness-75 cursor-pointer"
              onClick={() => {
                const newEmail = document.getElementById("newEmail").value;
                if (newEmail.length === 0) {
                  toast.info("Please enter a new email address.");
                  return;
                }
                setSettingClicked(false);
                updateAccount(newEmail, null);
              }}
            >
              Save New Email
            </button>
          </div>
        )}
      </div>
      <div className="text-md font-semibold">
        <span>Account Created on &emsp;</span>
        <span className="text-xl text-zinc-400">
          {createdAt ? getLocalDateStringVerbose(createdAt) : "N/A"}
        </span>
        <hr className="text-zinc-600 my-2" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Security</h2>
        <div
          className={`bg-color-secondary border-1 border-zinc-600 p-2 rounded-lg flex justify-between items-center cursor-pointer ${passwordSettingClicked ? "" : "mb-4"}`}
          onClick={() => setPasswordSettingClicked((prev) => !prev)}
        >
          <div className="flex">
            <IoKeySharp size={20} className="mr-2 mt-1" />
            <div className="flex flex-col">
              <div className="text-md font-semibold">Change Password</div>
            </div>
          </div>
          {passwordSettingClicked ? (
            <MdOutlineKeyboardArrowUp size={35} />
          ) : (
            <MdOutlineKeyboardArrowRight size={35} />
          )}
        </div>
        {passwordSettingClicked && (
          <div className="bg-color-secondary p-2 rounded-lg text-text flex justify-between">
            <input
              type="password"
              id="newPassword"
              className="w-2/3 px-3 py-2 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent h-10"
              placeholder="Enter your new password"
            />
            <button
              className="px-4 py-2 bg-accent rounded-md hover:brightness-75 cursor-pointer"
              onClick={() => {
                const newPassword =
                  document.getElementById("newPassword").value;
                if (newPassword.length === 0) {
                  toast.info("Please enter a new password.");
                  return;
                }
                setPasswordSettingClicked(false);
                updateAccount(null, newPassword);
              }}
            >
              Save New Password
            </button>
          </div>
        )}
      </div>
      <div className="border-4 border-[#8d3b4e] rounded-lg p-4">
        <span className="text-red-500 font-semibold">Warning:</span>
        <span className="text-text ml-2 text-sm">
          Changing your email or password will log you out of all active
          sessions. You will need to log in again with your new credentials.
        </span>
      </div>
      {/*Future feature: Delete Account, Export Data, two-factor authentication, logout of all sessions */}
    </div>
  );
};

export default Account;
