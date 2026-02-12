import { useState, useRef, useEffect } from "react";
import { PiCaretDoubleRight } from "react-icons/pi";

const EmojiPicker = ({ selectedMood, setMood, top }) => {
  const emojiList = [
    { name: "happy", emoji: "😄" },
    { name: "content", emoji: "😊" },
    { name: "neutral", emoji: "😐" },
    { name: "tired", emoji: "😫" },
    { name: "sick", emoji: "🤮" },
    { name: "sad", emoji: "😔" },
    { name: "angry", emoji: "😠" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("😊");
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!selectedMood) return;

    const found = emojiList.find((e) => e.name === selectedMood);
    if (found) {
      setCurrentEmoji(found.emoji);
    }
  }, [selectedMood]);

  const emojiSelected = (name) => {
    setIsDropdownOpen(false);
    setMood(name);
    const found = emojiList.find((e) => e.name === name);
    if (found) {
      setCurrentEmoji(found.emoji);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <span className="text-xl">{currentEmoji}</span>

        <PiCaretDoubleRight
          className="cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          size={20}
        />
      </div>

      {isDropdownOpen && (
        <div
          ref={pickerRef}
          className={`flex flex-col gap-3 bg-cards-bg py-4 px-3 shadow-lg absolute top-${top} rounded-lg z-[999]`}
        >
          <div className="flex justify-between">
            <div className="text-sm">Select Mood</div>
            <div
              className="cursor-pointer"
              onClick={() => setIsDropdownOpen(false)}
            >
              x
            </div>
          </div>

          <div className="flex">
            {emojiList.map(({ name, emoji }) => (
              <div
                key={name}
                className="flex hover:bg-secondary p-2 cursor-pointer text-xl"
                onClick={() => emojiSelected(name)}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default EmojiPicker;
