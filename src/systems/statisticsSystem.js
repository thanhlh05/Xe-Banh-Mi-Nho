// src/systems/statisticsSystem.js
//
// File này quản lý thống kê của NGÀY HIỆN TẠI (doanh thu, chi phí nguyên liệu,
// số khách, số bánh bán, waste, ratings).
//
// File này KHÔNG xử lý UI, màn hình tổng kết, LocalStorage, chuyển ngày,
// reset nguyên liệu, rating UI hay customer UI.

// Cấu trúc thống kê mặc định cho một ngày.
function createEmptyDayStatistics() {
  return {
    revenue: 0,
    ingredientCost: 0,
    customers: 0,
    breadsSold: 0,
    waste: {},
    ratings: [],
  };
}

// Biến module-level lưu thống kê ngày hiện tại.
let dayStatistics = createEmptyDayStatistics();

// Kiểm tra amount có phải số nguyên không âm.
function validateNonNegativeInteger(value, paramName) {
  const isValid = Number.isInteger(value) && value >= 0;

  if (!isValid) {
    throw new Error(
      `statisticsSystem: ${paramName} phải là số nguyên không âm, nhận được "${value}".`
    );
  }
}

// Kiểm tra amount có phải số nguyên dương.
function validatePositiveInteger(value, paramName) {
  const isValid = Number.isInteger(value) && value > 0;

  if (!isValid) {
    throw new Error(
      `statisticsSystem: ${paramName} phải là số nguyên dương, nhận được "${value}".`
    );
  }
}

// 1. Bắt đầu thống kê cho ngày mới (khởi tạo về trạng thái rỗng).
function startDayStatistics() {
  dayStatistics = createEmptyDayStatistics();
}

// 2. Ghi nhận doanh thu từ một lần bán.
function recordSale(revenue) {
  validateNonNegativeInteger(revenue, "revenue");
  dayStatistics.revenue = dayStatistics.revenue + revenue;
}

// 3. Ghi nhận thêm 1 khách hàng.
function recordCustomer() {
  dayStatistics.customers = dayStatistics.customers + 1;
}

// 4. Ghi nhận thêm 1 ổ bánh mì đã bán.
function recordBreadSold() {
  dayStatistics.breadsSold = dayStatistics.breadsSold + 1;
}

// 5. Ghi nhận chi phí nguyên liệu.
function recordIngredientCost(cost) {
  validateNonNegativeInteger(cost, "cost");
  dayStatistics.ingredientCost = dayStatistics.ingredientCost + cost;
}

// 6. Ghi nhận nguyên liệu bị bỏ đi (waste).
function recordWaste(itemId, quantity) {
  if (typeof itemId !== "string" || itemId.length === 0) {
    throw new Error(
      `statisticsSystem: itemId phải là chuỗi không rỗng, nhận được "${itemId}".`
    );
  }

  validatePositiveInteger(quantity, "quantity");

  if (dayStatistics.waste[itemId] === undefined) {
    dayStatistics.waste[itemId] = 0;
  }

  dayStatistics.waste[itemId] = dayStatistics.waste[itemId] + quantity;
}

// 7. Ghi nhận một điểm rating từ khách.
function recordRating(rating) {
  const isValidRating =
    Number.isInteger(rating) && rating >= 1 && rating <= 5;

  if (!isValidRating) {
    throw new Error(
      `statisticsSystem: rating phải là số nguyên từ 1 đến 5, nhận được "${rating}".`
    );
  }

  dayStatistics.ratings.push(rating);
}

// 8. Trả về bản sao thống kê ngày hiện tại (không cho phép sửa trực tiếp).
function getDayStatistics() {
  return {
    revenue: dayStatistics.revenue,
    ingredientCost: dayStatistics.ingredientCost,
    customers: dayStatistics.customers,
    breadsSold: dayStatistics.breadsSold,
    waste: { ...dayStatistics.waste },
    ratings: [...dayStatistics.ratings],
  };
}

// 9. Tính lợi nhuận ngày: revenue - ingredientCost.
function calculateDayProfit() {
  return dayStatistics.revenue - dayStatistics.ingredientCost;
}

// 10. Reset thống kê ngày về trạng thái rỗng.
function resetDayStatistics() {
  dayStatistics = createEmptyDayStatistics();
}

// Export để các file khác sử dụng.
export {
  startDayStatistics,
  recordSale,
  recordCustomer,
  recordBreadSold,
  recordIngredientCost,
  recordWaste,
  recordRating,
  getDayStatistics,
  calculateDayProfit,
  resetDayStatistics,
};