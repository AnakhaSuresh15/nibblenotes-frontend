const LongestStreakCard = ({ longestStreak, currentStreak }) => {
  return (
    <div className="card md:w-1/4 w-full p-6 rounded-3xl flex justify-between">
      {longestStreak === null || currentStreak === null ? (
        <div className="text-center text-gray-500">No data available</div>
      ) : (
        <>
          <div className="flex flex-col justify-between">
            <span>Longest Streak</span>
            <div className="text-3xl font-semibold">
              <span>{longestStreak}</span>
              <span className="text-xl ml-3">days</span>
            </div>
            <span className="dark:text-white/70">
              Current streak {currentStreak}
            </span>
          </div>
          <div className="text-6xl flex items-center">🔥</div>
        </>
      )}
    </div>
  );
};

export default LongestStreakCard;
