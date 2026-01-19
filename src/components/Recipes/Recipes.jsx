import { useSidebar } from "../../contexts/SidebarContext";
import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { IoFilterSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const Recipes = () => {
  const { isSidebarOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const requests = Array.from({ length: 8 }).map(() =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
            (r) => r.json()
          )
        );

        const results = await Promise.all(requests);
        const meals = results.map((r) => r.meals[0]);
        setRecipes(meals);
      } catch (error) {
        console.error("Error fetching recipes data:", error);
        toast.error("Failed to fetch recipes data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onRecipeSearch = async () => {
    if (!searchQuery) return;

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
    );
    const data = await response.json();
    setRecipes(data.meals || []);
  };

  return (
    <div
      className={`bg-primary overflow-y-auto transition-all duration-300 gap-6 ${
        isSidebarOpen ? "w-3/4 ml-[25%] px-16" : "w-full ml-0 md:px-24 px-6"
      } py-9 flex flex-col`}
    >
      <h1 className="text-2xl pb-2 text-text self-center">Recipes</h1>

      <div className="flex gap-4 w-full justify-center items-center">
        <input
          type="text"
          placeholder="Search recipes..."
          className="md:w-1/3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-cards-bg text-text"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-accent text-text px-4 py-2 rounded-lg"
          onClick={onRecipeSearch}
        >
          Search
        </button>
      </div>

      {/* /*Future feature*/}
      {/* <button
        className="bg-accent text-text px-4 py-2 rounded-lg self-start disabled:bg-disabled"
        disabled={recipes.length === 0}
      >
        Filter <IoFilterSharp className="inline-block ml-1" />
      </button> */}

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <p className="text-text text-center text-2xl">Loading recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex justify-center items-center mt-10">
          <p className="text-text text-center text-2xl">
            No recipes found. Try searching above!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
