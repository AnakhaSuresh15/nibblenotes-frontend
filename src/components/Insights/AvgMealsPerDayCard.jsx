import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const AvgMealsPerDayCard = ({ avgMealsPerDay, mealsPerDay, fromDashboard }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`card md:w-1/4 w-full p-6 rounded-3xl flex flex-col justify-around ${
        fromDashboard ? "md:w-full" : ""
      }`}
    >
      <div className="flex justify-between">
        <span>Avg Meals / Day</span>
        {fromDashboard && (
          <button
            className="cursor-pointer bg-accent text-text px-3 py-1 rounded-md text-sm"
            onClick={() => {
              navigate("/insights");
            }}
          >
            Go to Insights
          </button>
        )}
      </div>
      {avgMealsPerDay === null || (mealsPerDay && mealsPerDay.length === 0) ? (
        <div className="text-center text-gray-500">No data available</div>
      ) : null}
      <div className="text-3xl font-semibold">{avgMealsPerDay}</div>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={mealsPerDay}>
          <Line
            type="monotone"
            dataKey="count"
            stroke="#A78BFA"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AvgMealsPerDayCard;
