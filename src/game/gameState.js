const gameState = {
  shop: {
    name: "",
  },

  player: {
    money: 500000,
    rating: 5,
  },

  day: {
    current: 1,
  },

  inventory: {
    fresh: {},
    consumables: {},
    tools: {},
  },

  recipes: {
    unlocked: [],
  },

  customers: {
    regular: [],
  },

  statistics: {
    totalRevenue: 0,
    totalCustomers: 0,
    totalBreadsSold: 0,
  },

  settings: {
    sound: true,
  },

  upgrades: {},

  /*
   * Runtime state dùng để Save / Load
   *
   * Đây là những dữ liệu trước đây chỉ tồn tại
   * trong các biến let của từng system.
   */
  runtime: {
    dayFlowState: "PREPARATION",

    time: {
      hour: 6,
      minute: 0,
    },

    preparationCompleted: false,

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
  },
};

export {
  gameState,
};