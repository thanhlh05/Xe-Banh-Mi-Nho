// src/systems/moneySystem.js
//
// File này quản lý số tiền của người chơi (gameState.player.money)
// và tính giá bán dựa trên MENU_PRICES.
//
// File này KHÔNG xử lý inventory, order, customer, rating hay UI.

import { gameState } from "../game/gameState.js";
import { MENU_PRICES } from "../data/prices.js";

// Hàm nội bộ: kiểm tra amount có phải là số nguyên dương không.
function validatePositiveInteger(amount, paramName) {
  const isPositiveInteger = Number.isInteger(amount) && amount > 0;

  if (!isPositiveInteger) {
    throw new Error(
      `moneySystem: ${paramName} phải là số nguyên dương, nhận được "${amount}".`
    );
  }
}

// 1. Trả về số tiền hiện tại của người chơi.
function getMoney() {
  return gameState.player.money;
}

// 2. Cộng thêm amount vào số tiền hiện tại. Trả về số tiền sau khi cộng.
function addMoney(amount) {
  validatePositiveInteger(amount, "amount");

  gameState.player.money = gameState.player.money + amount;

  return gameState.player.money;
}

// 3. Trừ amount khỏi số tiền hiện tại. Trả về số tiền còn lại.
function spendMoney(amount) {
  validatePositiveInteger(amount, "amount");

  if (gameState.player.money < amount) {
    throw new Error(
      `moneySystem: không đủ tiền để chi tiêu. Hiện có ${gameState.player.money}, cần ${amount}.`
    );
  }

  gameState.player.money = gameState.player.money - amount;

  return gameState.player.money;
}

// 4. Lấy giá bán của một recipe từ MENU_PRICES.
function getRecipePrice(recipeId) {
  const price = MENU_PRICES[recipeId];

  if (price === undefined) {
    throw new Error(
      `moneySystem: recipeId "${recipeId}" không tồn tại trong MENU_PRICES.`
    );
  }

  return price;
}

// 5. Cộng tiền vào player.money dựa trên giá bán của recipe.
function earnFromRecipe(recipeId) {
  const price = getRecipePrice(recipeId);

  return addMoney(price);
}

// Export để các file khác sử dụng.
export { getMoney, addMoney, spendMoney, getRecipePrice, earnFromRecipe };