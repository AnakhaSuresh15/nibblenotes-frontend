import { tags } from "../../constants/tags";
import { physical } from "../../constants/physicalFeedback";

const TITLE_MAP = {
  tags: "Top Tags",
  meals: "Most Logged Meals",
  feedback: "Top Physical Feedback",
};

const VALUE_KEY_MAP = {
  tags: "tag",
  meals: "meal",
  feedback: "feedback",
};

const TAG_MAP = tags.reduce((acc, tag) => {
  acc[tag.id] = tag.name;
  return acc;
}, {});

const FEEDBACK_MAP = physical.reduce((acc, feedback) => {
  acc[feedback.id] = feedback.name;
  return acc;
}, {});

const TopData = ({ data = [], type }) => {
  const title = TITLE_MAP[type] ?? "Top Data";
  const valueKey = VALUE_KEY_MAP[type];

  return (
    <div className="card w-full md:w-1/3 p-6 rounded-3xl flex flex-col">
      <span className="pb-4 font-semibold">{title}</span>

      <ul className="space-y-2">
        {data.length > 0 ? (
          data.map((item) => (
            <li
              key={`${type}-${item[valueKey]}`}
              className="dark:text-white/70 flex justify-between"
            >
              <span>
                {type === "tags"
                  ? TAG_MAP[item[valueKey]] ?? item[valueKey]
                  : type === "feedback"
                  ? FEEDBACK_MAP[item[valueKey]] ?? item[valueKey]
                  : item[valueKey]}
              </span>
              {type === "tags" && (
                <span className="bg-accent rounded-2xl"></span>
              )}
              <span>
                {" "}
                {item.count}{" "}
                {type === "meals" && (
                  <span className="font-semibold"> times</span>
                )}
              </span>
            </li>
          ))
        ) : (
          <li className="dark:text-white/70">No data available</li>
        )}
      </ul>
    </div>
  );
};

export default TopData;
