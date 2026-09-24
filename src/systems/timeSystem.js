// src/systems/timeSystem.js
//
// File này quản lý thời gian trong một ngày bán hàng (06:00 - 22:00).
// Thời gian được lưu trong biến module-level, chưa liên quan đến
// gameState, UI, hay timer tự động (setInterval/setTimeout).

// Giờ bắt đầu và kết thúc của một ngày bán hàng.
const DAY_START_HOUR = 6;
const DAY_END_HOUR = 22;

// Biến lưu thời gian hiện tại. Mặc định bắt đầu lúc 06:00.
let currentHour = DAY_START_HOUR;
let currentMinute = 0;

// 1. Trả về thời gian hiện tại dưới dạng { hour, minute }.
function getCurrentTime() {
  return {
    hour: currentHour,
    minute: currentMinute,
  };
}

// 2. Cập nhật thời gian hiện tại thành một giờ/phút cụ thể.
function setCurrentTime(hour, minute) {
  const isValidHour = Number.isInteger(hour) && hour >= 0 && hour <= 23;
  const isValidMinute = Number.isInteger(minute) && minute >= 0 && minute <= 59;

  if (!isValidHour) {
    throw new Error(
      `timeSystem: hour phải là số nguyên từ 0 đến 23, nhận được "${hour}".`
    );
  }

  if (!isValidMinute) {
    throw new Error(
      `timeSystem: minute phải là số nguyên từ 0 đến 59, nhận được "${minute}".`
    );
  }

  currentHour = hour;
  currentMinute = minute;
}

// 3. Tăng thời gian hiện tại thêm một số phút.
// Nếu vượt quá 22:00 thì giữ ở đúng 22:00.
function advanceTime(minutes) {
  const isPositiveInteger = Number.isInteger(minutes) && minutes > 0;

  if (!isPositiveInteger) {
    throw new Error(
      `timeSystem: minutes phải là số nguyên dương, nhận được "${minutes}".`
    );
  }

  // Đổi thời gian hiện tại và thời gian kết thúc ngày sang tổng số phút
  // (tính từ 00:00) để dễ so sánh và cộng dồn.
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const dayEndTotalMinutes = DAY_END_HOUR * 60;

  let newTotalMinutes = currentTotalMinutes + minutes;

  // Không cho thời gian vượt quá 22:00.
  if (newTotalMinutes > dayEndTotalMinutes) {
    newTotalMinutes = dayEndTotalMinutes;
  }

  currentHour = Math.floor(newTotalMinutes / 60);
  currentMinute = newTotalMinutes % 60;

  return {
    hour: currentHour,
    minute: currentMinute,
  };
}

// 4. Kiểm tra xem ngày đã kết thúc chưa (thời gian hiện tại >= 22:00).
function isDayEnded() {
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const dayEndTotalMinutes = DAY_END_HOUR * 60;

  return currentTotalMinutes >= dayEndTotalMinutes;
}

// 5. Đặt lại thời gian về đầu ngày (06:00).
function resetDayTime() {
  currentHour = DAY_START_HOUR;
  currentMinute = 0;

  return {
    hour: currentHour,
    minute: currentMinute,
  };
}

// Export để các file khác sử dụng.
export { getCurrentTime, setCurrentTime, advanceTime, isDayEnded, resetDayTime };