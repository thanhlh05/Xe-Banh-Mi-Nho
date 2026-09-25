import {
  getCurrentTime,
} from "./timeSystem.js";

import {
  getDayFlowState,
  DAY_FLOW_STATES,
} from "./dayFlowSystem.js";

import {
  getNextOrderId,
  moveToNextCustomer,
  hasWaitingCustomer,
} from "./customerQueueSystem.js";

import {
  startCustomerVisit,
  hasActiveCustomer,
} from "./gameplaySystem.js";

const CUSTOMER_SPAWN_TIMES = [
  { hour: 6, minute: 30 },
  { hour: 7, minute: 0 },
  { hour: 7, minute: 30 },
  { hour: 8, minute: 0 },
  { hour: 9, minute: 0 },
  { hour: 10, minute: 0 },
  { hour: 11, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 16, minute: 0 },
  { hour: 17, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 19, minute: 0 },
  { hour: 20, minute: 0 },
];

let spawnedOrders = [];

function convertTimeToMinutes(hour, minute) {
  return hour * 60 + minute;
}

function getCurrentTimeInMinutes() {
  const currentTime = getCurrentTime();

  return convertTimeToMinutes(
    currentTime.hour,
    currentTime.minute
  );
}

function getSpawnTimes() {
  return CUSTOMER_SPAWN_TIMES.map((spawnTime) => ({
    ...spawnTime,
  }));
}

function hasAlreadySpawned(orderId) {
  return spawnedOrders.includes(orderId);
}

function canSpawnCustomer() {
  if (getDayFlowState() !== DAY_FLOW_STATES.PLAYING) {
    return false;
  }

  if (hasActiveCustomer()) {
    return false;
  }

  if (!hasWaitingCustomer()) {
    return false;
  }

  return true;
}

function getAvailableSpawnTime() {
  const currentTime = getCurrentTimeInMinutes();

  for (const spawnTime of CUSTOMER_SPAWN_TIMES) {
    const spawnTimeInMinutes = convertTimeToMinutes(
      spawnTime.hour,
      spawnTime.minute
    );

    if (spawnTimeInMinutes <= currentTime) {
      continue;
    }

    return spawnTime;
  }

  return null;
}

function shouldSpawnCustomer() {
  if (!canSpawnCustomer()) {
    return false;
  }

  const currentTime = getCurrentTimeInMinutes();

  const nextOrderId = getNextOrderId();

  if (!nextOrderId) {
    return false;
  }

  if (hasAlreadySpawned(nextOrderId)) {
    return false;
  }

  const spawnIndex = spawnedOrders.length;

  if (spawnIndex >= CUSTOMER_SPAWN_TIMES.length) {
    return false;
  }

  const spawnTime = CUSTOMER_SPAWN_TIMES[spawnIndex];

  const spawnTimeInMinutes = convertTimeToMinutes(
    spawnTime.hour,
    spawnTime.minute
  );

  return currentTime >= spawnTimeInMinutes;
}

function spawnNextCustomer() {
  if (!shouldSpawnCustomer()) {
    return null;
  }

  const orderId = moveToNextCustomer();

  if (!orderId) {
    return null;
  }

  const customerVisit = startCustomerVisit(orderId);

  spawnedOrders.push(orderId);

  return {
    orderId,
    customer: customerVisit.customer,
    order: customerVisit.order,
  };
}

function getSpawnedOrders() {
  return [...spawnedOrders];
}

function resetSpawnSystem() {
  spawnedOrders = [];
}

export {
  CUSTOMER_SPAWN_TIMES,
  getSpawnTimes,
  getAvailableSpawnTime,
  canSpawnCustomer,
  shouldSpawnCustomer,
  spawnNextCustomer,
  getSpawnedOrders,
  resetSpawnSystem,
};