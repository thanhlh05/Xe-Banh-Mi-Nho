// src/systems/saveSystem.js
//
// File này chịu trách nhiệm LƯU và TẢI dữ liệu game bằng LocalStorage.
// Nó chỉ làm việc với gameState hiện tại (không tạo gameState mới),
// và không xử lý UI, DOM, hay bất kỳ logic game nào khác.

import { gameState } from "../game/gameState.js";

// Key dùng để lưu dữ liệu trong LocalStorage.
const SAVE_KEY = "xe_banh_mi_save";

// Lưu toàn bộ gameState hiện tại vào LocalStorage.
function saveGame() {
  const dataAsText = JSON.stringify(gameState);
  localStorage.setItem(SAVE_KEY, dataAsText);
}

// Tải dữ liệu đã lưu từ LocalStorage vào gameState hiện tại.
// Trả về true nếu tải thành công, false nếu chưa có dữ liệu save.
function loadGame() {
  const savedText = localStorage.getItem(SAVE_KEY);

  if (!savedText) {
    return false;
  }

  let parsedData;

  try {
    parsedData = JSON.parse(savedText);
  } catch (error) {
    throw new Error(
      "saveSystem: dữ liệu save trong LocalStorage bị lỗi, không thể đọc (JSON không hợp lệ)."
    );
  }

  // Không thay thế object gameState bằng object mới, vì các file khác
  // đang giữ tham chiếu (reference) tới đúng object gameState này.
  // Object.assign sẽ cập nhật các property của gameState bằng dữ liệu
  // đã lưu, nhưng vẫn giữ nguyên object gốc.
  Object.assign(gameState, parsedData);

  return true;
}

// Kiểm tra xem đã có dữ liệu save trong LocalStorage hay chưa.
function hasSaveGame() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

// Xóa dữ liệu save khỏi LocalStorage.
function clearSaveGame() {
  localStorage.removeItem(SAVE_KEY);
}

// Export để các file khác sử dụng.
export { saveGame, loadGame, hasSaveGame, clearSaveGame };