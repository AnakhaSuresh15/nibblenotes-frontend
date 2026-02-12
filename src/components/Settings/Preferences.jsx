import { TiTick } from "react-icons/ti";
import { useState, useEffect, useMemo } from "react";
import EmojiPicker from "../EmojiPicker";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const Preferences = () => {
  const { api } = useAuth();

  const [selectedTheme, setSelectedTheme] = useState("system");
  const [defaultMoodBefore, setDefaultMoodBefore] = useState("content");
  const [defaultMoodAfter, setDefaultMoodAfter] = useState("content");
  const [defaultServingSize, setDefaultServingSize] = useState("");

  const [initialPreferences, setInitialPreferences] = useState(null);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const effectiveTheme = prefersDark ? "dark" : "light";
      root.classList.add(effectiveTheme);
      root.setAttribute("data-theme", effectiveTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute("data-theme", theme);
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem("theme-preference", theme);
    applyTheme(theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference") || "system";

    const savedPreferences = {
      themePreference: savedTheme,
      defaultMoodBefore: "content",
      defaultMoodAfter: "content",
      defaultServingSize: "",
    };

    setSelectedTheme(savedPreferences.themePreference);
    setDefaultMoodBefore(savedPreferences.defaultMoodBefore);
    setDefaultMoodAfter(savedPreferences.defaultMoodAfter);
    setDefaultServingSize(savedPreferences.defaultServingSize);

    setInitialPreferences(savedPreferences);

    applyTheme(savedPreferences.themePreference);
  }, []);

  // ---------- DIFF LOGIC ----------
  const changedPreferences = useMemo(() => {
    if (!initialPreferences) return null;

    const changes = {};

    if (selectedTheme !== initialPreferences.themePreference) {
      changes.themePreference = selectedTheme;
    }

    if (defaultMoodBefore !== initialPreferences.defaultMoodBefore) {
      changes.defaultMoodBefore = defaultMoodBefore;
    }

    if (defaultMoodAfter !== initialPreferences.defaultMoodAfter) {
      changes.defaultMoodAfter = defaultMoodAfter;
    }

    if (defaultServingSize !== initialPreferences.defaultServingSize) {
      changes.defaultServingSize = defaultServingSize;
    }

    return Object.keys(changes).length > 0 ? changes : null;
  }, [
    selectedTheme,
    defaultMoodBefore,
    defaultMoodAfter,
    defaultServingSize,
    initialPreferences,
  ]);

  // ---------- SAVE ----------
  const handleSavePreferences = async () => {
    if (!changedPreferences) {
      toast.info("No changes to save.");
      return;
    }

    try {
      await api.patch(
        `${import.meta.env.VITE_BE_URL}/common/preferences`,
        changedPreferences,
      );

      toast.success("Preferences saved successfully!");

      setInitialPreferences((prev) => ({
        ...prev,
        ...changedPreferences,
      }));
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <span className="text-lg font-semibold">🌗 Theme</span>
      <div className="flex gap-4">
        {["system", "light", "dark"].map((theme) => (
          <button
            key={theme}
            className={`py-3 px-6 flex-1 rounded-lg border border-zinc-600 transition cursor-pointer
              ${selectedTheme === theme ? "bg-accent border-0" : ""}`}
            onClick={() => handleThemeChange(theme)}
          >
            {selectedTheme === theme && (
              <TiTick className="inline mr-2" size={20} />
            )}
            {theme === "system"
              ? "System Default"
              : theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-color-secondary">
          <span className="font-semibold">Default mood before</span>
          <EmojiPicker
            selectedMood={defaultMoodBefore}
            setMood={setDefaultMoodBefore}
          />
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-lg bg-color-secondary">
          <span className="font-semibold">Default mood after</span>
          <EmojiPicker
            selectedMood={defaultMoodAfter}
            setMood={setDefaultMoodAfter}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold">🍽️ Default serving size</span>
        <input
          type="number"
          min="1"
          className="p-2 rounded-lg border border-zinc-600 w-24 bg-transparent"
          value={defaultServingSize}
          onChange={(e) => setDefaultServingSize(e.target.value)}
        />
      </div>

      <button
        disabled={!changedPreferences}
        className={`self-center mt-8 px-6 py-2 rounded-lg transition
          ${
            changedPreferences
              ? "bg-accent hover:bg-accent-secondary cursor-pointer"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        onClick={handleSavePreferences}
      >
        Save Preferences
      </button>
    </div>
  );
};

export default Preferences;
