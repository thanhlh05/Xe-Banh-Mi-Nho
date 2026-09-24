import { SHOPPING_PRICES } from "../data/shoppingPrices.js";
import { INGREDIENTS } from "../data/ingredients.js";
import { RECIPES } from "../data/recipes.js";

function validateIngredientId(itemId) {
  if (!INGREDIENTS[itemId]) {
    throw new Error(
      `ingredientCostSystem: itemId "${itemId}" không tồn tại trong INGREDIENTS.`
    );
  }

  if (SHOPPING_PRICES[itemId] === undefined) {
    throw new Error(
      `ingredientCostSystem: itemId "${itemId}" chưa có giá nguyên liệu.`
    );
  }
}

function getIngredientUnitCost(itemId) {
  validateIngredientId(itemId);

  return SHOPPING_PRICES[itemId];
}

function calculateIngredientCost(ingredientIds) {
  if (!Array.isArray(ingredientIds)) {
    throw new Error(
      "ingredientCostSystem: ingredientIds phải là một mảng."
    );
  }

  let totalCost = 0;

  for (const ingredientId of ingredientIds) {
    totalCost += getIngredientUnitCost(ingredientId);
  }

  return totalCost;
}

function calculateRecipeIngredientCost(recipeId) {
  const recipe = RECIPES[recipeId];

  if (!recipe) {
    throw new Error(
      `ingredientCostSystem: recipeId "${recipeId}" không tồn tại trong RECIPES.`
    );
  }

  return calculateIngredientCost(recipe.ingredients);
}

function calculateInventoryCost(inventory) {
  if (!inventory || typeof inventory !== "object") {
    throw new Error(
      "ingredientCostSystem: inventory phải là một object."
    );
  }

  let totalCost = 0;

  for (const [itemId, quantity] of Object.entries(inventory)) {
    validateIngredientId(itemId);

    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error(
        `ingredientCostSystem: quantity của "${itemId}" phải là số nguyên không âm.`
      );
    }

    totalCost += getIngredientUnitCost(itemId) * quantity;
  }

  return totalCost;
}

export {
  getIngredientUnitCost,
  calculateIngredientCost,
  calculateRecipeIngredientCost,
  calculateInventoryCost,
};