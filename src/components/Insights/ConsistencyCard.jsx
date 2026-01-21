import { FcCalendar } from "react-icons/fc";
import { IoMdArrowRoundUp } from "react-icons/io";

const ConsistencyCard = ({
  noOfDaysLogged,
  timeFilter,
  consistencyChangePercent,
}) => {
  return (
    <div className="card md:w-1/4 w-full p-6 rounded-3xl flex justify-between">
      <div className="flex flex-col justify-between">
        <span>Consistency</span>
        {noOfDaysLogged === 0 ||
        timeFilter === null ||
        consistencyChangePercent === 0 ? (
          <div className="text-center text-gray-500">No data available</div>
        ) : (
          <>
            <div className="text-3xl font-semibold">
              {noOfDaysLogged}/{timeFilter} days
            </div>
            <div>
              <IoMdArrowRoundUp className="inline text-accent" />
              <span className="text-pink-300">
                {" "}
                {consistencyChangePercent}%{" "}
              </span>
              <span className="dark:text-white/70">
                since last {timeFilter} days
              </span>
            </div>
          </>
        )}
      </div>
      <FcCalendar size={40} className="ml-auto" />
    </div>
  );
};

export default ConsistencyCard;
