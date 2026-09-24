// src/systems/endDaySystem.js
//
// File này xử lý các hành động liên quan đến KẾT THÚC NGÀY.
//
// Quy tắc:
// - Fresh ingredients còn lại sẽ trở thành waste.
// - Fresh ingredients sau đó được xóa khỏi inventory.
// - Consumables không bị xóa.
// - Tools không bị xóa.
//
// File này KHÔNG xử lý UI, LocalStorage,
// chuyển sang ngày tiếp theo hoặc Day Summary.

import { gameState } from "../game/gameState.js";
import { INGREDIENTS } from "../data/ingredients.js";
import { recordWaste } from "./statisticsSystem.js";

// Xử lý toàn bộ fresh ingredients còn lại khi ngày kết thúc.
function discardFreshIngredients() {
  const freshInventory = gameState.inventory.fresh;

  for (const itemId of Object.keys(freshInventory)) {
    const quantity = freshInventory[itemId];

    if (quantity > 0) {
      recordWaste(itemId, quantity);
    }

    delete freshInventory[itemId];
  }
}

// Kiểm tra inventory fresh hiện còn những gì.
function getRemainingFreshIngredients() {
  return { ...gameState.inventory.fresh };
}

// Kiểm tra một item có phải fresh ingredient hay không.
function isFreshIngredient(itemId) {
  const ingredient = INGREDIENTS[itemId];

  if (!ingredient) {
    throw new Error(
      `endDaySystem: itemId "${itemId}" không tồn tại trong INGREDIENTS.`
    );
  }

  return ingredient.category === "fresh";
}

export {
  discardFreshIngredients,
  getRemainingFreshIngredients,
  isFreshIngredient,
};