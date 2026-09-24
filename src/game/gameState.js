// src/game/gameState.js
//
// File này chứa "gameState" - nơi lưu trữ toàn bộ trạng thái của trò chơi.
// Đây là nguồn dữ liệu trung tâm (single source of truth) cho toàn bộ game.
// Các module khác (screens, systems, ...) sẽ import gameState từ đây để
// đọc hoặc thay đổi dữ liệu, thay vì tự tạo biến riêng của mình.
//
// Lưu ý: File này CHƯA xử lý LocalStorage, CHƯA có Screen Manager,
// và CHƯA có UI. Đây chỉ là bước tạo dữ liệu trạng thái cơ bản.

const gameState = {
  // Thông tin cửa hàng
  shop: {
    name: "", // Tên cửa hàng, người chơi sẽ đặt ở màn hình Shop Naming
  },

  // Thông tin người chơi
  player: {
    money: 500000, // Số tiền hiện có
    rating: 5, // Điểm đánh giá của cửa hàng (mặc định 5 sao)
  },

  // Thông tin ngày chơi hiện tại
  day: {
    current: 1, // Ngày hiện tại, bắt đầu từ ngày 1
  },

  // Kho nguyên liệu / dụng cụ
  inventory: {
    fresh: {}, // Nguyên liệu tươi (thịt, chả, pate, rau...), hết ngày sẽ bị bỏ
    consumables: {}, // Nguyên liệu dùng lâu dài (nước tương, tương ớt...), có số lượt dùng
    tools: {}, // Dụng cụ (dao, kẹp, khay...), không có độ bền trong MVP
  },

  // Công thức bánh mì
  recipes: {
    unlocked: [], // Danh sách các công thức đã được mở khóa
  },

  // Khách quen
  customers: {
    regular: [], // Danh sách khách quen: tên, số lần ghé, đơn hàng thường gọi...
  },

  // Thống kê tổng quát của toàn bộ quá trình chơi
  statistics: {
    totalRevenue: 0, // Tổng doanh thu từ trước đến giờ
    totalCustomers: 0, // Tổng số khách đã phục vụ
    totalBreadsSold: 0, // Tổng số ổ bánh mì đã bán
  },

  // Cài đặt trò chơi
  settings: {
    sound: true, // Bật/tắt âm thanh
  },
};

// Export gameState để các file khác có thể import và sử dụng.
// Ví dụ cách dùng ở file khác:
//   import { gameState } from "../game/gameState.js";
//   console.log(gameState.player.money);
export { gameState };