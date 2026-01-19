import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { capitalizeFirst } from "../../utils/string";

const MealDistributionCard = ({ mealDistribution }) => {
  const COLORS = ["#FACC15", "#8a41f5", "#FB923C"];

  const distribution = mealDistribution
    ? Object.keys(mealDistribution).map((key) => ({
        name: key,
        value: mealDistribution[key],
      }))
    : [];

  return (
    <div className="card md:w-1/2 w-full p-6 rounded-3xl flex flex-col justify-around">
      <span className="pl-15 pb-4">Meals Distribution</span>
      {mealDistribution === null || distribution.length === 0 ? (
        <div className="text-center text-gray-500">No data available</div>
      ) : null}
      <div className="flex md:flex-row flex-col items-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={distribution}
              dataKey="value"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={3}
            >
              {distribution.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col justify-around">
          {distribution.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span>{capitalizeFirst(entry.name)}</span>
              <span>
                {(
                  (entry.value /
                    distribution.reduce((acc, curr) => acc + curr.value, 0)) *
                  100
                ).toFixed(2)}
                %
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealDistributionCard;
