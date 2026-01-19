import { PiCaretDoubleRight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { capitalizeWords } from "../../utils/string";
import { useFormContext, Controller } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";

const RecipeSection = ({
  preparationMethod,
  setPreparationMethod,
  servings,
  setServings,
  calories,
  setCalories,
}) => {
  const { api } = useAuth();
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(true);
  const expandSection = () => {
    setIsRecipeExpanded((prev) => !prev);
  };

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (errors.ingredients) {
      setIsRecipeExpanded(true);
    }
  }, [errors.ingredients]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await api.get(
        `${import.meta.env.VITE_BE_URL}/create-log/ingredients?query=${query}`
      );
      const data = await res.data;
      setSuggestions(data);
      setShowDropdown(true);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex flex-col justify-between items-center text-lg card p-2 md:rounded-xl">
      <div
        className="flex justify-between items-center w-full cursor-pointer"
        onClick={() => {
          expandSection("recipe");
        }}
      >
        <span>Recipe*</span>
        <PiCaretDoubleRight size={20} />
      </div>
      {isRecipeExpanded && (
        <div className="flex flex-col w-full mt-4 gap-4">
          <div className="flex flex-col text-sm">
            <label>Ingredients used*</label>
            <Controller
              name="ingredients"
              control={control}
              defaultValue={[]}
              rules={{
                required: "At least one ingredient is required",
                validate: (value) =>
                  value.length > 0 || "At least one ingredient is required",
              }}
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    className="bg-color-secondary rounded-sm mt-2 p-2"
                    placeholder="Enter Ingredients..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  {showDropdown && suggestions.length > 0 && (
                    <ul className="dropdown p-1.5 border-2 border-accent-secondary bg-primary mt-1 max-h-40 overflow-y-scroll">
                      {suggestions.map((item) => (
                        <li
                          key={item._id}
                          onClick={() => {
                            if (field.value.find((i) => i._id === item._id))
                              return;
                            setValue("ingredients", [...field.value, item], {
                              shouldValidate: true,
                            });
                            setQuery("");
                            setSuggestions([]);
                            setShowDropdown(false);
                          }}
                        >
                          {capitalizeWords(item.name)}
                        </li>
                      ))}
                    </ul>
                  )}

                  {field.value.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value.map((item) => (
                        <span
                          key={item._id}
                          className="bg-accent text-white px-2 py-1 rounded-full text-xs cursor-pointer"
                          onClick={() =>
                            setValue(
                              "ingredients",
                              field.value.filter((i) => i._id !== item._id)
                            )
                          }
                        >
                          {capitalizeWords(item.name)} ×
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            />
            {errors.ingredients && (
              <span className="text-red-500 text-sm pl-3">
                {errors.ingredients.message}
              </span>
            )}
          </div>

          <div className="flex flex-col text-sm">
            <label>Preparation Method</label>
            <textarea
              type="text"
              className="bg-color-secondary rounded-sm mt-2 p-2"
              {...register("preparationMethod", {
                onChange: (e) => setPreparationMethod(e.target.value),
              })}
              placeholder="Enter Steps..."
              value={preparationMethod}
            ></textarea>
          </div>
          <div className="flex">
            <div className="flex flex-col text-sm w-1/2">
              <label>Servings*</label>
              <div className="flex gap-2">
                <input
                  className="bg-color-secondary rounded-sm mt-2 p-2 w-1/3"
                  type="number"
                  {...register("servings", {
                    required: "Servings is required",
                    min: {
                      value: 1,
                      message: "Servings must be at least 1",
                    },
                    onChange: (e) => setServings(e.target.value),
                  })}
                  value={servings}
                />
              </div>
              {errors.servings && (
                <span className="text-red-500 text-sm pl-3">
                  {errors.servings.message}
                </span>
              )}
            </div>

            <div className="flex flex-col text-sm w-1/2">
              <label>Calories per serving (kcal)</label>
              <input
                className="bg-color-secondary rounded-sm mt-2 p-2 w-1/3"
                type="number"
                value={calories === 0 ? "" : calories}
                onChange={(e) => setCalories(e.target.value)}
              ></input>
            </div>
          </div>
        </div>
      )}
      <div className="w-full"></div>
    </div>
  );
};

export default RecipeSection;
