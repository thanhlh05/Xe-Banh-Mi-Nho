// src/systems/daySummarySystem.js
//
// File này tạo bản tổng kết hoàn chỉnh của ngày hiện tại
// dựa trên dữ liệu từ statisticsSystem.
//
// File này KHÔNG xử lý UI, DOM, LocalStorage,
// chuyển ngày hoặc reset inventory.

import {
  getDayStatistics,
  calculateDayProfit,
} from "../systems/statisticsSystem.js";

import { getCurrentDay } from "../systems/daySystem.js";

// Tính rating trung bình của ngày.
function calculateAverageRating(ratings) {
  if (ratings.length === 0) {
    return 0;
  }

  const totalRating = ratings.reduce(
    (total, rating) => total + rating,
    0
  );

  return totalRating / ratings.length;
}

// Tạo bản tổng kết hoàn chỉnh của ngày hiện tại.
function getDaySummary() {
  const statistics = getDayStatistics();
  const currentDay = getCurrentDay();

  return {
    day: currentDay,

    revenue: statistics.revenue,

    ingredientCost: statistics.ingredientCost,

    profit: calculateDayProfit(),

    customers: statistics.customers,

    breadsSold: statistics.breadsSold,

    waste: { ...statistics.waste },

    ratings: [...statistics.ratings],

    averageRating: calculateAverageRating(statistics.ratings),
  };
}

export {
  getDaySummary,
  calculateAverageRating,
};