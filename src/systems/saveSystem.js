import { gameState } from "../game/gameState.js";

const SAVE_KEY = "xe_banh_mi_save";

const DEFAULT_RUNTIME_STATE = {
  dayFlowState: "PREPARATION",

  time: {
    hour: 6,
    minute: 0,
  },

  preparationCompleted: false,

  customerQueue: {
    day: 1,
    orders: [],
    currentIndex: -1,
  },

  customerSpawn: {
    day: 1,
    spawnedOrders: [],
  },

  gameplay: {
    currentCustomerId: null,
    currentOrderId: null,
    lastSaleResult: null,
  },

  ingredientSelection: {
    currentRecipeId: null,
    selectedIngredients: [],
  },

  dayStatistics: {
    revenue: 0,
    ingredientCost: 0,
    customers: 0,
    breadsSold: 0,
    waste: {},
    ratings: [],
  },
};

function createDefaultRuntimeState() {
  return {
    dayFlowState:
      DEFAULT_RUNTIME_STATE.dayFlowState,

    time: {
      ...DEFAULT_RUNTIME_STATE.time,
    },

    preparationCompleted:
      DEFAULT_RUNTIME_STATE
        .preparationCompleted,

    customerQueue: {
      orders: [],
      currentIndex: -1,
    },

    customerSpawn: {
      spawnedOrders: [],
    },

    gameplay: {
      currentCustomerId: null,
      currentOrderId: null,
      lastSaleResult: null,
    },

    ingredientSelection: {
      currentRecipeId: null,
      selectedIngredients: [],
    },

    dayStatistics: {
      revenue: 0,
      ingredientCost: 0,
      customers: 0,
      breadsSold: 0,
      waste: {},
      ratings: [],
    },
  };
}

function normalizeRuntimeState(
  runtime
) {
  const defaultRuntime =
    createDefaultRuntimeState();

  if (
    !runtime ||
    typeof runtime !== "object"
  ) {
    return defaultRuntime;
  }

  return {
    dayFlowState:
      typeof runtime.dayFlowState ===
      "string"
        ? runtime.dayFlowState
        : defaultRuntime.dayFlowState,

    time: {
      hour:
        Number.isInteger(
          runtime.time?.hour
        )
          ? runtime.time.hour
          : defaultRuntime.time.hour,

      minute:
        Number.isInteger(
          runtime.time?.minute
        )
          ? runtime.time.minute
          : defaultRuntime.time.minute,
    },

    preparationCompleted:
      runtime.preparationCompleted ===
      true,

    customerQueue: {
      day: Number.isInteger(
        runtime.customerQueue?.day
      )
        ? runtime.customerQueue.day
        : gameState.day.current,

      orders: Array.isArray(
        runtime.customerQueue?.orders
      )
        ? [...runtime.customerQueue.orders]
        : [],

      currentIndex: Number.isInteger(
        runtime.customerQueue?.currentIndex
      )
        ? runtime.customerQueue.currentIndex
        : -1,
    },

    customerSpawn: {
      day: Number.isInteger(
        runtime.customerSpawn?.day
      )
        ? runtime.customerSpawn.day
        : gameState.day.current,

      spawnedOrders: Array.isArray(
        runtime.customerSpawn?.spawnedOrders
      )
        ? [...runtime.customerSpawn.spawnedOrders]
        : [],
    },

    gameplay: {
      currentCustomerId:
        typeof runtime.gameplay
          ?.currentCustomerId ===
        "string"
          ? runtime.gameplay
              .currentCustomerId
          : null,

      currentOrderId:
        typeof runtime.gameplay
          ?.currentOrderId === "string"
          ? runtime.gameplay
              .currentOrderId
          : null,

      lastSaleResult:
        runtime.gameplay
          ?.lastSaleResult ?? null,
    },

    ingredientSelection: {
      currentRecipeId:
        typeof runtime
          .ingredientSelection
          ?.currentRecipeId ===
        "string"
          ? runtime
              .ingredientSelection
              .currentRecipeId
          : null,

      selectedIngredients:
        Array.isArray(
          runtime
            .ingredientSelection
            ?.selectedIngredients
        )
          ? [
              ...runtime
                .ingredientSelection
                .selectedIngredients,
            ]
          : [],
    },

    dayStatistics: {
      revenue:
        Number.isInteger(
          runtime.dayStatistics
            ?.revenue
        )
          ? runtime.dayStatistics
              .revenue
          : 0,

      ingredientCost:
        Number.isInteger(
          runtime.dayStatistics
            ?.ingredientCost
        )
          ? runtime.dayStatistics
              .ingredientCost
          : 0,

      customers:
        Number.isInteger(
          runtime.dayStatistics
            ?.customers
        )
          ? runtime.dayStatistics
              .customers
          : 0,

      breadsSold:
        Number.isInteger(
          runtime.dayStatistics
            ?.breadsSold
        )
          ? runtime.dayStatistics
              .breadsSold
          : 0,

      waste:
        runtime.dayStatistics
          ?.waste &&
        typeof runtime.dayStatistics
          .waste === "object"
          ? {
              ...runtime.dayStatistics
                .waste,
            }
          : {},

      ratings:
        Array.isArray(
          runtime.dayStatistics
            ?.ratings
        )
          ? [
              ...runtime.dayStatistics
                .ratings,
            ]
          : [],
    },
  };
}

function saveGame() {
  if (!gameState.runtime) {
    gameState.runtime =
      createDefaultRuntimeState();
  }

  const dataAsText =
    JSON.stringify(gameState);

  localStorage.setItem(
    SAVE_KEY,
    dataAsText
  );
}

function loadGame() {
  const savedText =
    localStorage.getItem(
      SAVE_KEY
    );

  if (!savedText) {
    return false;
  }

  let parsedData;

  try {
    parsedData =
      JSON.parse(savedText);
  } catch (error) {
    throw new Error(
      "saveSystem: dữ liệu save trong LocalStorage bị lỗi, không thể đọc (JSON không hợp lệ)."
    );
  }

  if (
    !parsedData ||
    typeof parsedData !== "object"
  ) {
    throw new Error(
      "saveSystem: dữ liệu save không hợp lệ."
    );
  }

  Object.assign(
    gameState,
    parsedData
  );

  gameState.runtime =
    normalizeRuntimeState(
      parsedData.runtime
    );

  return true;
}

function hasSaveGame() {
  return (
    localStorage.getItem(
      SAVE_KEY
    ) !== null
  );
}

function clearSaveGame() {
  localStorage.removeItem(
    SAVE_KEY
  );
}

export {
  saveGame,
  loadGame,
  hasSaveGame,
  clearSaveGame,
};