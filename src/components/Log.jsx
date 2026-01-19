import { useSidebar } from "../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { getLocalDateString } from "../utils/date";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import foodImage from "../assets/food-image.png";
import { capitalizeWords } from "../utils/string";
import { getLocalDateStringVerbose } from "../utils/date";
import { useAuth } from "../contexts/AuthContext";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import ConfirmationDialog from "./ConfirmationDialog";
import { isMobile } from "react-device-detect";

const Log = () => {
  const { isSidebarOpen } = useSidebar();
  const { api } = useAuth();
  const { date } = useParams();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : new Date(date);
  const dateISOString = new Date(selectedDate).toISOString();
  const [logsForDate, setLogsForDate] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [dialogType, setDialogType] = useState(null); // "delete" | "edit"
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const openDeleteDialog = (logId, logs) => {
    if (logId) {
      setSelectedLogId(logId);
    } else if (logs && logs.length === 1) {
      setSelectedLogId(logs[0]);
    } else {
      setIsBulkDelete(true);
    }
    setDialogType("delete");
    setIsDialogOpen(true);
  };

  const openEditDialog = (logId) => {
    setSelectedLogId(logId);
    setDialogType("edit");
    setIsDialogOpen(true);
  };

  const deleteLog = async (logId) => {
    if (isBulkDelete && checkedItems.length > 1) {
      try {
        await api.delete(
          `${
            import.meta.env.VITE_BE_URL
          }/common/delete-logs?logs=${checkedItems}`
        );
        toast.success("Logs deleted successfully");
      } catch (e) {
        toast.error("Failed to delete the logs. Please try again later.");
      }
    } else if (checkedItems.length === 1 || logId) {
      try {
        await api.delete(
          `${import.meta.env.VITE_BE_URL}/common/delete-log/${
            logId || checkedItems[0]
          }`
        );
        toast.success("Log deleted successfully");
      } catch (e) {
        toast.error("Failed to delete the log. Please try again later.");
      }
    }
  };

  const editLog = (logId) => {
    navigate(`/edit-log/${logId}`, { state: { editLog: true } });
  };

  const createLog = () => {
    navigate("/create-log", { state: { selectedDate: date } });
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      return prev.includes(id)
        ? prev.filter((_id) => _id !== id)
        : [...prev, id];
    });
  };

  const handleAllCheckboxes = () => {
    if (checkedItems.length === logsForDate.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(logsForDate.map((log) => log._id));
    }
  };

  useEffect(() => {
    // Check if log exists for the selected date
    const fetchLog = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BE_URL}/common/logs?date=${dateISOString}`
        );
        setLogsForDate(response.data);
      } catch (error) {
        console.error("Error fetching recent logs:", error);
        toast.error("Failed to fetch logs. Please try again.");
      }
    };

    fetchLog();
  }, []);

  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 text-text ${
        (isSidebarOpen ? "w-3/4 ml-[25%] px-20" : "w-full ml-0 md:px-24 px-6") +
        (logsForDate.length === 0 ? " justify-center" : "")
      } py-9 flex flex-col items-center`}
    >
      {logsForDate.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-8 mb-5 w-11/12">
            <h1
              className={`text-3xl md:text-left ${
                checkedItems.length <= 0 ? "text-center" : "text-left"
              }`}
            >
              Logs for {getLocalDateStringVerbose(selectedDate)}
            </h1>
            {checkedItems.length > 0 ? (
              <button
                className="bg-accent px-4 py-2 rounded-2xl whitespace-nowrap cursor-pointer hover:brightness-90 font-semibold"
                onClick={() => openDeleteDialog(undefined, checkedItems)}
              >
                {checkedItems.length === 1 ? "Delete Log" : "Delete Logs"}
              </button>
            ) : (
              <button
                className="bg-accent px-4 py-2 rounded-2xl whitespace-nowrap cursor-pointer hover:brightness-90 font-semibold"
                onClick={() => {
                  createLog();
                }}
              >
                Create New Log
              </button>
            )}
          </div>
          {checkedItems.length > 0 && logsForDate.length > 0 && (
            <div className="w-11/12 flex justify-start mb-4">
              <input
                type="checkbox"
                onChange={() => {
                  handleAllCheckboxes();
                }}
                className="w-6 h-6 cursor-pointer"
              />
              <span className="ml-2">Select All</span>
            </div>
          )}
          <div className="w-11/12 border-b border-gray-300 mb-6"></div>
          {logsForDate.map((log) => (
            <div
              className="card p-4 m-4 rounded-2xl w-11/12 flex flex-col md:flex-row md:gap-14 gap-6 items-center"
              key={log._id}
            >
              {!isMobile && (
                <input
                  type="checkbox"
                  checked={checkedItems.includes(log._id)}
                  onChange={() => handleCheckboxChange(log._id)}
                  className="w-6 h-6 cursor-pointer"
                />
              )}
              {isMobile && (
                <h2 className="text-2xl font-bold">{log.dishName}</h2>
              )}
              <img
                src={log.image || foodImage}
                alt={log.dishName}
                className="w-64 h-64 object-cover rounded-lg"
              />
              <div>
                {!isMobile && (
                  <h2 className="text-2xl font-bold mb-4">{log.dishName}</h2>
                )}
                <p className="mb-2 inline-flex gap-2 flex-wrap">
                  <strong>Ingredients:</strong>{" "}
                  {log.ingredients.map((ingredient) => (
                    <span
                      className="bg-accent-secondary rounded-full px-2 py-0.5 text-sm whitespace-nowrap"
                      key={ingredient._id}
                    >
                      {capitalizeWords(ingredient.name)}
                    </span>
                  ))}
                </p>
                <p className="mb-2">
                  <strong>Preparation Method:</strong>{" "}
                  {log.preparationMethod || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Servings:</strong> {log.servings}
                </p>
                <p className="mb-2">
                  <strong>Calories:</strong> {log.calories || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Reflection:</strong> {log.reflection || "N/A"}
                </p>
                <div className="inline-flex">
                  {log.tags && log.tags.length > 0 && (
                    <p className="mb-2 flex gap-2 flex-wrap">
                      <strong>Tags:</strong>{" "}
                      {log.tags.map((tag) => (
                        <span
                          className="bg-accent rounded-full px-2 py-0.5 text-sm whitespace-nowrap"
                          key={tag}
                        >
                          {capitalizeWords(tag)}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-24 md:ml-auto md:mr-12">
                <TbEdit
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    openEditDialog(log._id);
                  }}
                />
                <MdDelete
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    openDeleteDialog(log._id);
                  }}
                />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-5">
          <span className="text-gray-600 dark:text-gray-100 text-3xl">
            No Log created for the date {getLocalDateString(selectedDate)}
          </span>
          <button
            className="bg-accent text-text p-2 rounded-xl font-semibold cursor-pointer hover:brightness-90"
            onClick={() => {
              createLog();
            }}
          >
            Create new log for this day
          </button>
        </div>
      )}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title={dialogType === "delete" ? "Confirm Deletion" : "Confirm Edit"}
        message={
          dialogType === "delete"
            ? isBulkDelete
              ? "Are you sure you want to delete these meal logs?"
              : "Are you sure you want to delete this meal log?"
            : "Are you sure you want to edit this meal log?"
        }
        onConfirm={() => {
          if (dialogType === "delete") {
            deleteLog(selectedLogId);
          } else if (dialogType === "edit") {
            editLog(selectedLogId);
          }

          setIsDialogOpen(false);
          setSelectedLogId(null);
          setDialogType(null);
        }}
        onCancel={() => {
          setIsDialogOpen(false);
          setSelectedLogId(null);
          setDialogType(null);
        }}
      />
    </div>
  );
};

export default Log;
