import { gameState } from "../game/gameState.js";

import { CUSTOMERS } from "../data/customers.js";
import { SAMPLE_ORDERS } from "../data/orders.js";

import {
  startSale,
} from "./salesSystem.js";

import {
  completeOrder,
  getCurrentOrder,
} from "./orderSystem.js";

import {
  recordCustomer,
  recordBreadSold,
  recordSale,
  recordRating,
  recordIngredientCost,
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

import {
  setRecipe,
  getSelectedIngredients,
  clearSelectedIngredients,
} from "./ingredientSelectionSystem.js";

import {
  recordCustomerVisit,
} from "./regularCustomerSystem.js";

import {
  getRecipeIngredients,
} from "./cookingSystem.js";

import {
  getItemQuantity,
  removeItem,
} from "./inventorySystem.js";

import { INGREDIENTS } from "../data/ingredients.js";
import { SHOPPING_PRICES } from "../data/shoppingPrices.js";
import { addMoney } from "./moneySystem.js";

import { autoSave } from "./autoSaveSystem.js";

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

function getCustomerById(customerId) {
  const customer =
    CUSTOMERS.find(
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
  const order =
    SAMPLE_ORDERS.find(
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
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PLAYING
  ) {
    throw new Error(
      `gameplaySystem: không thể đón khách khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  ensureRuntimeGameplay();

  if (hasActiveCustomer()) {
    throw new Error(
      "gameplaySystem: hiện đang có một khách hàng/order đang được xử lý."
    );
  }

  const order =
    getOrderById(orderId);

  const customer =
    getCustomerById(
      order.customerId
    );

  startSale(orderId);

  gameState.runtime.gameplay.currentCustomerId =
    customer.id;

  gameState.runtime.gameplay.currentOrderId =
    order.id;

  gameState.runtime.gameplay.lastSaleResult =
    null;

  setRecipe(order.recipeId);

  recordCustomer();

  recordCustomerVisit(
    customer.id,
    order.recipeId
  );

  // Lưu vị trí ngay sau khi bắt đầu xử lý khách.
  autoSave();

  return {
    customer,
    order,
  };
}

function getCurrentCustomer() {
  ensureRuntimeGameplay();

  const customerId =
    gameState.runtime.gameplay
      .currentCustomerId;

  if (!customerId) {
    return null;
  }

  return getCustomerById(
    customerId
  );
}

function getCurrentGameplayOrder() {
  ensureRuntimeGameplay();

  const orderId =
    gameState.runtime.gameplay
      .currentOrderId;

  if (!orderId) {
    return null;
  }

  return getOrderById(
    orderId
  );
}

function hasActiveCustomer() {
  return (
    getCurrentCustomer() !== null &&
    getCurrentGameplayOrder() !== null
  );
}

function canFinishCurrentSale() {
  return hasActiveCustomer();
}

function calculateSelectedIngredientCost(
  selectedIngredients
) {
  let totalCost = 0;

  for (const ingredientId of selectedIngredients) {
    if (
      getItemQuantity(ingredientId) <=
      0
    ) {
      continue;
    }

    totalCost +=
      SHOPPING_PRICES[ingredientId] ||
      0;
  }

  return totalCost;
}

function consumeSelectedIngredients(
  selectedIngredients
) {
  const consumedIngredients = [];
  let ingredientCost = 0;

  for (const ingredientId of selectedIngredients) {
    const quantity =
      getItemQuantity(
        ingredientId
      );

    if (quantity <= 0) {
      continue;
    }

    removeItem(
      ingredientId,
      1
    );

    consumedIngredients.push(
      ingredientId
    );

    ingredientCost +=
      SHOPPING_PRICES[ingredientId] ||
      0;
  }

  return {
    consumedIngredients,
    ingredientCost,
  };
}

function getMissingRecipeIngredients(
  recipeId
) {
  const ingredients =
    getRecipeIngredients(
      recipeId
    );

  return ingredients.filter(
    (ingredientId) =>
      getItemQuantity(
        ingredientId
      ) <= 0
  );
}

function getIngredientNames(
  ingredientIds
) {
  return ingredientIds.map(
    (ingredientId) => {
      return INGREDIENTS[ingredientId]
        ? INGREDIENTS[ingredientId].name
        : ingredientId;
    }
  );
}

function finishCurrentSale() {
  if (!hasActiveCustomer()) {
    throw new Error(
      "gameplaySystem: không thể hoàn thành sale vì chưa có khách hàng đang được xử lý."
    );
  }

  ensureRuntimeGameplay();

  const selectedIngredients =
    getSelectedIngredients();

  const currentOrder =
    getCurrentGameplayOrder();

  const currentCustomer =
    getCurrentCustomer();

  const recipeId =
    currentOrder.recipeId;

  const evaluatedResult =
    evaluateOrder(
      recipeId,
      selectedIngredients
    );

  const missingIngredients =
    getMissingRecipeIngredients(
      recipeId
    );

  const hasMissingIngredients =
    missingIngredients.length > 0;

  const finalResult =
    hasMissingIngredients
      ? {
          ...evaluatedResult,
          level: "POOR",
        }
      : evaluatedResult;

  const rating =
    calculateRating(
      finalResult
    );

  const payment =
    calculatePayment(
      finalResult
    );

  const consumeResult =
    consumeSelectedIngredients(
      selectedIngredients
    );

  const consumedIngredientNames =
    getIngredientNames(
      consumeResult.consumedIngredients
    );

  completeOrder();

  addMoney(payment);

  recordIngredientCost(
    consumeResult.ingredientCost
  );

  recordSale(payment);

  recordBreadSold();

  recordRating(rating);

  const saleResult = {
    success: true,

    orderId:
      currentOrder.id,

    customerId:
      currentOrder.customerId,

    recipeId,

    customerName:
      currentCustomer.name,

    earnedMoney:
      payment,

    payment,

    ingredientCost:
      consumeResult.ingredientCost,

    consumedIngredients: [
      ...consumeResult.consumedIngredients,
    ],

    consumedIngredientNames,

    selectedIngredients: [
      ...selectedIngredients,
    ],

    missingIngredients: [
      ...missingIngredients,
    ],

    missingIngredientNames:
      getIngredientNames(
        missingIngredients
      ),

    partialSale:
      hasMissingIngredients,

    rating,

    resultLevel:
      finalResult.level,

    correctCount:
      finalResult.correctCount,

    missingCount:
      finalResult.missingCount,

    extraCount:
      finalResult.extraCount,
  };

  gameState.runtime.gameplay.lastSaleResult =
    saleResult;

  clearSelectedIngredients();

  gameState.runtime.gameplay.currentCustomerId =
    null;

  gameState.runtime.gameplay.currentOrderId =
    null;

  // Lưu sau khi toàn bộ kết quả bán hàng đã được cập nhật.
  autoSave();

  return saleResult;
}

function getLastSaleResult() {
  ensureRuntimeGameplay();

  return (
    gameState.runtime.gameplay
      .lastSaleResult
  );
}

function clearLastSaleResult() {
  ensureRuntimeGameplay();

  gameState.runtime.gameplay.lastSaleResult =
    null;

  autoSave();
}

function resetGameplay() {
  ensureRuntimeGameplay();

  gameState.runtime.gameplay.currentCustomerId =
    null;

  gameState.runtime.gameplay.currentOrderId =
    null;

  gameState.runtime.gameplay.lastSaleResult =
    null;
}

export {
  startCustomerVisit,
  getCurrentCustomer,
  getCurrentGameplayOrder,
  hasActiveCustomer,
  canFinishCurrentSale,
  finishCurrentSale,
  getLastSaleResult,
  clearLastSaleResult,
  resetGameplay,
};