import { SAMPLE_ORDERS } from "../data/orders.js";
import { getDayFlowState, DAY_FLOW_STATES } from "./dayFlowSystem.js";

let customerQueue = [];
let currentQueueIndex = -1;

function validateOrderId(orderId) {
  const orderExists = SAMPLE_ORDERS.some(
    (order) => order.id === orderId
  );

  if (!orderExists) {
    throw new Error(
      `customerQueueSystem: orderId "${orderId}" không tồn tại trong SAMPLE_ORDERS.`
    );
  }
}

function createQueue(orderIds) {
  if (getDayFlowState() !== DAY_FLOW_STATES.PLAYING) {
    throw new Error(
      `customerQueueSystem: không thể tạo hàng đợi khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw new Error(
      "customerQueueSystem: orderIds phải là một mảng không rỗng."
    );
  }

  for (const orderId of orderIds) {
    validateOrderId(orderId);
  }

  customerQueue = [...orderIds];
  currentQueueIndex = -1;

  return getQueue();
}

function getQueue() {
  return [...customerQueue];
}

function getQueueLength() {
  return customerQueue.length;
}

function getCurrentQueueIndex() {
  return currentQueueIndex;
}

function hasWaitingCustomer() {
  return currentQueueIndex + 1 < customerQueue.length;
}

function getNextOrderId() {
  if (!hasWaitingCustomer()) {
    return null;
  }

  return customerQueue[currentQueueIndex + 1];
}

function moveToNextCustomer() {
  if (!hasWaitingCustomer()) {
    return null;
  }

  currentQueueIndex += 1;

  return customerQueue[currentQueueIndex];
}

function getCurrentOrderId() {
  if (currentQueueIndex < 0) {
    return null;
  }

  return customerQueue[currentQueueIndex] || null;
}

function isQueueFinished() {
  return (
    customerQueue.length > 0 &&
    currentQueueIndex >= customerQueue.length - 1
  );
}

function clearQueue() {
  customerQueue = [];
  currentQueueIndex = -1;
}

function getQueueStatus() {
  return {
    queue: [...customerQueue],
    totalCustomers: customerQueue.length,
    currentIndex: currentQueueIndex,
    currentOrderId: getCurrentOrderId(),
    nextOrderId: getNextOrderId(),
    hasWaitingCustomer: hasWaitingCustomer(),
    finished: isQueueFinished(),
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