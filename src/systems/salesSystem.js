// src/systems/salesSystem.js
//
// File này tạo flow BÁN HÀNG hoàn chỉnh bằng cách kết hợp các system hiện có:
// order → làm bánh → giao bánh → hoàn thành order.
//
// File này KHÔNG tự viết lại logic inventory, money hay order.
// KHÔNG xử lý rating, customer loyalty, day/time, UI hay LocalStorage.

import { createOrder, getCurrentOrder, completeOrder } from "../systems/orderSystem.js";
import { canMakeRecipe, makeRecipe } from "../systems/cookingSystem.js";
import { serveCurrentOrder } from "../systems/servingSystem.js";

// 1. Bắt đầu một giao dịch bán hàng với orderId cho trước.
// Nếu đã có order đang active thì throw Error.
function startSale(orderId) {
  const currentOrder = getCurrentOrder();

  if (currentOrder) {
    throw new Error(
      "salesSystem: không thể bắt đầu sale mới vì vẫn còn order đang active."
    );
  }

  createOrder(orderId);

  return getCurrentOrder();
}

// 2. Kiểm tra xem có thể hoàn thành sale hiện tại hay không.
// Chỉ kiểm tra, KHÔNG thay đổi inventory hoặc order.
function canCompleteSale() {
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    return false;
  }

  return canMakeRecipe(currentOrder.recipeId);
}

// 3. Hoàn thành sale: làm bánh → giao bánh → complete order.
// Nếu không đủ nguyên liệu thì throw Error (không trừ inventory, không nhận tiền).
function completeSale() {
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    throw new Error(
      "salesSystem: không thể hoàn thành sale vì hiện chưa có order nào đang active."
    );
  }

  const recipeId = currentOrder.recipeId;

  if (!canMakeRecipe(recipeId)) {
    throw new Error(
      `salesSystem: không đủ nguyên liệu để hoàn thành sale cho recipe "${recipeId}".`
    );
  }

  // 1. Làm bánh (trừ nguyên liệu)
  makeRecipe(recipeId);

  // 2. Giao bánh và nhận tiền
  const serveResult = serveCurrentOrder();

  // 3. Hoàn thành / xóa order
  completeOrder();

  return serveResult;
}

// Export để các file khác sử dụng.
export { startSale, canCompleteSale, completeSale };