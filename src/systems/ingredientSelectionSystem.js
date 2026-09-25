import { INGREDIENTS } from "../data/ingredients.js";
import { gameState } from "../game/gameState.js";
import { autoSave } from "./autoSaveSystem.js";

function ensureRuntimeSelection() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (!gameState.runtime.ingredientSelection) {
    gameState.runtime.ingredientSelection = {
      currentRecipeId: null,
      selectedIngredients: [],
    };
  }

  if (
    !Array.isArray(
      gameState.runtime.ingredientSelection
        .selectedIngredients
    )
  ) {
    gameState.runtime.ingredientSelection
      .selectedIngredients = [];
  }
}

function validateIngredientId(ingredientId) {
  if (!INGREDIENTS[ingredientId]) {
    throw new Error(
      `ingredientSelectionSystem: ingredientId "${ingredientId}" không tồn tại trong INGREDIENTS.`
    );
  }
}

function setRecipe(recipeId) {
  if (
    typeof recipeId !== "string" ||
    recipeId.length === 0
  ) {
    throw new Error(
      `ingredientSelectionSystem: recipeId phải là chuỗi không rỗng, nhận được "${recipeId}".`
    );
  }

  ensureRuntimeSelection();

  gameState.runtime.ingredientSelection.currentRecipeId =
    recipeId;

  clearSelectedIngredients();
}

function getCurrentRecipeId() {
  ensureRuntimeSelection();

  return gameState.runtime.ingredientSelection
    .currentRecipeId;
}

function selectIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  ensureRuntimeSelection();

  const selectedIngredients =
    gameState.runtime.ingredientSelection
      .selectedIngredients;

  if (
    selectedIngredients.includes(
      ingredientId
    )
  ) {
    return getSelectedIngredients();
  }

  selectedIngredients.push(
    ingredientId
  );

  return getSelectedIngredients();
}

function removeSelectedIngredient(
  ingredientId
) {
  validateIngredientId(ingredientId);

  ensureRuntimeSelection();

  gameState.runtime.ingredientSelection
    .selectedIngredients =
    gameState.runtime.ingredientSelection
      .selectedIngredients.filter(
        (id) => id !== ingredientId
      );

  return getSelectedIngredients();
}

function toggleIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  ensureRuntimeSelection();

  let result;

  if (
    gameState.runtime.ingredientSelection
      .selectedIngredients.includes(
        ingredientId
      )
  ) {
    result = removeSelectedIngredient(
      ingredientId
    );
  } else {
    result = selectIngredient(
      ingredientId
    );
  }

  autoSave();

  return result;
}

function getSelectedIngredients() {
  ensureRuntimeSelection();

  return [
    ...gameState.runtime.ingredientSelection
      .selectedIngredients,
  ];
}

function hasSelectedIngredient(ingredientId) {
  validateIngredientId(ingredientId);

  return getSelectedIngredients()
    .includes(ingredientId);
}

function clearSelectedIngredients() {
  ensureRuntimeSelection();

  gameState.runtime.ingredientSelection
    .selectedIngredients = [];
}

function resetSelection() {
  ensureRuntimeSelection();

  gameState.runtime.ingredientSelection
    .selectedIngredients = [];

  gameState.runtime.ingredientSelection
    .currentRecipeId = null;
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