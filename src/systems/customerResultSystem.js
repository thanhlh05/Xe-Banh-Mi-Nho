import { RECIPES } from "../data/recipes.js";
import { MENU_PRICES } from "../data/prices.js";

const RESULT_LEVELS = {
  PERFECT: "PERFECT",
  GOOD: "GOOD",
  POOR: "POOR",
};

function validateRecipeId(recipeId) {
  if (!RECIPES[recipeId]) {
    throw new Error(
      `customerResultSystem: recipeId "${recipeId}" không tồn tại trong RECIPES.`
    );
  }
}

function validateRating(rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error(
      `customerResultSystem: rating phải là số nguyên từ 1 đến 5, nhận được "${rating}".`
    );
  }
}

function getRecipeIngredients(recipeId) {
  validateRecipeId(recipeId);
  return RECIPES[recipeId].ingredients;
}

function evaluateOrder(recipeId, selectedIngredients) {
  validateRecipeId(recipeId);

  if (!Array.isArray(selectedIngredients)) {
    throw new Error(
      "customerResultSystem: selectedIngredients phải là một mảng."
    );
  }

  const requiredIngredients = getRecipeIngredients(recipeId);

  const requiredSet = new Set(requiredIngredients);
  const selectedSet = new Set(selectedIngredients);

  let correctCount = 0;

  for (const ingredientId of requiredSet) {
    if (selectedSet.has(ingredientId)) {
      correctCount++;
    }
  }

  const missingCount = requiredSet.size - correctCount;

  let extraCount = 0;

  for (const ingredientId of selectedSet) {
    if (!requiredSet.has(ingredientId)) {
      extraCount++;
    }
  }

  let level = RESULT_LEVELS.POOR;
  let rating = 1;

  if (missingCount === 0 && extraCount === 0) {
    level = RESULT_LEVELS.PERFECT;
    rating = 5;
  } else if (correctCount > 0 && extraCount === 0) {
    level = RESULT_LEVELS.GOOD;
    rating = 3;
  }

  const basePrice = MENU_PRICES[recipeId];

  let payment = basePrice;

  if (level === RESULT_LEVELS.GOOD) {
    payment = Math.floor(basePrice * 0.7);
  }

  if (level === RESULT_LEVELS.POOR) {
    payment = Math.floor(basePrice * 0.4);
  }

  validateRating(rating);

  return {
    recipeId,
    requiredIngredients: [...requiredIngredients],
    selectedIngredients: [...selectedSet],
    correctCount,
    missingCount,
    extraCount,
    level,
    rating,
    payment,
  };
}

function calculateRating(result) {
  if (!result || typeof result !== "object") {
    throw new Error(
      "customerResultSystem: result phải là object."
    );
  }

  validateRating(result.rating);

  return result.rating;
}

function calculatePayment(result) {
  if (!result || typeof result !== "object") {
    throw new Error(
      "customerResultSystem: result phải là object."
    );
  }

  if (!Number.isInteger(result.payment) || result.payment < 0) {
    throw new Error(
      "customerResultSystem: payment phải là số nguyên không âm."
    );
  }

  return result.payment;
}

export {
  RESULT_LEVELS,
  evaluateOrder,
  calculateRating,
  calculatePayment,
};