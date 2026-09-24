// src/systems/inventorySystem.js
//
// File này chứa các hàm để THÊM, XÓA, và KIỂM TRA số lượng nguyên liệu
// trong gameState.inventory.
//
// Hệ thống này KHÔNG tự định nghĩa danh sách nguyên liệu - nó luôn dựa vào
// INGREDIENTS (src/data/ingredients.js) để biết một itemId có tồn tại hay
// không, và category của nó là gì (fresh hay consumable).
//
// File này KHÔNG xử lý UI, KHÔNG xử lý tiền, KHÔNG xử lý công thức món ăn.

import { gameState } from "../game/gameState.js";
import { INGREDIENTS } from "../data/ingredients.js";

// Hàm nội bộ: dựa vào category của item để trả về đúng object
// trong gameState.inventory (fresh hoặc consumables).
// Đây chỉ là hàm phụ trợ, không export ra ngoài.
function getInventoryBucket(itemId) {
  const category = INGREDIENTS[itemId].category;

  if (category === "fresh") {
    return gameState.inventory.fresh;
  }

  if (category === "consumable") {
    return gameState.inventory.consumables;
  }

  // Trường hợp này không nên xảy ra với dữ liệu hiện tại,
  // nhưng vẫn báo lỗi rõ ràng nếu category không hợp lệ.
  throw new Error(
    `inventorySystem: category "${category}" của item "${itemId}" không được hỗ trợ.`
  );
}

// Hàm nội bộ: kiểm tra itemId có tồn tại trong INGREDIENTS không.
function validateItemId(itemId) {
  if (!INGREDIENTS[itemId]) {
    throw new Error(
      `inventorySystem: itemId "${itemId}" không tồn tại trong INGREDIENTS.`
    );
  }
}

// Hàm nội bộ: kiểm tra quantity có phải là số nguyên dương không.
function validateQuantity(quantity) {
  const isPositiveInteger = Number.isInteger(quantity) && quantity > 0;

  if (!isPositiveInteger) {
    throw new Error(
      `inventorySystem: quantity phải là số nguyên dương, nhận được "${quantity}".`
    );
  }
}

// 1. Thêm quantity vào inventory của itemId.
function addItem(itemId, quantity) {
  validateItemId(itemId);
  validateQuantity(quantity);

  const bucket = getInventoryBucket(itemId);

  // Nếu item chưa có trong inventory thì mặc định là 0.
  const currentQuantity = bucket[itemId] || 0;

  bucket[itemId] = currentQuantity + quantity;
}

// 2. Xóa quantity khỏi inventory của itemId.
function removeItem(itemId, quantity) {
  validateItemId(itemId);
  validateQuantity(quantity);

  const bucket = getInventoryBucket(itemId);
  const currentQuantity = bucket[itemId] || 0;

  if (currentQuantity < quantity) {
    throw new Error(
      `inventorySystem: không đủ "${itemId}" để xóa. ` +
        `Hiện có ${currentQuantity}, yêu cầu xóa ${quantity}.`
    );
  }

  bucket[itemId] = currentQuantity - quantity;
}

// 3. Trả về số lượng hiện tại của itemId.
function getItemQuantity(itemId) {
  validateItemId(itemId);

  const bucket = getInventoryBucket(itemId);

  return bucket[itemId] || 0;
}

// 4. Kiểm tra inventory có đủ quantity hay không.
function hasItem(itemId, quantity) {
  validateItemId(itemId);
  validateQuantity(quantity);

  const currentQuantity = getItemQuantity(itemId);

  return currentQuantity >= quantity;
}

// Export để các file khác sử dụng.
export { addItem, removeItem, getItemQuantity, hasItem };