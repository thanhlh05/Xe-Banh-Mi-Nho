import { gameState } from "../game/gameState.js";

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

function ensureRuntimeStatistics() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (!gameState.runtime.dayStatistics) {
    gameState.runtime.dayStatistics =
      createEmptyDayStatistics();
  }

  if (
    typeof gameState.runtime.dayStatistics
      .revenue !== "number"
  ) {
    gameState.runtime.dayStatistics.revenue =
      0;
  }

  if (
    typeof gameState.runtime.dayStatistics
      .ingredientCost !== "number"
  ) {
    gameState.runtime.dayStatistics
      .ingredientCost = 0;
  }

  if (
    typeof gameState.runtime.dayStatistics
      .customers !== "number"
  ) {
    gameState.runtime.dayStatistics
      .customers = 0;
  }

  if (
    typeof gameState.runtime.dayStatistics
      .breadsSold !== "number"
  ) {
    gameState.runtime.dayStatistics
      .breadsSold = 0;
  }

  if (
    !gameState.runtime.dayStatistics.waste ||
    typeof gameState.runtime.dayStatistics.waste !==
      "object"
  ) {
    gameState.runtime.dayStatistics.waste =
      {};
  }

  if (
    !Array.isArray(
      gameState.runtime.dayStatistics
        .ratings
    )
  ) {
    gameState.runtime.dayStatistics
      .ratings = [];
  }
}

function validateNonNegativeInteger(
  value,
  paramName
) {
  const isValid =
    Number.isInteger(value) &&
    value >= 0;

  if (!isValid) {
    throw new Error(
      `statisticsSystem: ${paramName} phải là số nguyên không âm, nhận được "${value}".`
    );
  }
}

function validatePositiveInteger(
  value,
  paramName
) {
  const isValid =
    Number.isInteger(value) &&
    value > 0;

  if (!isValid) {
    throw new Error(
      `statisticsSystem: ${paramName} phải là số nguyên dương, nhận được "${value}".`
    );
  }
}

function startDayStatistics() {
  gameState.runtime.dayStatistics =
    createEmptyDayStatistics();
}

function recordSale(revenue) {
  validateNonNegativeInteger(
    revenue,
    "revenue"
  );

  ensureRuntimeStatistics();

  gameState.runtime.dayStatistics
    .revenue += revenue;
}

function recordCustomer() {
  ensureRuntimeStatistics();

  gameState.runtime.dayStatistics
    .customers += 1;
}

function recordBreadSold() {
  ensureRuntimeStatistics();

  gameState.runtime.dayStatistics
    .breadsSold += 1;
}

function recordIngredientCost(cost) {
  validateNonNegativeInteger(
    cost,
    "cost"
  );

  ensureRuntimeStatistics();

  gameState.runtime.dayStatistics
    .ingredientCost += cost;
}

function recordWaste(
  itemId,
  quantity
) {
  if (
    typeof itemId !== "string" ||
    itemId.length === 0
  ) {
    throw new Error(
      `statisticsSystem: itemId phải là chuỗi không rỗng, nhận được "${itemId}".`
    );
  }

  validatePositiveInteger(
    quantity,
    "quantity"
  );

  ensureRuntimeStatistics();

  if (
    gameState.runtime.dayStatistics
      .waste[itemId] === undefined
  ) {
    gameState.runtime.dayStatistics
      .waste[itemId] = 0;
  }

  gameState.runtime.dayStatistics
    .waste[itemId] += quantity;
}

function recordRating(rating) {
  const isValidRating =
    Number.isInteger(rating) &&
    rating >= 1 &&
    rating <= 5;

  if (!isValidRating) {
    throw new Error(
      `statisticsSystem: rating phải là số nguyên từ 1 đến 5, nhận được "${rating}".`
    );
  }

  ensureRuntimeStatistics();

  gameState.runtime.dayStatistics
    .ratings.push(rating);
}

function getDayStatistics() {
  ensureRuntimeStatistics();

  const statistics =
    gameState.runtime.dayStatistics;

  return {
    revenue: statistics.revenue,
    ingredientCost:
      statistics.ingredientCost,
    customers: statistics.customers,
    breadsSold: statistics.breadsSold,
    waste: {
      ...statistics.waste,
    },
    ratings: [
      ...statistics.ratings,
    ],
  };
}

function calculateDayProfit() {
  ensureRuntimeStatistics();

  return (
    gameState.runtime.dayStatistics
      .revenue -
    gameState.runtime.dayStatistics
      .ingredientCost
  );
}

function resetDayStatistics() {
  ensureRuntimeStatistics();

  gameState.runtime.dayStatistics =
    createEmptyDayStatistics();
}

export {
  createEmptyDayStatistics,
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