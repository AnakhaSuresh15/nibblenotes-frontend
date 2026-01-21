import { useSidebar } from "../../contexts/SidebarContext";
import EmojiPicker from "../EmojiPicker";
import { useForm, Controller, set, FormProvider } from "react-hook-form";
import ImageUploader from "../ImageUploader";
import { useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { HiCalendarDateRange } from "react-icons/hi2";
import RecipeSection from "./RecipeSection";
import PhysicalSection from "./PhysicalSection";
import TagsSection from "./TagsSection";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../Loader";

const CreateLog = () => {
  const { isSidebarOpen } = useSidebar();
  const { api } = useAuth();
  const location = useLocation();
  const { logId } = useParams();
  const editLog = location.state?.editLog || false;
  const [originalLogData, setOriginalLogData] = useState(null);
  const [createdDate, setCreatedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [physicalSelections, setPhysicalSelections] = useState([]);
  const [tagsSelections, setTagsSelections] = useState([]);
  const [moodBeforeSelection, setMoodBeforeSelection] = useState("content");
  const [moodAfterSelection, setMoodAfterSelection] = useState("content");
  const [preparationMethod, setPreparationMethod] = useState("");
  const [servings, setServings] = useState(1);
  const [calories, setCalories] = useState(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const compareFn = (arg1, arg2) => {
    return JSON.stringify(arg1) === JSON.stringify(arg2);
  };

  const methods = useForm({
    defaultValues: {
      image: null,
      dishName: "",
      reflection: "",
      ingredients: [],
      preparationMethod: "",
      servings: 1,
      calories: 0,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = methods;

  async function uploadMealImage(file, userId) {
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("meal-images")
      .upload(filePath, file, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from("meal-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  useEffect(() => {
    if (!editLog || !logId) return;
    // Fetch existing log data and populate the form
    api
      .get(`${import.meta.env.VITE_BE_URL}/common/logs?logId=${logId}`)
      .then((response) => {
        const log = response.data;
        methods.reset({
          image: log.image,
          dishName: log.dishName,
          reflection: log.reflection,
          ingredients: log.ingredients,
          preparationMethod: log.preparationMethod,
          servings: log.servings,
          calories: log.calories,
        });

        setOriginalLogData(log);

        if (log.moodBeforeSelection) {
          setMoodBeforeSelection(log.moodBeforeSelection);
        }
        if (log.moodAfterSelection) {
          setMoodAfterSelection(log.moodAfterSelection);
        }
        if (log.physicalFeedback) {
          setPhysicalSelections(log.physicalFeedback);
        }
        if (log.tags) {
          setTagsSelections(log.tags);
        }
        if (log.createdAt) {
          setCreatedDate(new Date(log.createdAt));
        }
        if (log.date) {
          setDate(new Date(log.date));
        }
      })
      .catch(() => {
        toast.error("Failed to load existing log");
      });
  }, [editLog, logId, api, methods]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (editLog && logId) {
      try {
        const updatedFields = {};

        if (!originalLogData) return;

        for (const field in data) {
          if (compareFn(originalLogData[field], data[field]) === false) {
            updatedFields[field] = data[field];
          }
        }

        if (originalLogData.moodBeforeSelection !== moodBeforeSelection) {
          updatedFields.moodBeforeSelection = moodBeforeSelection;
        }
        if (originalLogData.moodAfterSelection !== moodAfterSelection) {
          updatedFields.moodAfterSelection = moodAfterSelection;
        }
        if (
          compareFn(originalLogData.physicalFeedback, physicalSelections) ===
          false
        ) {
          updatedFields.physicalFeedback = physicalSelections;
        }
        if (compareFn(originalLogData.tags, tagsSelections) === false) {
          updatedFields.tags = tagsSelections;
        }

        //date check
        const originalTime = new Date(originalLogData.date).getTime();
        const newTime = new Date(date).getTime();

        if (originalTime !== newTime) {
          updatedFields.date = new Date(date).toISOString();
        }
        if (dirtyFields.image && data.image) {
          const email = JSON.parse(localStorage.getItem("nibble_user"))?.email;
          if (!email) {
            toast("Login to create a log!");
            return;
          }
          const imageUrl = await uploadMealImage(data.image, email);
          updatedFields.image = imageUrl;
        }

        if (Object.keys(updatedFields).length === 0) {
          toast.info("No fields to update!");
          return;
        }

        await api.patch(
          `${import.meta.env.VITE_BE_URL}/common/edit-log/${logId}`,
          {
            ...updatedFields,
          },
        );
        toast.success("Log edited successfully!");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to edit log. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      const email =
        JSON.parse(localStorage.getItem("nibble_user"))?.email || "guest";
      if (isValid) {
        let imageUrl = null;
        if (data.image) {
          imageUrl = await uploadMealImage(data.image, email);
        }
        try {
          api.post(`${import.meta.env.VITE_BE_URL}/create-log`, {
            dishName: data.dishName,
            createdAt: new Date().toISOString(),
            createdBy: email,
            image: imageUrl,
            ingredients: data.ingredients,
            preparationMethod: data.preparationMethod,
            servings: data.servings,
            calories: data.calories,
            physicalFeedback: physicalSelections,
            tags: tagsSelections,
            moodBeforeSelection,
            moodAfterSelection,
            reflection: data.reflection,
            date: new Date(date).toISOString(),
          });
          toast.success("Log created successfully!");
          navigate("/dashboard");
        } catch (error) {
          console.error("Error creating log:", error);
          toast.error("Failed to create log. Please try again.");
        }
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className={`bg-primary overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "w-3/4 ml-[25%] px-20" : "w-full ml-0 md:px-24 px-6"
        } py-9 flex flex-col`}
      >
        {isLoading && <Loader />}
        <h1 className="text-2xl pb-5 text-text">Create Log</h1>
        <form
          className="flex md:flex-row flex-col flex-nowrap gap-4 flex-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full md:w-1/2 gap-8">
            <div className="card h-1/2 flex flex-col justify-center items-center md:rounded-xl p-4 cursor-pointer">
              {/* {!watch("image") && (
              <>
                <FaImage size={40} />
                <span className="text-xs">Add Image</span>
              </>
            )} */}
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="flex flex-col text-lg card md:rounded-xl">
              <input
                className="p-3 card md:rounded-xl w-full"
                placeholder="Enter Meal Name"
                {...register("dishName", {
                  required: "Meal name is required",
                })}
              ></input>
              {errors.dishName && (
                <span className="text-red-500 text-sm pl-3">
                  {errors.dishName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 relative justify-between text-lg card p-2 md:rounded-xl cursor-pointer">
              <span>Date & Time</span>
              <div className="flex items-center w-full">
                <DatePicker
                  selected={date}
                  onChange={(d) => setDate(d)}
                  showTimeSelect
                  dateFormat="MM/dd/yyyy h:mm aa"
                  className="text-sm w-full bg-accent-secondary pl-8 p-2 rounded-md text-text"
                />
                <HiCalendarDateRange size={20} className="absolute right-4" />
              </div>
            </div>

            {/* Recipe Section */}
            <RecipeSection
              preparationMethod={preparationMethod}
              setPreparationMethod={setPreparationMethod}
              servings={servings}
              setServings={setServings}
              calories={calories}
              setCalories={setCalories}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-8">
            {/* Mood Section */}
            <div className="flex w-full gap-5">
              <div className="w-1/2 flex flex-col p-3 card md:rounded-xl relative">
                <span className="text-sm pb-1.5">Mood before</span>
                <EmojiPicker
                  selectedMood={moodBeforeSelection}
                  setMood={setMoodBeforeSelection}
                />
              </div>

              <div className="w-1/2 flex flex-col p-3 card md:rounded-xl relative">
                <span className="text-sm pb-1.5">Mood after</span>
                <EmojiPicker
                  selectedMood={moodAfterSelection}
                  setMood={setMoodAfterSelection}
                />
              </div>
            </div>

            {/* Physical Section */}
            <PhysicalSection
              physicalSelections={physicalSelections}
              setPhysicalSelections={setPhysicalSelections}
              editLog={editLog}
            />

            {/* Tags Section */}
            <TagsSection
              tagsSelections={tagsSelections}
              setTagsSelections={setTagsSelections}
              editLog={editLog}
            />
            <div className="flex flex-col w-full dark:text-gray-100 text-zinc-600">
              <label htmlFor="notes-area" className="text-lg pb-2">
                Reflection
              </label>
              <textarea
                name="notes-area"
                id="notes-area"
                placeholder="Write anything you want to remember about this meal."
                className="flex flex-row justify-between text-sm card p-2 md:rounded-xl dark:bg-[#1a1a1a]"
                {...register("reflection")}
              ></textarea>
            </div>

            <button className="bg-accent dark:text-gray-200 text-gray-600 py-3 rounded-lg font-semibold w-1/3 self-center cursor-pointer hover:brightness-90 mb-6">
              Save Log {isLoading ? "..." : ""}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateLog;
