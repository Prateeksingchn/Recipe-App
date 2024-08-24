import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  ChefHat,
  Flame,
  Leaf,
  ArrowLeft,
  Edit,
  Trash,
} from "lucide-react";
import UpdateNutritionRecipe from "../Nutrition/UpdateNutritionRecipe";

const UserCreatedNutritionRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    console.log("UserCreatedNutritionRecipeDetail rendering. ID:", id);
    window.scrollTo(0, 0);
    try {
      const storedRecipes = JSON.parse(
        localStorage.getItem("userCreatedRecipes") || "[]"
      );
      console.log("Stored recipes:", storedRecipes);
      console.log("Looking for recipe with ID:", id);
      const foundRecipe = storedRecipes.find(
        (r) => r.id === id || r.id === parseInt(id)
      );
      console.log("Found recipe:", foundRecipe);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        console.log("Recipe not found in stored recipes");
        setError("Recipe not found");
      }
    } catch (e) {
      console.error("Error parsing stored recipes:", e);
      setError("Error loading recipe data");
    }
    setIsLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      const storedRecipes = JSON.parse(
        localStorage.getItem("userCreatedRecipes") || "[]"
      );
      const updatedRecipes = storedRecipes.filter(
        (r) => r.id !== id && r.id !== parseInt(id)
      );
      localStorage.setItem(
        "userCreatedRecipes",
        JSON.stringify(updatedRecipes)
      );
      navigate("/nutrition");
    }
  };

  const handleUpdate = (updatedRecipe) => {
    const storedRecipes = JSON.parse(
      localStorage.getItem("userCreatedRecipes") || "[]"
    );
    const updatedRecipes = storedRecipes.map((r) =>
      r.id === updatedRecipe.id ? updatedRecipe : r
    );
    localStorage.setItem("userCreatedRecipes", JSON.stringify(updatedRecipes));
    setRecipe(updatedRecipe);
    setIsUpdateModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">{error}</p>
          <Link to="/nutrition" className="text-blue-500 hover:underline">
            Return to Nutrition Page
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Recipe not found</p>
          <Link to="/nutrition" className="text-blue-500 hover:underline">
            Return to Nutrition Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center rounded-3xl -mt-5">
      <Link
        to="/nutrition"
        className="mr-4 p-2 absolute top-[130px] left-8 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-300"
      >
        <ArrowLeft size={24} className="text-gray-600" />
      </Link>
      <div className="bg-[#f5f5f5be] shadow-2xl shadow-slate-400 rounded-xl overflow-hidden flex w-full max-w-7xl h-[650px] p-5">
        {/* Left side - Image */}
        <div className="w-[35%] h-auto relative rounded-2xl overflow-hidden ">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ChefHat size={20} className="mr-2" />
                {recipe.chef}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Scrollable content */}
        <div className="w-[65%] overflow-y-auto px-8 py-2">
          {/* Recipe quick info */}

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[40px] font-bold mb-4">{recipe.title}</h1>
            {/* Update and Delete buttons */}
            <div className="flex space-x-4 -mt-5">
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="bg-blue-500 text-white text-sm px-5 py-3 rounded-3xl shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
              >
                <Edit size={20} className="mr-2" />
                Update Recipe
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white text-sm px-5 py-3 rounded-3xl shadow-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
              >
                <Trash size={20} className="mr-2" />
                Delete Recipe
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mb-8 bg-gray-50 p-4 rounded-lg shadow">
            <div className="flex items-center mb-2 mr-4">
              <Clock size={24} className="text-green-500 mr-2" />
              <span className="font-semibold">{recipe.time} mins</span>
            </div>
            <div className="flex items-center mb-2 mr-4">
              <Flame size={24} className="text-orange-500 mr-2" />
              <span className="font-semibold">{recipe.calories} cal</span>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
              {recipe.dietType}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
              {recipe.mealCategory}
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
              {recipe.difficulty}
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nutrition Facts</h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner shadow-slate-400">
              <div className="grid grid-cols-4 gap-6">
                {Object.entries(recipe.nutritionFacts).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-3xl font-bold text-green-500">
                      {value}g
                    </p>
                    <p className="text-gray-600 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2 bg-gray-50 p-6 rounded-lg shadow-inner">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <Leaf size={16} className="text-green-500 mr-2" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex bg-gray-50 p-4 rounded-lg shadow"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-4">
                    {index + 1}
                  </span>
                  <p>{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
      {isUpdateModalOpen && (
        <UpdateNutritionRecipe
          recipe={recipe}
          onUpdate={handleUpdate}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserCreatedNutritionRecipeDetail;