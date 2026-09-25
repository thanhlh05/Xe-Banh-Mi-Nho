// src/systems/shoppingSystem.js

import { SHOPPING_PRICES } from "../data/shoppingPrices.js";
import { INGREDIENTS } from "../data/ingredients.js";
import { spendMoney } from "./moneySystem.js";
import { addItem } from "./inventorySystem.js";
import { autoSave } from "./autoSaveSystem.js";

// Kiểm tra item có tồn tại và có thể mua hay không.
function validatePurchasableItem(itemId) {
  if (!INGREDIENTS[itemId]) {
    throw new Error(
      `shoppingSystem: itemId "${itemId}" không tồn tại trong INGREDIENTS.`
    );
  }

  if (SHOPPING_PRICES[itemId] === undefined) {
    throw new Error(
      `shoppingSystem: itemId "${itemId}" chưa có giá mua trong SHOPPING_PRICES.`
    );
  }
}

// Kiểm tra số lượng mua.
function validateQuantity(quantity) {
  const isValid =
    Number.isInteger(quantity) && quantity > 0;

  if (!isValid) {
    throw new Error(
      `shoppingSystem: quantity phải là số nguyên dương, nhận được "${quantity}".`
    );
  }
}

// Lấy giá mua một item.
function getShoppingPrice(itemId) {
  validatePurchasableItem(itemId);

  return SHOPPING_PRICES[itemId];
}

// Tính tổng tiền cho một item.
function calculateItemCost(itemId, quantity) {
  validatePurchasableItem(itemId);
  validateQuantity(quantity);

  return getShoppingPrice(itemId) * quantity;
}

// Mua một item.
function buyItem(itemId, quantity) {
  const totalCost =
    calculateItemCost(itemId, quantity);

  spendMoney(totalCost);
  addItem(itemId, quantity);

  // Lưu lại sau khi giao dịch hoàn tất.
  autoSave();

  return {
    itemId,
    quantity,
    totalCost,
  };
}

// Mua nhiều item trong cùng một lần.
function buyItems(items) {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "shoppingSystem: items phải là một mảng không rỗng."
    );
  }

  let totalCost = 0;

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object"
    ) {
      throw new Error(
        "shoppingSystem: mỗi phần tử trong items phải là object."
      );
    }

    totalCost += calculateItemCost(
      item.itemId,
      item.quantity
    );
  }

  // Kiểm tra và trừ toàn bộ tiền trước khi thêm inventory.
  spendMoney(totalCost);

  for (const item of items) {
    addItem(
      item.itemId,
      item.quantity
    );
  }

  // Lưu lại sau khi toàn bộ giao dịch hoàn tất.
  autoSave();

  return {
    items: [...items],
    totalCost,
  };
}

export {
  getShoppingPrice,
  calculateItemCost,
  buyItem,
  buyItems,
};