import { SAMPLE_ORDERS } from "../data/orders.js";
import { gameState } from "../game/gameState.js";

function ensureRuntimeGameplay() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (!gameState.runtime.gameplay) {
    gameState.runtime.gameplay = {
      currentCustomerId: null,
      currentOrderId: null,
      lastSaleResult: null,
    };
  }
}

function getOrderById(orderId) {
  const foundOrder =
    SAMPLE_ORDERS.find(
      (order) => order.id === orderId
    );

  if (!foundOrder) {
    throw new Error(
      `orderSystem: orderId "${orderId}" không tồn tại trong SAMPLE_ORDERS.`
    );
  }

  return foundOrder;
}

function createOrder(orderId) {
  const foundOrder =
    getOrderById(orderId);

  ensureRuntimeGameplay();

  gameState.runtime.gameplay.currentOrderId =
    foundOrder.id;
}

function getCurrentOrder() {
  ensureRuntimeGameplay();

  const currentOrderId =
    gameState.runtime.gameplay
      .currentOrderId;

  if (!currentOrderId) {
    return null;
  }

  return getOrderById(
    currentOrderId
  );
}

function hasCurrentOrder() {
  return getCurrentOrder() !== null;
}

function completeOrder() {
  if (!hasCurrentOrder()) {
    throw new Error(
      "orderSystem: không thể hoàn thành vì hiện chưa có order nào đang active."
    );
  }

  ensureRuntimeGameplay();

  gameState.runtime.gameplay.currentOrderId =
    null;
}

export {
  createOrder,
  getCurrentOrder,
  hasCurrentOrder,
  completeOrder,
};