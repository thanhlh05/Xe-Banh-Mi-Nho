import { gameState } from "../game/gameState.js";
import { RECIPES } from "../data/recipes.js";

const RECIPE_UNLOCK_DAYS = {
  plain: 1,
  meat: 1,
  cha: 1,
  egg: 1,
  pate: 3,
  special: 5,
};

function validateRecipeId(recipeId) {
  if (!RECIPES[recipeId]) {
    throw new Error(
      `recipeUnlockSystem: recipeId "${recipeId}" không tồn tại trong RECIPES.`
    );
  }
}

function getUnlockDay(recipeId) {
  validateRecipeId(recipeId);

  return RECIPE_UNLOCK_DAYS[recipeId] || 1;
}

function isRecipeUnlocked(recipeId) {
  validateRecipeId(recipeId);

  return gameState.recipes.unlocked.includes(recipeId);
}

function canUnlockRecipe(recipeId) {
  validateRecipeId(recipeId);

  const requiredDay = getUnlockDay(recipeId);

  return (
    gameState.day.current >= requiredDay &&
    !isRecipeUnlocked(recipeId)
  );
}

function unlockRecipe(recipeId) {
  validateRecipeId(recipeId);

  if (isRecipeUnlocked(recipeId)) {
    return false;
  }

  if (!canUnlockRecipe(recipeId)) {
    throw new Error(
      `recipeUnlockSystem: chưa thể mở khóa "${recipeId}". ` +
        `Cần đến ngày ${getUnlockDay(recipeId)}.`
    );
  }

  gameState.recipes.unlocked.push(recipeId);

  return true;
}

function getUnlockedRecipes() {
  return [...gameState.recipes.unlocked];
}

function getAvailableRecipes() {
  return Object.keys(RECIPES).filter((recipeId) =>
    isRecipeUnlocked(recipeId)
  );
}

function resetRecipeUnlocks() {
  gameState.recipes.unlocked = [
    "plain",
    "meat",
    "cha",
    "egg",
  ];
}

export {
  getUnlockDay,
  isRecipeUnlocked,
  canUnlockRecipe,
  unlockRecipe,
  getUnlockedRecipes,
  getAvailableRecipes,
  resetRecipeUnlocks,
};