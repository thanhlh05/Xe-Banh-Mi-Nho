import { renderHTML, formatMoney } from "../components/uiRenderer.js";
import { gameState } from "../game/gameState.js";
import { INGREDIENTS } from "../data/ingredients.js";
import { SHOPPING_PRICES } from "../data/shoppingPrices.js";

import {
  getPreparationStatus,
  completePreparation,
  canStartDay,
  startPreparedDay,
} from "../systems/preparationSystem.js";

import { getCurrentDay } from "../systems/daySystem.js";
import { getMoney } from "../systems/moneySystem.js";
import { getItemQuantity } from "../systems/inventorySystem.js";
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

function getItemDisplayName(itemId) {
  return INGREDIENTS[itemId]?.name || itemId;
}

function calculateShoppingTotal() {
  let total = 0;

  for (const itemId of SHOPPING_ITEMS) {
    const quantity = shoppingCart[itemId] || 0;
    total += SHOPPING_PRICES[itemId] * quantity;
  }

  return total;
}

function renderInventoryItem(name, quantity) {
  return `
    <div class="preparation-item">
      <span>${name}</span>
      <strong>${quantity}</strong>
    </div>
  `;
}

function renderShoppingItem(itemId) {
  const quantity = shoppingCart[itemId] || 0;
  const price = SHOPPING_PRICES[itemId];

  return `
    <div class="shopping-item">
      <div class="shopping-item-info">
        <strong>${getItemDisplayName(itemId)}</strong>

        <span>
          Có: ${getItemQuantity(itemId)}
          · ${formatMoney(price)} / đơn vị
        </span>
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
}

function renderShoppingItems() {
  return SHOPPING_ITEMS
    .map((itemId) => renderShoppingItem(itemId))
    .join("");
}

function renderPreparationScreen(onDayStart) {
  resetShoppingCart();

  const status = getPreparationStatus();

  renderHTML(`
    <main class="screen preparation-screen">

      <section class="game-card preparation-card">

        <div class="screen-header">
          <div class="screen-icon">🧑‍🍳</div>

          <h1>Chuẩn bị bán hàng</h1>

          <p>
            ${gameState.shop.name || "Xe bánh mì"}
          </p>
        </div>

        <div class="preparation-info">

          <div>
            <span>Ngày</span>
            <strong>${getCurrentDay()}</strong>
          </div>

          <div>
            <span>Số tiền</span>
            <strong id="preparation-money">
              ${formatMoney(status.money)}
            </strong>
          </div>

        </div>

        <h2>Nguyên liệu hiện có</h2>

        <div class="preparation-inventory">

          ${renderInventoryItem(
            "🥖 Bánh mì",
            status.bread
          )}

          ${renderInventoryItem(
            "🥩 Thịt",
            status.meat
          )}

          ${renderInventoryItem(
            "🥓 Chả",
            status.cha
          )}

          ${renderInventoryItem(
            "🥫 Pate",
            status.pate
          )}

          ${renderInventoryItem(
            "🥬 Rau",
            status.vegetables
          )}

          ${renderInventoryItem(
            "🥒 Dưa leo",
            status.cucumber
          )}

          ${renderInventoryItem(
            "🥚 Trứng",
            status.egg
          )}

        </div>

        <h2>🛒 Mua thêm nguyên liệu</h2>

        <p class="preparation-shopping-description">
          Bạn có thể mua thêm nguyên liệu trước khi bắt đầu ngày.
        </p>

        <div
          id="preparation-shopping-items"
          class="shopping-items"
        >
          ${renderShoppingItems()}
        </div>

        <div class="shopping-summary">

          <div>
            Tổng tiền mua:
            <strong id="preparation-shopping-total">
              ${formatMoney(0)}
            </strong>
          </div>

        </div>

        <p
          id="preparation-error"
          class="form-error"
        ></p>

        <button
          id="complete-preparation-button"
          type="button"
          class="game-button primary-button"
        >
          HOÀN TẤT CHUẨN BỊ
        </button>

        <button
          id="start-day-button"
          type="button"
          class="game-button secondary-button"
          disabled
        >
          BẮT ĐẦU NGÀY
        </button>

      </section>

    </main>
  `);

  bindPreparationEvents(onDayStart);
  updatePreparationShoppingSummary();
}

function updatePreparationShoppingSummary() {
  const totalElement = document.querySelector(
    "#preparation-shopping-total"
  );

  const moneyElement = document.querySelector(
    "#preparation-money"
  );

  if (totalElement) {
    totalElement.textContent =
      formatMoney(calculateShoppingTotal());
  }

  if (moneyElement) {
    moneyElement.textContent =
      formatMoney(getMoney());
  }
}

function updatePreparationShoppingItem(itemId) {
  const increaseButton = document.querySelector(
    `[data-action="increase"][data-item-id="${itemId}"]`
  );

  if (!increaseButton) {
    return;
  }

  const itemContainer =
    increaseButton.closest(".shopping-item");

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

function bindPreparationShoppingEvents() {
  const shoppingContainer = document.querySelector(
    "#preparation-shopping-items"
  );

  if (!shoppingContainer) {
    throw new Error(
      "preparationScreen: không tìm thấy khu vực mua nguyên liệu."
    );
  }

  shoppingContainer.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        "[data-action][data-item-id]"
      );

      if (!button) {
        return;
      }

      const itemId = button.dataset.itemId;
      const action = button.dataset.action;

      if (!SHOPPING_ITEMS.includes(itemId)) {
        return;
      }

      if (action === "increase") {
        shoppingCart[itemId] += 1;
      }

      if (action === "decrease") {
        shoppingCart[itemId] = Math.max(
          0,
          shoppingCart[itemId] - 1
        );
      }

      updatePreparationShoppingItem(itemId);
      updatePreparationShoppingSummary();
    }
  );
}

function bindPreparationEvents(onDayStart) {
  const completeButton = document.querySelector(
    "#complete-preparation-button"
  );

  const startButton = document.querySelector(
    "#start-day-button"
  );

  const errorElement = document.querySelector(
    "#preparation-error"
  );

  if (
    !completeButton ||
    !startButton ||
    !errorElement
  ) {
    throw new Error(
      "preparationScreen: không tìm thấy phần tử giao diện cần thiết."
    );
  }

  bindPreparationShoppingEvents();

  completeButton.addEventListener("click", () => {
    errorElement.textContent = "";

    const selectedItems = SHOPPING_ITEMS
      .filter(
        (itemId) =>
          shoppingCart[itemId] > 0
      )
      .map((itemId) => ({
        itemId,
        quantity: shoppingCart[itemId],
      }));

    const totalCost =
      calculateShoppingTotal();

    if (totalCost > getMoney()) {
      errorElement.textContent =
        "Bạn không đủ tiền để mua số nguyên liệu này.";

      return;
    }

    try {
      if (selectedItems.length > 0) {
        buyItems(selectedItems);
      }

      completePreparation();

      startButton.disabled =
        !canStartDay();

      completeButton.disabled = true;

      errorElement.textContent = "";

      startButton.classList.add("ready");

      updatePreparationShoppingSummary();

      const moneyElement =
        document.querySelector(
          "#preparation-money"
        );

      if (moneyElement) {
        moneyElement.textContent =
          formatMoney(getMoney());
      }

    } catch (error) {
      errorElement.textContent =
        error.message;
    }
  });

  startButton.addEventListener("click", () => {
    try {
      const result =
        startPreparedDay();

      if (
        typeof onDayStart ===
        "function"
      ) {
        onDayStart(result);
      }

    } catch (error) {
      errorElement.textContent =
        error.message;
    }
  });
}

export {
  renderPreparationScreen,
};