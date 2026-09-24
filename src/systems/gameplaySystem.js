import { CUSTOMERS } from "../data/customers.js";
import { SAMPLE_ORDERS } from "../data/orders.js";
import {
  startSale,
  canCompleteSale,
  completeSale,
} from "./salesSystem.js";
import {
  recordCustomer,
  recordBreadSold,
  recordSale,
  recordRating,
} from "./statisticsSystem.js";
import {
  getDayFlowState,
  DAY_FLOW_STATES,
} from "./dayFlowSystem.js";
import {
  evaluateOrder,
  calculateRating,
  calculatePayment,
} from "./customerResultSystem.js";
import { gameState } from "../game/gameState.js";

let currentCustomer = null;
let currentOrder = null;
let lastSaleResult = null;

function getCustomerById(customerId) {
  const customer = CUSTOMERS.find(
    (item) => item.id === customerId
  );

  if (!customer) {
    throw new Error(
      `gameplaySystem: customerId "${customerId}" không tồn tại.`
    );
  }

  return customer;
}

function getOrderById(orderId) {
  const order = SAMPLE_ORDERS.find(
    (item) => item.id === orderId
  );

  if (!order) {
    throw new Error(
      `gameplaySystem: orderId "${orderId}" không tồn tại.`
    );
  }

  return order;
}

function startCustomerVisit(orderId) {
  if (getDayFlowState() !== DAY_FLOW_STATES.PLAYING) {
    throw new Error(
      `gameplaySystem: không thể đón khách khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  if (currentCustomer !== null || currentOrder !== null) {
    throw new Error(
      "gameplaySystem: hiện đang có một khách hàng/order đang được xử lý."
    );
  }

  const order = getOrderById(orderId);
  const customer = getCustomerById(order.customerId);

  startSale(orderId);

  currentCustomer = customer;
  currentOrder = order;
  lastSaleResult = null;

  recordCustomer();

  return {
    customer,
    order,
  };
}

function getCurrentCustomer() {
  return currentCustomer;
}

function getCurrentGameplayOrder() {
  return currentOrder;
}

function hasActiveCustomer() {
  return currentCustomer !== null && currentOrder !== null;
}

function canFinishCurrentSale() {
  if (!hasActiveCustomer()) {
    return false;
  }

  return canCompleteSale();
}

function finishCurrentSale(selectedIngredients) {
  if (!hasActiveCustomer()) {
    throw new Error(
      "gameplaySystem: không thể hoàn thành sale vì chưa có khách hàng đang được xử lý."
    );
  }

  if (!Array.isArray(selectedIngredients)) {
    throw new Error(
      "gameplaySystem: selectedIngredients phải là một mảng."
    );
  }

  const recipeId = currentOrder.recipeId;

  const result = evaluateOrder(
    recipeId,
    selectedIngredients
  );

  const rating = calculateRating(result);
  const payment = calculatePayment(result);

  if (!canCompleteSale()) {
    throw new Error(
      "gameplaySystem: không đủ nguyên liệu để hoàn thành order hiện tại."
    );
  }

  const saleResult = completeSale();

  /*
   * completeSale() đã cộng giá đầy đủ của recipe.
   * Nếu kết quả không phải PERFECT, cần điều chỉnh lại
   * số tiền thực nhận về đúng payment đã tính.
   */
  if (payment < saleResult.earnedMoney) {
    gameState.player.money =
      gameState.player.money -
      saleResult.earnedMoney +
      payment;
  }

  recordSale(payment);
  recordBreadSold();
  recordRating(rating);

  lastSaleResult = {
    ...saleResult,
    customerName: currentCustomer.name,
    rating,
    payment,
    resultLevel: result.level,
    correctCount: result.correctCount,
    missingCount: result.missingCount,
    extraCount: result.extraCount,
  };

  currentCustomer = null;
  currentOrder = null;

  return lastSaleResult;
}

function getLastSaleResult() {
  return lastSaleResult;
}

function resetGameplay() {
  currentCustomer = null;
  currentOrder = null;
  lastSaleResult = null;
}

export {
  startCustomerVisit,
  getCurrentCustomer,
  getCurrentGameplayOrder,
  hasActiveCustomer,
  canFinishCurrentSale,
  finishCurrentSale,
  getLastSaleResult,
  resetGameplay,
};