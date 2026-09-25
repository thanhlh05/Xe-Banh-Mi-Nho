import { SAMPLE_ORDERS } from "../data/orders.js";

import {
  getDayFlowState,
  DAY_FLOW_STATES,
} from "./dayFlowSystem.js";

import { gameState } from "../game/gameState.js";

function ensureRuntimeQueue() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (!gameState.runtime.customerQueue) {
    gameState.runtime.customerQueue = {
      day: gameState.day.current,
      orders: [],
      currentIndex: -1,
    };
  }

  if (
    !Number.isInteger(
      gameState.runtime.customerQueue.day
    )
  ) {
    gameState.runtime.customerQueue.day =
      gameState.day.current;
  }

  if (
    !Array.isArray(
      gameState.runtime.customerQueue.orders
    )
  ) {
    gameState.runtime.customerQueue.orders = [];
  }

  if (
    !Number.isInteger(
      gameState.runtime.customerQueue.currentIndex
    )
  ) {
    gameState.runtime.customerQueue.currentIndex = -1;
  }
}

function validateOrderId(orderId) {
  const foundOrder = SAMPLE_ORDERS.find(
    (order) => order.id === orderId
  );

  if (!foundOrder) {
    throw new Error(
      `customerQueueSystem: orderId "${orderId}" không tồn tại trong SAMPLE_ORDERS.`
    );
  }
}

function createQueue(orderIds) {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PLAYING
  ) {
    throw new Error(
      `customerQueueSystem: không thể tạo queue khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  if (
    !Array.isArray(orderIds) ||
    orderIds.length === 0
  ) {
    throw new Error(
      "customerQueueSystem: orderIds phải là một mảng không rỗng."
    );
  }

  for (const orderId of orderIds) {
    validateOrderId(orderId);
  }

  ensureRuntimeQueue();

  gameState.runtime.customerQueue.day =
    gameState.day.current;

  gameState.runtime.customerQueue.orders = [
    ...orderIds,
  ];

  gameState.runtime.customerQueue.currentIndex =
    -1;

  return getQueue();
}

function getQueue() {
  ensureRuntimeQueue();

  return [
    ...gameState.runtime.customerQueue.orders,
  ];
}

function getQueueLength() {
  return getQueue().length;
}

function getCurrentQueueIndex() {
  ensureRuntimeQueue();

  return gameState.runtime.customerQueue
    .currentIndex;
}

function hasWaitingCustomer() {
  ensureRuntimeQueue();

  return (
    getCurrentQueueIndex() + 1 <
    getQueueLength()
  );
}

function getNextOrderId() {
  if (!hasWaitingCustomer()) {
    return null;
  }

  const nextIndex =
    getCurrentQueueIndex() + 1;

  return getQueue()[nextIndex];
}

function moveToNextCustomer() {
  if (!hasWaitingCustomer()) {
    return null;
  }

  ensureRuntimeQueue();

  gameState.runtime.customerQueue.currentIndex +=
    1;

  return getCurrentOrderId();
}

function getCurrentOrderId() {
  ensureRuntimeQueue();

  const currentIndex =
    getCurrentQueueIndex();

  if (currentIndex < 0) {
    return null;
  }

  return getQueue()[currentIndex] || null;
}

function isQueueFinished() {
  const queueLength =
    getQueueLength();

  if (queueLength === 0) {
    return false;
  }

  return (
    getCurrentQueueIndex() >=
    queueLength - 1
  );
}

function clearQueue() {
  ensureRuntimeQueue();

  gameState.runtime.customerQueue.orders =
    [];

  gameState.runtime.customerQueue.currentIndex =
    -1;

  gameState.runtime.customerQueue.day =
    gameState.day.current;
}

function getQueueStatus() {
  ensureRuntimeQueue();

  return {
    day:
      gameState.runtime.customerQueue.day,

    queue: getQueue(),

    totalCustomers:
      getQueueLength(),

    currentIndex:
      getCurrentQueueIndex(),

    currentOrderId:
      getCurrentOrderId(),

    nextOrderId:
      getNextOrderId(),

    hasWaitingCustomer:
      hasWaitingCustomer(),

    finished:
      isQueueFinished(),
  };
}

export {
  createQueue,
  getQueue,
  getQueueLength,
  getCurrentQueueIndex,
  hasWaitingCustomer,
  getNextOrderId,
  moveToNextCustomer,
  getCurrentOrderId,
  isQueueFinished,
  clearQueue,
  getQueueStatus,
};