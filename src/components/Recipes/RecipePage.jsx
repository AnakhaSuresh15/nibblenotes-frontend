import { IoIosArrowBack } from "react-icons/io";
import { useSidebar } from "../../contexts/SidebarContext";
import { useLocation } from "react-router-dom";
import { FaFlag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import { MdCategory } from "react-icons/md";

const RecipePage = () => {
  const { isSidebarOpen } = useSidebar();
  const location = useLocation();
  const recipe = location.state?.recipe;
  const navigate = useNavigate();
  let tags = recipe?.strTags ? recipe.strTags.split(",") : [];
  recipe?.strArea &&
    !tags.includes(recipe.strArea) &&
    tags.push(recipe.strArea);

  const ingredients = recipe
    ? Object.keys(recipe)
        .filter((key) => key.startsWith("strIngredient") && recipe[key])
        .map((key) => recipe[key])
    : [];
  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 text-text ${
        isSidebarOpen ? "w-3/4 ml-[25%] px-16" : "w-full ml-0 md:px-24 px-6"
      } py-9 flex flex-col gap-4`}
    >
      <span className="flex text-sm items-center cursor-pointer">
        <IoIosArrowBack className="" />{" "}
        <span
          onClick={() => {
            navigate("/recipes");
          }}
          className="hover:underline"
        >
          All Recipes
        </span>{" "}
        / &nbsp;
        <span className="text-lg">{recipe?.strMeal}</span>
      </span>
      <div className="flex justify-between">
        <span className="text-2xl pb-2">{recipe?.strMeal}</span>
        {/* <button className="text-text bg-accent cursor-pointer p-2 rounded-xl flex items-center gap-2">
          <FaRegBookmark />
          Save Log
        </button> */}
      </div>
      {tags.length > 0 && (
        <div className="mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-accent-secondary px-2 py-1 rounded-full text-xs mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* <span className="text-sm italic pb-4">
        Source: {recipe?.strSource || "N/A"}
      </span> */}
      <div className="flex md:flex-row flex-col gap-4">
        <div className="md:w-2/3 w-full h-72 overflow-hidden rounded-2xl mb-6">
          <img
            src={recipe?.strMealThumb}
            alt={recipe?.strMeal}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col md:w-1/3 w-full">
          <div className="card flex flex-col p-4 rounded-2xl">
            <div className="flex items-center mb-2">
              <CiYoutube size={24} />
              &nbsp;&nbsp;
              <a
                href={recipe?.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Watch on YouTube
              </a>
            </div>
            <div className="flex items-center mb-2">
              <MdCategory />
              &nbsp;&nbsp;
              <span>{recipe?.strCategory}</span>
            </div>
            <div className="flex items-center">
              <FaFlag />
              &nbsp;&nbsp;
              <span>{recipe?.strArea}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col md:w-2/3 w-full gap-4">
        <div className="md:w-1/2 w-full card p-4 rounded-2xl flex flex-col gap-3">
          <span className="text-xl font-semibold">Ingredients</span>
          <ul className="list-disc list-inside">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2 w-full card p-4 rounded-2xl flex flex-col gap-3">
          <span className="text-xl font-semibold">Instructions</span>
          <p className="whitespace-pre-line">{recipe?.strInstructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
