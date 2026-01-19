import { PiCaretDoubleRight } from "react-icons/pi";
import { useState } from "react";
import { physical } from "../../constants/physicalFeedback";

const PhysicalSection = ({
  physicalSelections,
  setPhysicalSelections,
  editLog,
}) => {
  const [isPhysicalExpanded, setIsPhysicalExpanded] = useState(
    editLog ? true : false
  );
  const expandSection = () => {
    setIsPhysicalExpanded((prev) => !prev);
  };
  const handlePhysicalSelection = (id) => {
    setPhysicalSelections((prevSelections) => {
      if (prevSelections.includes(id)) {
        return prevSelections.filter((selection) => selection !== id);
      } else {
        return [...prevSelections, id];
      }
    });
  };

  return (
    <div className="flex flex-col justify-between items-center text-lg card p-2 md:rounded-xl">
      <div
        className="flex justify-between items-center w-full cursor-pointer"
        onClick={() => {
          expandSection("physical");
        }}
      >
        <span>Physical Feedback</span>
        <PiCaretDoubleRight size={20} />
      </div>
      {isPhysicalExpanded && (
        <div className="flex flex-col w-full mt-4 gap-4">
          <div className="flex flex-col text-sm">
            <label className="italic">
              How did your body feel after this meal?
            </label>
            <label className="pt-2">
              After eating, I felt (Select ones that occurred):
            </label>
            <div className="bg-color-secondary rounded-sm mt-2 p-2">
              <div className="mt-2 flex flex-wrap gap-2">
                {physical.map((item) => (
                  <span
                    key={item.id}
                    className="bg-accent text-text px-2 py-1 rounded-full text-xs cursor-pointer"
                    onClick={() => {
                      handlePhysicalSelection(item.id);
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="my-2">
              {physicalSelections.length > 0 && (
                <span className="flex flex-wrap gap-2">
                  Selected:{" "}
                  {physicalSelections.map((id) => {
                    const item = physical.find((i) => i.id === id);
                    return (
                      <span
                        className="bg-accent-secondary text-text px-2 py-1 rounded-full text-xs whitespace-nowrap"
                        key={id}
                      >
                        {item ? item.name : ""}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalSection;
