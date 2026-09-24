import { gameState } from "../game/gameState.js";
import { getCustomerById } from "./customerSystem.js";

function getRegularCustomer(customerId) {
  const customer = gameState.customers.regular.find(
    (regularCustomer) => regularCustomer.customerId === customerId
  );

  return customer || null;
}

function createRegularCustomer(customerId, recipeId) {
  const customer = getCustomerById(customerId);

  return {
    customerId,
    name: customer.name,
    visitCount: 1,
    usualOrder: recipeId,
    orderCounts: {
      [recipeId]: 1,
    },
    notes: customer.note || "",
  };
}

function recordCustomerVisit(customerId, recipeId) {
  if (typeof customerId !== "string" || customerId.length === 0) {
    throw new Error(
      `regularCustomerSystem: customerId phải là chuỗi không rỗng, nhận được "${customerId}".`
    );
  }

  if (typeof recipeId !== "string" || recipeId.length === 0) {
    throw new Error(
      `regularCustomerSystem: recipeId phải là chuỗi không rỗng, nhận được "${recipeId}".`
    );
  }

  let regularCustomer = getRegularCustomer(customerId);

  if (!regularCustomer) {
    regularCustomer = createRegularCustomer(customerId, recipeId);
    gameState.customers.regular.push(regularCustomer);
    return { ...regularCustomer };
  }

  regularCustomer.visitCount += 1;

  if (!regularCustomer.orderCounts[recipeId]) {
    regularCustomer.orderCounts[recipeId] = 0;
  }

  regularCustomer.orderCounts[recipeId] += 1;

  let mostOrderedRecipe = regularCustomer.usualOrder;
  let highestCount = regularCustomer.orderCounts[mostOrderedRecipe] || 0;

  for (const orderId of Object.keys(regularCustomer.orderCounts)) {
    const orderCount = regularCustomer.orderCounts[orderId];

    if (orderCount > highestCount) {
      highestCount = orderCount;
      mostOrderedRecipe = orderId;
    }
  }

  regularCustomer.usualOrder = mostOrderedRecipe;

  return { ...regularCustomer };
}

function getVisitCount(customerId) {
  const regularCustomer = getRegularCustomer(customerId);

  if (!regularCustomer) {
    return 0;
  }

  return regularCustomer.visitCount;
}

function isRegularCustomer(customerId) {
  return getRegularCustomer(customerId) !== null;
}

function getUsualOrder(customerId) {
  const regularCustomer = getRegularCustomer(customerId);

  if (!regularCustomer) {
    return null;
  }

  return regularCustomer.usualOrder;
}

function getCustomerHint(customerId) {
  const regularCustomer = getRegularCustomer(customerId);

  if (!regularCustomer) {
    return null;
  }

  return {
    isRegular: true,
    message: "Khách quen – Như cũ nha?",
    usualOrder: regularCustomer.usualOrder,
    visitCount: regularCustomer.visitCount,
  };
}

function getAllRegularCustomers() {
  return gameState.customers.regular.map((customer) => ({
    ...customer,
    orderCounts: { ...customer.orderCounts },
  }));
}

function resetRegularCustomers() {
  gameState.customers.regular = [];
}

export {
  getRegularCustomer,
  recordCustomerVisit,
  getVisitCount,
  isRegularCustomer,
  getUsualOrder,
  getCustomerHint,
  getAllRegularCustomers,
  resetRegularCustomers,
};