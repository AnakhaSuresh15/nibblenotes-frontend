import { useEffect, useState } from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import ConsistencyCard from "./ConsistencyCard";
import { useAuth } from "../../contexts/AuthContext";
import AvgMealsPerDayCard from "./AvgMealsPerDayCard";
import { toast } from "react-toastify";
import LongestStreakCard from "./LongestStreakCard";
import MostCommonTimeCard from "./MostCommonTimeCard";
import MealsPerDayCard from "./MealsPerDayCard";
import MealDistributionCard from "./MealDistributionCard";
import TopData from "./TopData";

const Insights = () => {
  const { isSidebarOpen } = useSidebar();
  const { api } = useAuth();
  const [insightsData, setInsightsData] = useState(null);
  const [timeFilter, setTimeFilter] = useState(30);

  const handleTimeFilterClick = (time) => {
    if (time !== timeFilter) {
      setTimeFilter(time);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get(
          `${
            import.meta.env.VITE_BE_URL
          }/insights-data?timeFilter=${timeFilter}`
        );
        if (data) {
          setInsightsData(data.data);
        }
      } catch (error) {
        console.error("Error fetching insights data:", error);
        toast.error("Failed to fetch insights data. Please try again.");
      }
    };
    fetchData();
  }, [timeFilter]);

  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 ${
        isSidebarOpen ? "w-3/4 ml-[25%] px-16" : "w-full ml-0 md:px-24 px-6"
      } py-9 flex flex-col`}
    >
      <div className="flex justify-between">
        <h1 className="text-2xl pb-2 text-text">Insights</h1>
        {/* <button
          className="bg-accent text-text rounded-xl px-4 py-2 text-sm cursor-pointer mb-3"
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
        >
          Last 30 days <IoIosArrowDown className="inline-block ml-1" />
        </button> */}
        <select
          className="bg-accent text-text rounded-xl px-4 py-2 text-sm cursor-pointer mb-3"
          onChange={(e) => handleTimeFilterClick(Number(e.target.value))}
        >
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex md:flex-row flex-col gap-4">
          <ConsistencyCard
            noOfDaysLogged={insightsData?.noOfDaysLogged}
            timeFilter={timeFilter}
            consistencyChangePercent={insightsData?.consistencyChangePercent}
          />
          <AvgMealsPerDayCard
            avgMealsPerDay={insightsData?.avgMealsPerDay}
            mealsPerDay={insightsData?.mealsPerDay}
          />
          <LongestStreakCard
            longestStreak={insightsData?.longestStreak}
            currentStreak={insightsData?.currentStreak}
          />
          <MostCommonTimeCard mostCommonTime={insightsData?.mostCommonTime} />
        </div>
        <div className="flex md:flex-row flex-col gap-4">
          <MealsPerDayCard mealsPerDay={insightsData?.mealsPerDay} />
          <MealDistributionCard
            mealDistribution={insightsData?.mealDistribution}
          />
        </div>
        <div className="flex md:flex-row flex-col gap-4">
          <TopData data={insightsData?.topTags} type="tags" />
          <TopData data={insightsData?.topMeals} type="meals" />
          <TopData data={insightsData?.topPhysicalFeedback} type="feedback" />
        </div>
      </div>
    </div>
  );
};

export default Insights;
