// src/systems/cookingSystem.js
//
// File này chứa logic LÀM BÁNH MÌ: kiểm tra recipe có đủ nguyên liệu
// trong inventory hay không, và tiêu thụ nguyên liệu khi làm bánh.
//
// File này KHÔNG xử lý money, rating, customer, order hay UI.

import { RECIPES } from "../data/recipes.js";
import { getItemQuantity, removeItem, hasItem } from "../systems/inventorySystem.js";

// 1. Lấy danh sách ingredients của một recipe.
function getRecipeIngredients(recipeId) {
  const recipe = RECIPES[recipeId];

  if (!recipe) {
    throw new Error(
      `cookingSystem: recipeId "${recipeId}" không tồn tại trong RECIPES.`
    );
  }

  return recipe.ingredients;
}

// 2. Kiểm tra xem có đủ nguyên liệu để làm recipe hay không.
// Chỉ kiểm tra, KHÔNG thay đổi inventory.
function canMakeRecipe(recipeId) {
  const ingredients = getRecipeIngredients(recipeId);

  for (const ingredientId of ingredients) {
    if (!hasItem(ingredientId, 1)) {
      return false;
    }
  }

  return true;
}

// 3. Trả về danh sách các ingredientId đang bị thiếu để làm recipe.
// Chỉ kiểm tra, KHÔNG thay đổi inventory.
function getMissingIngredients(recipeId) {
  const ingredients = getRecipeIngredients(recipeId);
  const missing = [];

  for (const ingredientId of ingredients) {
    if (!hasItem(ingredientId, 1)) {
      missing.push(ingredientId);
    }
  }

  return missing;
}

// 4. Làm bánh mì theo recipe: tiêu thụ nguyên liệu (mỗi loại 1 đơn vị).
function makeRecipe(recipeId) {
  const ingredients = getRecipeIngredients(recipeId);

  if (!canMakeRecipe(recipeId)) {
    throw new Error(
      `cookingSystem: không đủ nguyên liệu để làm recipe "${recipeId}".`
    );
  }

  // Đã kiểm tra đủ nguyên liệu ở trên, nên vòng lặp trừ nguyên liệu
  // dưới đây có thể thực hiện an toàn cho từng ingredient.
  for (const ingredientId of ingredients) {
    removeItem(ingredientId, 1);
  }

  return {
    recipeId,
    success: true,
  };
}

// Export để các file khác sử dụng.
export { getRecipeIngredients, canMakeRecipe, getMissingIngredients, makeRecipe };