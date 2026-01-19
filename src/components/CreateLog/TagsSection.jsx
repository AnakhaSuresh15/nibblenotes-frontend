import { useState } from "react";
import { PiCaretDoubleRight } from "react-icons/pi";
import { tags } from "../../constants/tags";

const TagsSection = ({ tagsSelections, setTagsSelections, editLog }) => {
  const [isTagsExpanded, setIsTagsExpanded] = useState(editLog ? true : false);
  const expandSection = () => {
    setIsTagsExpanded((prev) => !prev);
  };
  const handleTagsSelection = (id) => {
    setTagsSelections((prevSelections) => {
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
          expandSection("tags");
        }}
      >
        <span>Tags & Sharing</span>
        <PiCaretDoubleRight size={18} />
      </div>
      {isTagsExpanded && (
        <div className="flex flex-col w-full mt-4 gap-4">
          <div className="flex flex-col text-sm">
            <label>Add tags to help you find and group meals later:</label>
            <div className="bg-color-secondary rounded-sm mt-2 p-2">
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((item) => (
                  <span
                    key={item.id}
                    className="bg-accent text-text px-2 py-1 rounded-full text-xs cursor-pointer"
                    onClick={() => {
                      handleTagsSelection(item.id);
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="my-2">
              {tagsSelections.length > 0 && (
                <span className="flex flex-wrap gap-2">
                  Selected:{" "}
                  {tagsSelections.map((id) => {
                    const item = tags.find((i) => i.id === id);
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

export default TagsSection;
