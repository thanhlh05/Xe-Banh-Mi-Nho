// src/game/screenManager.js
//
// File này chịu trách nhiệm quản lý "màn hình hiện tại" của game
// (ví dụ: đang ở Main Menu, hay đang ở Gameplay, ...).
//
// Đây CHƯA phải là nơi vẽ giao diện. File này KHÔNG đụng vào DOM,
// KHÔNG dùng document hay innerHTML. Nó chỉ lưu và kiểm tra trạng thái
// "màn hình nào đang được chọn", để các file khác (ví dụ file vẽ UI sau này)
// có thể dựa vào đó để biết cần hiển thị gì.

// Danh sách toàn bộ Screen ID hợp lệ trong game.
// Dùng object đơn giản (key = value) để dễ đọc và tránh gõ sai tên màn hình
// bằng tay ở nhiều nơi trong code (thay vì gõ chuỗi "MAIN_MENU" mỗi lần,
// ta dùng SCREEN_IDS.MAIN_MENU).
const SCREEN_IDS = {
  MAIN_MENU: "MAIN_MENU",
  SHOP_NAMING: "SHOP_NAMING",
  INITIAL_SHOPPING: "INITIAL_SHOPPING",
  PREPARATION: "PREPARATION",
  GAMEPLAY: "GAMEPLAY",
  ORDER: "ORDER",
  MAKE_BREAD: "MAKE_BREAD",
  SERVING_RESULT: "SERVING_RESULT",
  DAY_SUMMARY: "DAY_SUMMARY",
  SETTINGS: "SETTINGS",
};

// Biến lưu màn hình đang được hiển thị hiện tại.
// Mặc định khi game khởi động là Main Menu.
let currentScreen = SCREEN_IDS.MAIN_MENU;

// Hàm chuyển sang một màn hình khác.
// - screenId: chuỗi đại diện cho màn hình muốn chuyển tới (nên truyền vào
//   dưới dạng SCREEN_IDS.TEN_MAN_HINH để tránh gõ sai).
function showScreen(screenId) {
  // Kiểm tra xem screenId có phải là một trong các giá trị hợp lệ
  // được định nghĩa trong SCREEN_IDS hay không.
  const isValidScreen = Object.values(SCREEN_IDS).includes(screenId);

  if (!isValidScreen) {
    throw new Error(
      `screenManager: "${screenId}" không phải là Screen ID hợp lệ. ` +
        `Hãy dùng một trong các giá trị của SCREEN_IDS.`
    );
  }

  currentScreen = screenId;
}

// Hàm trả về Screen ID hiện tại.
function getCurrentScreen() {
  return currentScreen;
}

// Export để các file khác có thể sử dụng.
// Ví dụ cách dùng ở file khác:
//   import { SCREEN_IDS, showScreen, getCurrentScreen } from "./screenManager.js";
//   showScreen(SCREEN_IDS.PREPARATION);
//   console.log(getCurrentScreen()); // "PREPARATION"
export { SCREEN_IDS, showScreen, getCurrentScreen };