// src/systems/daySystem.js
//
// File này chỉ quản lý "ngày hiện tại" của game (gameState.day.current).
// Chưa xử lý thời gian trong ngày, chưa xử lý kết thúc ngày,
// chưa xử lý doanh thu, inventory, customer, rating hay UI.

import { gameState } from "../game/gameState.js";

// Trả về ngày hiện tại.
function getCurrentDay() {
  return gameState.day.current;
}

// Cập nhật ngày hiện tại thành một giá trị cụ thể.
// day phải là số nguyên dương.
function setCurrentDay(day) {
  const isPositiveInteger = Number.isInteger(day) && day > 0;

  if (!isPositiveInteger) {
    throw new Error(
      `daySystem: day phải là số nguyên dương, nhận được "${day}".`
    );
  }

  gameState.day.current = day;
}

// Tăng ngày hiện tại lên 1, và trả về ngày mới.
function nextDay() {
  gameState.day.current = gameState.day.current + 1;
  return gameState.day.current;
}

// Export để các file khác sử dụng.
export { getCurrentDay, setCurrentDay, nextDay };