import userImage from "../../assets/user-default.jpg";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import Loader from "../Loader";

const Profile = ({ settings }) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    name: settings?.name || "",
    email: settings?.email || "",
  });
  const [showFutureFeature, setShowFutureFeature] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSaveChanges = async () => {
    setLoading(true);
    try {
      await api.post(`${import.meta.env.VITE_BE_URL}/common/update-settings`, {
        name: formData.name,
        email: formData.email,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Error saving user settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || "",
        email: settings.email || "",
      });
    }
  }, [settings]);

  return (
    <div className="flex flex-col">
      {loading && <Loader />}
      {isMobile && <span className="text-xl font-semibold">Profile</span>}
      <div className="flex md:flex-row flex-col gap-8 mt-4 justify-center items-center">
        <div className="flex flex-col gap-2">
          <img
            src={userImage}
            alt="User"
            className="w-25 h-25 rounded-full self-center"
          />
          <button
            className="cursor-pointer p-2 bg-accent rounded-xl text-primary hover:opacity-90 transition-opacity duration-200"
            onClick={() => {
              setShowFutureFeature(true);
            }}
          >
            Change Avatar
          </button>
          {showFutureFeature && (
            <span className="text-sm text-gray-400 mt-1">
              (Feature coming soon)
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4 justify-center md:w-3/4 w-11/12">
          <div className="flex flex-col">
            <span className="font-medium">Name</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
      <button
        className="self-center mt-9 p-2 bg-accent rounded-xl text-primary hover:opacity-90 transition-opacity duration-200 cursor-pointer"
        onClick={(e) => {
          onSaveChanges();
          e.preventDefault();
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default Profile;
