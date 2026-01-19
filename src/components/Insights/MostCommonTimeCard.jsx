const MostCommonTimeCard = ({ mostCommonTime }) => {
  // const [commonTime, commonRange] = mostCommonTime ?? mostCommonTime.split(",");
  const commonTime = mostCommonTime ? mostCommonTime.split(",")[0] : "--:--";
  const commonRange = mostCommonTime ? mostCommonTime.split(",")[1] : "No data";
  return (
    <div className="card md:w-1/4 w-full p-6 rounded-3xl flex justify-between">
      <div className="flex flex-col justify-between">
        <span>Most Common Time</span>
        {mostCommonTime === null ? (
          <div className="text-center text-gray-500">No data available</div>
        ) : (
          <>
            <div className="text-3xl font-semibold">{commonTime}</div>
            <span className="dark:text-white/70">{commonRange}</span>
          </>
        )}
      </div>
      {mostCommonTime !== null && (
        <div className="text-6xl flex items-center">🕒</div>
      )}
    </div>
  );
};

export default MostCommonTimeCard;
