import { useSidebar } from "../contexts/SidebarContext";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { getLocalDateString } from "../utils/date";
import { FaPlus } from "react-icons/fa";
import RecentLogs from "./RecentLogs";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import AvgMealsPerDayCard from "./Insights/AvgMealsPerDayCard";
import Loader from "./Loader";

function Dashboard() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { api } = useAuth();
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const formattedDate = `${day}, ${month} ${year}`;
  const navigate = useNavigate();
  const [mealsToday, setMealsToday] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentMeals, setRecentMeals] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState([]);
  const [avgMealsPerDay, setAvgMealsPerDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const getGreetingText = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    else if (currentHour < 18) return "Good Afternoon";
    else return "Good Evening";
  };

  const handleDayClick = (date) => {
    const localDate = getLocalDateString(date);

    navigate(`/log/${localDate}`, { state: { selectedDate: date } });
  };

  useEffect(() => {
    setLoading(true);
    isSidebarOpen && closeSidebar();
    const fetchDashboardData = async () => {
      try {
        // Fetch summary data from backend
        const response = await api.get(
          `${import.meta.env.VITE_BE_URL}/dashboard/summary`,
        );

        if (response && response.data) {
          const data = response.data;
          setMealsToday(data.mealsToday);
          setTotalMeals(data.totalMeals);
          setStreak(data.streak);
          setRecentMeals(data.recentMeals);
          setMealsPerDay(data.mealsPerDay);
          setAvgMealsPerDay(data.avgMealsPerDay);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        toast.error("Failed to fetch dashboard summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 ${
        isSidebarOpen ? "w-3/4 ml-[25%] px-16" : "w-full ml-0 md:px-24 px-6"
      } py-9 flex flex-col`}
    >
      <div className="flex justify-between">
        <h1 className="text-2xl pb-2 text-text">{getGreetingText()}</h1>
        <button
          className="bg-accent-secondary flex text-text items-center px-2 rounded-md cursor-pointer text-sm "
          onClick={() => {
            navigate("/create-log");
          }}
        >
          <FaPlus /> &nbsp;Create Log
        </button>
      </div>
      <i className="text-text">{formattedDate}</i>
      {loading && <Loader />}
      <div className="flex flex-col">
        <div className="py-3 flex-row flex flex-nowrap justify-between gap-1.5 md:gap-4 md:text-sm text-xs">
          <div className="card basis-1/3 md:p-6 p-3 md:rounded-3xl flex flex-col">
            <span className="pb-2">Meals Today</span>
            {mealsToday}
          </div>
          <div className="card basis-1/3 md:p-6 p-3 md:rounded-3xl flex flex-col">
            <span className="pb-2">Total Meals</span>
            {totalMeals}
          </div>
          <div className="card basis-1/3 md:p-6 p-3 md:rounded-3xl flex flex-col">
            <span className="pb-2">Streak</span>
            {streak > 0 ? `${streak}🔥` : "0"}
          </div>
        </div>
        <div className="py-3 flex-row flex flex-wrap justify-between">
          <div className="flex flex-col md:w-2/3 w-full md:pr-4">
            <div className="flex flex-row justify-between pb-3">
              <h3 className="text-xl text-text">Recent Logs</h3>
            </div>
            <div className="card w-full md:p-5 p-1 md:rounded-3xl mb-6">
              <RecentLogs
                recentMeals={recentMeals}
                setRecentMeals={setRecentMeals}
              />
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/3 gap-6">
            <div className="w-full bg-cards-bg border border-zinc-400 dark:border-none hover:bg-cards-hover-bg md:rounded-3xl md:p-6 p-2 flex flex-col justify-center items-center h-min">
              <span className="text-lg pb-3 text-text">Log Calendar</span>
              <Calendar
                onClickDay={(value) => {
                  handleDayClick(value);
                }}
                maxDate={new Date()}
              />
            </div>
            <AvgMealsPerDayCard
              avgMealsPerDay={avgMealsPerDay}
              mealsPerDay={mealsPerDay}
              fromDashboard={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
