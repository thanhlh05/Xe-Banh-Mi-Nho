import { INGREDIENTS } from "../data/ingredients.js";

let selectedIngredients = [];
let currentRecipeId = null;

function validateIngredientId(ingredientId) {
  if (!INGREDIENTS[ingredientId]) {
    throw new Error(
      `ingredientSelectionSystem: ingredientId "${ingredientId}" không tồn tại trong INGREDIENTS.`
    );
  }
}

function setRecipe(recipeId) {
  if (typeof recipeId !== "string" || recipeId.length === 0) {
    throw new Error(
      `ingredientSelectionSystem: recipeId phải là chuỗi không rỗng, nhận được "${recipeId}".`
    );
  }

  currentRecipeId = recipeId;
  clearSelectedIngredients();
}

function getCurrentRecipeId() {
  return currentRecipeId;
}

function selectIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  if (selectedIngredients.includes(ingredientId)) {
    return getSelectedIngredients();
  }

  selectedIngredients.push(ingredientId);

  return getSelectedIngredients();
}

function removeSelectedIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  selectedIngredients = selectedIngredients.filter(
    (id) => id !== ingredientId
  );

  return getSelectedIngredients();
}

function toggleIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  if (selectedIngredients.includes(ingredientId)) {
    return removeSelectedIngredient(ingredientId);
  }

  return selectIngredient(ingredientId);
}

function getSelectedIngredients() {
  return [...selectedIngredients];
}

function hasSelectedIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  return selectedIngredients.includes(ingredientId);
}

function clearSelectedIngredients() {
  selectedIngredients = [];
}

function resetSelection() {
  selectedIngredients = [];
  currentRecipeId = null;
}

export {
  setRecipe,
  getCurrentRecipeId,
  selectIngredient,
  removeSelectedIngredient,
  toggleIngredient,
  getSelectedIngredients,
  hasSelectedIngredient,
  clearSelectedIngredients,
  resetSelection,
};