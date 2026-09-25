import { gameState } from "../game/gameState.js";

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

import { autoSave } from "./autoSaveSystem.js";

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

function ensureRuntimeSpawn() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (!gameState.runtime.customerSpawn) {
    gameState.runtime.customerSpawn = {
      day: gameState.day.current,
      spawnedOrders: [],
    };
  }

  if (
    !Number.isInteger(
      gameState.runtime.customerSpawn.day
    )
  ) {
    gameState.runtime.customerSpawn.day =
      gameState.day.current;
  }

  if (
    !Array.isArray(
      gameState.runtime.customerSpawn
        .spawnedOrders
    )
  ) {
    gameState.runtime.customerSpawn
      .spawnedOrders = [];
  }
}

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
  return CUSTOMER_SPAWN_TIMES.map(
    (spawnTime) => ({
      ...spawnTime,
    })
  );
}

function hasAlreadySpawned(orderId) {
  ensureRuntimeSpawn();

  return gameState.runtime.customerSpawn
    .spawnedOrders.includes(orderId);
}

function canSpawnCustomer() {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PLAYING
  ) {
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
  const currentTime =
    getCurrentTimeInMinutes();

  for (const spawnTime of CUSTOMER_SPAWN_TIMES) {
    const spawnTimeInMinutes =
      convertTimeToMinutes(
        spawnTime.hour,
        spawnTime.minute
      );

    if (
      spawnTimeInMinutes <=
      currentTime
    ) {
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

  const currentTime =
    getCurrentTimeInMinutes();

  const nextOrderId =
    getNextOrderId();

  if (!nextOrderId) {
    return false;
  }

  if (
    hasAlreadySpawned(nextOrderId)
  ) {
    return false;
  }

  ensureRuntimeSpawn();

  const spawnIndex =
    gameState.runtime.customerSpawn
      .spawnedOrders.length;

  if (
    spawnIndex >=
    CUSTOMER_SPAWN_TIMES.length
  ) {
    return false;
  }

  const spawnTime =
    CUSTOMER_SPAWN_TIMES[spawnIndex];

  const spawnTimeInMinutes =
    convertTimeToMinutes(
      spawnTime.hour,
      spawnTime.minute
    );

  return (
    currentTime >=
    spawnTimeInMinutes
  );
}

function spawnNextCustomer() {
  if (!shouldSpawnCustomer()) {
    return null;
  }

  const orderId =
    moveToNextCustomer();

  if (!orderId) {
    return null;
  }

  const customerVisit =
    startCustomerVisit(orderId);

  ensureRuntimeSpawn();

  gameState.runtime.customerSpawn.day =
    gameState.day.current;

  gameState.runtime.customerSpawn
    .spawnedOrders.push(orderId);

  autoSave();

  return {
    orderId,
    customer: customerVisit.customer,
    order: customerVisit.order,
  };
}

function getSpawnedOrders() {
  ensureRuntimeSpawn();

  return [
    ...gameState.runtime.customerSpawn
      .spawnedOrders,
  ];
}

function resetSpawnSystem() {
  ensureRuntimeSpawn();

  gameState.runtime.customerSpawn.day =
    gameState.day.current;

  gameState.runtime.customerSpawn
    .spawnedOrders = [];
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