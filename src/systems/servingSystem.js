// src/systems/servingSystem.js
//
// File này chứa logic GIAO BÁNH cho khách sau khi người chơi đã làm bánh:
// kiểm tra có order hiện tại hay không, và nhận tiền từ recipe của order đó.
//
// File này CHỈ chịu trách nhiệm "giao bánh và nhận tiền".
// KHÔNG hoàn thành/xóa order (do flow controller xử lý sau).
// KHÔNG xử lý inventory, rating, customer loyalty, UI hay LocalStorage.

import { getCurrentOrder } from "../systems/orderSystem.js";
import { getRecipePrice, earnFromRecipe } from "../systems/moneySystem.js";

// 1. Kiểm tra xem có thể giao bánh cho order hiện tại hay không.
// Chỉ kiểm tra, KHÔNG thay đổi dữ liệu.
function canServeCurrentOrder() {
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    return false;
  }

  return true;
}

// 2. Giao bánh cho order hiện tại: nhận tiền từ recipe của order.
// KHÔNG gọi completeOrder(), KHÔNG sửa order.
function serveCurrentOrder() {
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    throw new Error(
      "servingSystem: không thể giao bánh vì hiện chưa có order nào đang active."
    );
  }

  const recipeId = currentOrder.recipeId;
  const price = getRecipePrice(recipeId);

  earnFromRecipe(recipeId);

  return {
    success: true,
    orderId: currentOrder.id,
    customerId: currentOrder.customerId,
    recipeId: currentOrder.recipeId,
    earnedMoney: price,
  };
}

// Export để các file khác sử dụng.
export { canServeCurrentOrder, serveCurrentOrder };