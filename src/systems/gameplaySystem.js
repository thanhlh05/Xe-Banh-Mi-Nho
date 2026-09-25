import { CUSTOMERS } from "../data/customers.js";
import { SAMPLE_ORDERS } from "../data/orders.js";

import {
  startSale,
} from "./salesSystem.js";

import {
  completeOrder,
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

import { recordCustomerVisit } from "./regularCustomerSystem.js";

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
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PLAYING
  ) {
    throw new Error(
      `gameplaySystem: không thể đón khách khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  if (
    currentCustomer !== null ||
    currentOrder !== null
  ) {
    throw new Error(
      "gameplaySystem: hiện đang có một khách hàng/order đang được xử lý."
    );
  }

  const order = getOrderById(orderId);

  const customer = getCustomerById(
    order.customerId
  );

  startSale(orderId);

  currentCustomer = customer;
  currentOrder = order;
  lastSaleResult = null;

  setRecipe(order.recipeId);

  recordCustomer();

  recordCustomerVisit(
    customer.id,
    order.recipeId
  );

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
  return (
    currentCustomer !== null &&
    currentOrder !== null
  );
}

/*
 * Chỉ cần có khách đang được xử lý
 * thì có thể hoàn tất lượt bán.
 *
 * Không kiểm tra đủ nguyên liệu ở đây.
 *
 * Lý do:
 * Người chơi có thể chọn sai,
 * chọn thiếu hoặc kho bị thiếu nguyên liệu.
 * Những trường hợp đó vẫn phải được xử lý
 * để tính rating và tiền nhận được.
 */
function canFinishCurrentSale() {
  return hasActiveCustomer();
}

/*
 * Tính chi phí của những nguyên liệu
 * người chơi thực sự đã chọn
 * và hiện vẫn còn trong kho.
 */
function calculateSelectedIngredientCost(
  selectedIngredients
) {
  let totalCost = 0;

  for (const ingredientId of selectedIngredients) {
    if (getItemQuantity(ingredientId) <= 0) {
      continue;
    }

    totalCost +=
      SHOPPING_PRICES[ingredientId] || 0;
  }

  return totalCost;
}

/*
 * Tiêu thụ nguyên liệu dựa trên
 * lựa chọn thực tế của người chơi.
 *
 * Đây là nơi DUY NHẤT trong flow bán hàng
 * thực hiện việc trừ inventory.
 *
 * Ví dụ:
 *
 * Recipe:
 * bread + meat + vegetables + cucumber
 *
 * Người chơi chọn:
 * bread + meat + cha + pate + egg + vegetables + cucumber
 *
 * Nếu tất cả đều còn hàng:
 * cả 7 nguyên liệu đều bị trừ 1.
 *
 * Recipe KHÔNG quyết định nguyên liệu bị trừ.
 * Recipe chỉ dùng để đánh giá món ăn.
 */
function consumeSelectedIngredients(
  selectedIngredients
) {
  const consumedIngredients = [];
  let ingredientCost = 0;

  for (const ingredientId of selectedIngredients) {
    const quantity =
      getItemQuantity(ingredientId);

    /*
     * Nếu nguyên liệu đã hết:
     * không thể trừ thêm.
     */
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
      SHOPPING_PRICES[ingredientId] || 0;
  }

  return {
    consumedIngredients,
    ingredientCost,
  };
}

/*
 * Kiểm tra những nguyên liệu mà recipe yêu cầu
 * nhưng hiện tại trong kho không còn.
 *
 * Hàm này CHỈ kiểm tra.
 * Không trừ inventory.
 */
function getMissingRecipeIngredients(
  recipeId
) {
  const ingredients =
    getRecipeIngredients(recipeId);

  return ingredients.filter(
    (ingredientId) =>
      getItemQuantity(ingredientId) <= 0
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

  const selectedIngredients =
    getSelectedIngredients();

  const recipeId =
    currentOrder.recipeId;

  /*
   * BƯỚC 1:
   * Đánh giá món dựa trên những gì
   * người chơi đã chọn.
   *
   * Recipe chỉ được dùng để so sánh.
   */
  const evaluatedResult =
    evaluateOrder(
      recipeId,
      selectedIngredients
    );

  /*
   * BƯỚC 2:
   * Kiểm tra recipe có nguyên liệu nào
   * bị thiếu trong kho hay không.
   */
  const missingIngredients =
    getMissingRecipeIngredients(
      recipeId
    );

  const hasMissingIngredients =
    missingIngredients.length > 0;

  /*
   * BƯỚC 3:
   * Nếu kho thiếu nguyên liệu cần thiết,
   * kết quả cuối cùng phải là POOR.
   *
   * Không khóa người chơi.
   * Vẫn cho hoàn thành lượt bán.
   */
  const finalResult = hasMissingIngredients
    ? {
        ...evaluatedResult,
        level: "POOR",
      }
    : evaluatedResult;

  /*
   * BƯỚC 4:
   * Rating và payment phải được tính
   * SAU KHI đã xác định finalResult.
   *
   * Điều này tránh bug:
   * result bị đổi thành POOR
   * nhưng payment vẫn được tính theo PERFECT/GOOD.
   */
  const rating =
    calculateRating(finalResult);

  const payment =
    calculatePayment(finalResult);

  /*
   * BƯỚC 5:
   * Trừ inventory dựa hoàn toàn vào
   * selectedIngredients.
   *
   * Không gọi completeSale().
   * Không gọi makeRecipe().
   *
   * Vì nếu gọi chúng, nguyên liệu
   * sẽ bị trừ thêm lần nữa.
   */
  const consumeResult =
    consumeSelectedIngredients(
      selectedIngredients
    );

  const consumedIngredientNames =
    getIngredientNames(
      consumeResult.consumedIngredients
    );

  /*
   * BƯỚC 6:
   * Order hoàn thành.
   */
  completeOrder();

  /*
   * BƯỚC 7:
   * Cộng đúng số tiền khách thực tế trả.
   */
  addMoney(payment);

  /*
   * BƯỚC 8:
   * Ghi nhận thống kê.
   */
  recordIngredientCost(
    consumeResult.ingredientCost
  );

  recordSale(payment);

  recordBreadSold();

  recordRating(rating);

  /*
   * BƯỚC 9:
   * Lưu kết quả lượt bán.
   */
  lastSaleResult = {
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

  /*
   * BƯỚC 10:
   * Reset trạng thái lượt bán.
   */
  clearSelectedIngredients();

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