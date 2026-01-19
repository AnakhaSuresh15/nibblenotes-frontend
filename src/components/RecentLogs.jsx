import foodImage from "../assets/food-image.png";
import React, { useState } from "react";
import { tags } from "../constants/tags";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { getLocalDateTimeString } from "../utils/date";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const RecentLogs = ({ recentMeals, setRecentMeals }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { api } = useAuth();
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [dialogType, setDialogType] = useState(null); // "delete" | "edit"

  const navigate = useNavigate();
  const openDeleteDialog = (logId) => {
    setSelectedLogId(logId);
    setDialogType("delete");
    setIsDialogOpen(true);
  };

  const openEditDialog = (logId) => {
    setSelectedLogId(logId);
    setDialogType("edit");
    setIsDialogOpen(true);
  };

  const deleteLog = async (logId) => {
    try {
      await api.delete(
        `${import.meta.env.VITE_BE_URL}/common/delete-log/${logId}`
      );
      toast.success("Log deleted successfully");
      setRecentMeals((prev) => prev.filter((log) => log._id !== logId));
    } catch (e) {
      toast.error("Failed to delete the log. Please try again later.");
    }
  };

  const editLog = (logId) => {
    navigate(`/edit-log/${logId}`, { state: { editLog: true } });
  };

  return (
    <div>
      {recentMeals.length > 0 ? (
        <div className="flex flex-col gap-4">
          {recentMeals.map((log) => {
            return (
              <div
                className="flex justify-between items-center border-2 border-zinc-300 dark:border-zinc-600 rounded-2xl md:p-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                key={log._id}
              >
                <div className="flex">
                  <img
                    src={log.image || foodImage}
                    alt="upload image"
                    className={`${
                      log.image ? "object-cover" : "object-contain"
                    } w-24 h-24 self-center rounded-2xl`}
                  />
                  <div className="ml-4 flex flex-col justify-around">
                    <h3 className="font-bold">{log.dishName}</h3>
                    <p className="text-sm text-gray-500">
                      {getLocalDateTimeString(log.createdAt)}
                    </p>
                    <p className="text-xs">
                      {log.servings === 1
                        ? "1 Serving"
                        : `${log.servings} Servings`}
                    </p>
                    <div className="text-sm flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Tags:</span>

                      <div className="flex flex-wrap gap-2">
                        {tags
                          .filter((tag) => log.tags.includes(tag.id))
                          .map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1 bg-accent-secondary rounded-full px-3 py-1 text-xs whitespace-nowrap"
                            >
                              {tag.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mr-2">
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
            );
          })}
        </div>
      ) : (
        <div>No meals logged recently.</div>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title={dialogType === "delete" ? "Confirm Deletion" : "Confirm Edit"}
        message={
          dialogType === "delete"
            ? "Are you sure you want to delete this meal log?"
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

export default RecentLogs;
