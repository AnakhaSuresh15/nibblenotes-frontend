import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MealsPerDayCard = ({ mealsPerDay }) => {
  return (
    <div className="card md:w-1/2 w-full p-6 rounded-3xl flex flex-col justify-around">
      <span className="pl-15 pb-4">Meals logged per day</span>
      {mealsPerDay === null || (mealsPerDay && mealsPerDay.length === 0) ? (
        <div className="text-center text-gray-500">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mealsPerDay}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="count"
              radius={[5, 5, 0, 0]}
              fill="var(--color-accent-secondary)"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MealsPerDayCard;
