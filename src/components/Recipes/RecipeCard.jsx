import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  let tags = recipe.strTags ? recipe.strTags.split(",") : [];
  recipe.strArea && !tags.includes(recipe.strArea) && tags.push(recipe.strArea);
  tags = tags.slice(0, 3); // Limit to first 3 tags
  return (
    <div className="bg-cards-bg p-4 rounded-lg shadow-md text-text">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{recipe.strMeal}</h2>
      <p className="text-sm text-text mb-4">
        {recipe.strInstructions.substring(0, 100)}...
      </p>
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
      <button
        className="bg-accent text-text px-3 py-1 rounded-lg cursor-pointer"
        onClick={() =>
          navigate(`/recipe/${recipe.idMeal}`, { state: { recipe } })
        }
      >
        View Full Recipe
      </button>
    </div>
  );
};

export default RecipeCard;
