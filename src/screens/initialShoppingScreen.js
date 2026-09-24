import { renderHTML, formatMoney } from "../components/uiRenderer.js";
import { gameState } from "../game/gameState.js";
import { INGREDIENTS } from "../data/ingredients.js";
import { SHOPPING_PRICES } from "../data/shoppingPrices.js";
import { getMoney } from "../systems/moneySystem.js";
import { buyItems } from "../systems/shoppingSystem.js";

const SHOPPING_ITEMS = [
  "bread",
  "meat",
  "cha",
  "pate",
  "vegetables",
  "cucumber",
  "egg",
  "soy_sauce",
  "chili_sauce",
  "ketchup",
  "cooking_oil",
  "salt",
  "pepper",
];

let shoppingCart = {};

function resetShoppingCart() {
  shoppingCart = {};

  for (const itemId of SHOPPING_ITEMS) {
    shoppingCart[itemId] = 0;
  }
}

function calculateTotalCost() {
  let total = 0;

  for (const itemId of SHOPPING_ITEMS) {
    const quantity = shoppingCart[itemId] || 0;
    total += SHOPPING_PRICES[itemId] * quantity;
  }

  return total;
}

function getItemDisplayName(itemId) {
  return INGREDIENTS[itemId]?.name || itemId;
}

function renderShoppingItems() {
  return SHOPPING_ITEMS.map((itemId) => {
    const quantity = shoppingCart[itemId] || 0;
    const price = SHOPPING_PRICES[itemId];

    return `
      <div class="shopping-item">
        <div class="shopping-item-info">
          <strong>${getItemDisplayName(itemId)}</strong>
          <span>${formatMoney(price)} / đơn vị</span>
        </div>

        <div class="quantity-control">
          <button
            type="button"
            class="quantity-button"
            data-action="decrease"
            data-item-id="${itemId}"
          >
            −
          </button>

          <span class="quantity-value">
            ${quantity}
          </span>

          <button
            type="button"
            class="quantity-button"
            data-action="increase"
            data-item-id="${itemId}"
          >
            +
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderInitialShoppingScreen(onComplete) {
  resetShoppingCart();

  renderHTML(`
    <main class="screen shopping-screen">
      <section class="game-card shopping-card">
        <div class="screen-header">
          <div class="screen-icon">🛒</div>

          <h1>Mua nguyên liệu</h1>

          <p>
            Chuẩn bị nguyên liệu cho ngày bán đầu tiên.
          </p>
        </div>

        <div class="money-display">
          Số tiền:
          <strong id="shopping-money">
            ${formatMoney(getMoney())}
          </strong>
        </div>

        <div id="shopping-items" class="shopping-items">
          ${renderShoppingItems()}
        </div>

        <div class="shopping-summary">
          <div>
            Tổng tiền:
            <strong id="shopping-total">
              ${formatMoney(0)}
            </strong>
          </div>

          <div id="shopping-error" class="form-error"></div>

          <button
            id="complete-shopping-button"
            type="button"
            class="game-button primary-button"
          >
            HOÀN TẤT MUA HÀNG
          </button>
        </div>
      </section>
    </main>
  `);

  bindShoppingEvents(onComplete);
  updateShoppingSummary();
}

function updateShoppingSummary() {
  const totalElement = document.querySelector("#shopping-total");
  const moneyElement = document.querySelector("#shopping-money");

  if (totalElement) {
    totalElement.textContent = formatMoney(calculateTotalCost());
  }

  if (moneyElement) {
    moneyElement.textContent = formatMoney(getMoney());
  }
}

function updateShoppingItem(itemId) {
  const itemElement = document.querySelector(
    `[data-item-id="${itemId}"][data-action="increase"]`
  );

  if (!itemElement) {
    return;
  }

  const itemContainer = itemElement.closest(".shopping-item");

  if (!itemContainer) {
    return;
  }

  const quantityElement =
    itemContainer.querySelector(".quantity-value");

  if (quantityElement) {
    quantityElement.textContent =
      shoppingCart[itemId] || 0;
  }
}

function bindShoppingEvents(onComplete) {
  const itemsContainer =
    document.querySelector("#shopping-items");

  const completeButton = document.querySelector(
    "#complete-shopping-button"
  );

  const errorElement =
    document.querySelector("#shopping-error");

  if (!itemsContainer || !completeButton || !errorElement) {
    throw new Error(
      "initialShoppingScreen: không tìm thấy phần tử giao diện cần thiết."
    );
  }

  itemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(
      "[data-action][data-item-id]"
    );

    if (!button) {
      return;
    }

    const itemId = button.dataset.itemId;
    const action = button.dataset.action;

    if (action === "increase") {
      shoppingCart[itemId] += 1;
    }

    if (action === "decrease") {
      shoppingCart[itemId] = Math.max(
        0,
        shoppingCart[itemId] - 1
      );
    }

    updateShoppingItem(itemId);
    updateShoppingSummary();
  });

  completeButton.addEventListener("click", () => {
    errorElement.textContent = "";

    const selectedItems = SHOPPING_ITEMS
      .filter((itemId) => shoppingCart[itemId] > 0)
      .map((itemId) => ({
        itemId,
        quantity: shoppingCart[itemId],
      }));

    if (selectedItems.length === 0) {
      errorElement.textContent =
        "Hãy mua ít nhất một loại nguyên liệu.";

      return;
    }

    const totalCost = calculateTotalCost();

    if (totalCost > getMoney()) {
      errorElement.textContent =
        "Bạn không đủ tiền để mua số nguyên liệu này.";

      return;
    }

    try {
      buyItems(selectedItems);

      if (typeof onComplete === "function") {
        onComplete();
      }
    } catch (error) {
      errorElement.textContent = error.message;
    }
  });
}

export { renderInitialShoppingScreen };