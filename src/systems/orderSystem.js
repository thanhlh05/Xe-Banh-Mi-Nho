// src/systems/orderSystem.js
//
// File này quản lý "đơn hàng hiện tại" (current order) của game.
// Nó dùng dữ liệu mẫu SAMPLE_ORDERS để tạo order, và lưu order đang
// active trong một biến module-level đơn giản (chưa lưu vào gameState).
//
// File này KHÔNG xử lý inventory, tiền, rating, UI hay LocalStorage.

import { SAMPLE_ORDERS } from "../data/orders.js";

// Biến lưu order hiện tại. Mặc định chưa có order nào (null).
let currentOrder = null;

// 1. Tạo order hiện tại dựa vào orderId, lấy dữ liệu từ SAMPLE_ORDERS.
function createOrder(orderId) {
  const foundOrder = SAMPLE_ORDERS.find((order) => order.id === orderId);

  if (!foundOrder) {
    throw new Error(
      `orderSystem: orderId "${orderId}" không tồn tại trong SAMPLE_ORDERS.`
    );
  }

  // Lưu trực tiếp order tìm được, không tạo bản sao (copy) không cần thiết.
  currentOrder = foundOrder;
}

// 2. Trả về order hiện tại. Nếu chưa có thì trả về null.
function getCurrentOrder() {
  return currentOrder;
}

// 3. Kiểm tra xem có đang tồn tại order hiện tại hay không.
function hasCurrentOrder() {
  return currentOrder !== null;
}

// 4. Hoàn thành order hiện tại: xóa order khỏi bộ nhớ (đặt lại về null).
function completeOrder() {
  if (currentOrder === null) {
    throw new Error(
      "orderSystem: không thể hoàn thành vì hiện chưa có order nào đang active."
    );
  }

  currentOrder = null;
}

// Export để các file khác sử dụng.
export { createOrder, getCurrentOrder, hasCurrentOrder, completeOrder };