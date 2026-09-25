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

/*
 * Xác định nhóm của nguyên liệu.
 *
 * fresh:
 * - nguyên liệu tươi
 * - sử dụng trong ngày
 * - nút + / - thay đổi 5 đơn vị
 *
 * consumable:
 * - gia vị / nguyên liệu dùng dài hạn
 * - nút + / - thay đổi 1 đơn vị
 */
function getItemCategory(itemId) {
  return INGREDIENTS[itemId]?.category || "";
}

function getQuantityStep(itemId) {
  console.log(
    "ITEM:",
    itemId,
    "CATEGORY:",
    getItemCategory(itemId)
  );

  return 5;
}

function calculateShoppingTotal() {
  let total = 0;

  for (const itemId of SHOPPING_ITEMS) {
    const quantity = shoppingCart[itemId] || 0;

    total +=
      SHOPPING_PRICES[itemId] *
      quantity;
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
  const quantity =
    shoppingCart[itemId] || 0;

  const price =
    SHOPPING_PRICES[itemId];

  const step =
    getQuantityStep(itemId);

  return `
    <div class="shopping-item">

      <div class="shopping-item-info">
        <strong>
          ${getItemDisplayName(itemId)}
        </strong>

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

        <input
          type="number"
          class="quantity-input"
          data-action="input"
          data-item-id="${itemId}"
          min="0"
          step="1"
          inputmode="numeric"
          value="${quantity}"
          aria-label="Số lượng ${getItemDisplayName(itemId)} muốn mua"
        />

        <button
          type="button"
          class="quantity-button"
          data-action="increase"
          data-item-id="${itemId}"
        >
          +
        </button>

      </div>

      <div class="shopping-item-total">
        Thành tiền:
        <strong>
          ${formatMoney(price * quantity)}
        </strong>
      </div>

      <div class="shopping-item-step">
        ${step === 5
          ? "Mỗi lần ±: 5"
          : "Mỗi lần ±: 1"}
      </div>

    </div>
  `;
}

function renderShoppingGroup(
  title,
  itemIds
) {
  if (itemIds.length === 0) {
    return "";
  }

  return `
    <section class="shopping-group">

      <h3>${title}</h3>

      <div class="shopping-group-items">
        ${itemIds
          .map((itemId) =>
            renderShoppingItem(itemId)
          )
          .join("")}
      </div>

    </section>
  `;
}

function renderShoppingItems() {
  const freshItems =
    SHOPPING_ITEMS.filter(
      (itemId) =>
        getItemCategory(itemId) ===
        "fresh"
    );

  const consumableItems =
    SHOPPING_ITEMS.filter(
      (itemId) =>
        getItemCategory(itemId) ===
        "consumable"
    );

  return `
    ${renderShoppingGroup(
      "🥬 Nguyên liệu tươi - dùng trong ngày",
      freshItems
    )}

    ${renderShoppingGroup(
      "🥫 Gia vị - dùng dài hạn",
      consumableItems
    )}
  `;
}

function renderPreparationScreen(
  onDayStart
) {
  resetShoppingCart();

  const status =
    getPreparationStatus();

  renderHTML(`
    <main class="screen preparation-screen">

      <section class="game-card preparation-card">

        <div class="screen-header">

          <div class="screen-icon">
            🧑‍🍳
          </div>

          <h1>
            Chuẩn bị bán hàng
          </h1>

          <p>
            ${gameState.shop.name || "Xe bánh mì"}
          </p>

        </div>

        <div class="preparation-info">

          <div>
            <span>Ngày</span>
            <strong>
              ${getCurrentDay()}
            </strong>
          </div>

          <div>
            <span>Số tiền</span>

            <strong
              id="preparation-money"
            >
              ${formatMoney(status.money)}
            </strong>
          </div>

        </div>

        <h2>
          Nguyên liệu hiện có
        </h2>

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

        <h2>
          🛒 Nhập nguyên liệu
        </h2>

        <p class="preparation-shopping-description">
          Nguyên liệu tươi dùng trong ngày.
          Gia vị có thể sử dụng cho nhiều ngày.
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

            <strong
              id="preparation-shopping-total"
            >
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

  bindPreparationEvents(
    onDayStart
  );

  updatePreparationShoppingSummary();
}

function updatePreparationShoppingSummary() {
  const totalElement =
    document.querySelector(
      "#preparation-shopping-total"
    );

  const moneyElement =
    document.querySelector(
      "#preparation-money"
    );

  if (totalElement) {
    totalElement.textContent =
      formatMoney(
        calculateShoppingTotal()
      );
  }

  if (moneyElement) {
    moneyElement.textContent =
      formatMoney(getMoney());
  }
}

function updatePreparationShoppingItem(
  itemId
) {
  const increaseButton =
    document.querySelector(
      `[data-action="increase"][data-item-id="${itemId}"]`
    );

  if (!increaseButton) {
    return;
  }

  const itemContainer =
    increaseButton.closest(
      ".shopping-item"
    );

  if (!itemContainer) {
    return;
  }

  const quantityInput =
    itemContainer.querySelector(
      ".quantity-input"
    );

  const totalElement =
    itemContainer.querySelector(
      ".shopping-item-total strong"
    );

  const quantity =
    shoppingCart[itemId] || 0;

  if (quantityInput) {
    quantityInput.value =
      quantity;
  }

  if (totalElement) {
    const price =
      SHOPPING_PRICES[itemId];

    totalElement.textContent =
      formatMoney(
        price * quantity
      );
  }
}

function setShoppingQuantity(
  itemId,
  quantity
) {
  if (
    !SHOPPING_ITEMS.includes(
      itemId
    )
  ) {
    return;
  }

  /*
   * Chỉ chấp nhận số nguyên.
   */
  if (!Number.isInteger(quantity)) {
    quantity = 0;
  }

  /*
   * Không cho phép số âm.
   */
  quantity = Math.max(
    0,
    quantity
  );

  shoppingCart[itemId] =
    quantity;

  updatePreparationShoppingItem(
    itemId
  );

  updatePreparationShoppingSummary();
}

function bindPreparationShoppingEvents() {
  const shoppingContainer =
    document.querySelector(
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
      const button =
        event.target.closest(
          "[data-action][data-item-id]"
        );

      if (!button) {
        return;
      }

      const itemId =
        button.dataset.itemId;

      const action =
        button.dataset.action;

      if (
        !SHOPPING_ITEMS.includes(
          itemId
        )
      ) {
        return;
      }

      const step =
        getQuantityStep(itemId);

      if (
        action === "increase"
      ) {
        shoppingCart[itemId] +=
          step;
      }

      if (
        action === "decrease"
      ) {
        shoppingCart[itemId] =
          Math.max(
            0,
            shoppingCart[itemId] -
              step
          );
      }

      updatePreparationShoppingItem(
        itemId
      );

      updatePreparationShoppingSummary();
    }
  );

  shoppingContainer.addEventListener(
    "input",
    (event) => {
      const input =
        event.target.closest(
          '[data-action="input"][data-item-id]'
        );

      if (!input) {
        return;
      }

      const itemId =
        input.dataset.itemId;

      if (
        !SHOPPING_ITEMS.includes(
          itemId
        )
      ) {
        return;
      }

      /*
       * Cho phép ô nhập tạm thời rỗng
       * trong lúc người chơi đang sửa số.
       *
       * Giá trị rỗng sẽ được xử lý
       * thành 0 khi mất focus.
       */
      if (input.value === "") {
        shoppingCart[itemId] = 0;

        updatePreparationShoppingSummary();

        return;
      }

      const parsedValue =
        Number(input.value);

      if (
        !Number.isInteger(
          parsedValue
        ) ||
        parsedValue < 0
      ) {
        input.value =
          shoppingCart[itemId];

        return;
      }

      shoppingCart[itemId] =
        parsedValue;

      updatePreparationShoppingItem(
        itemId
      );

      updatePreparationShoppingSummary();
    }
  );

  shoppingContainer.addEventListener(
    "change",
    (event) => {
      const input =
        event.target.closest(
          '[data-action="input"][data-item-id]'
        );

      if (!input) {
        return;
      }

      const itemId =
        input.dataset.itemId;

      if (
        !SHOPPING_ITEMS.includes(
          itemId
        )
      ) {
        return;
      }

      let parsedValue =
        Number(input.value);

      if (
        !Number.isInteger(
          parsedValue
        ) ||
        parsedValue < 0
      ) {
        parsedValue = 0;
      }

      setShoppingQuantity(
        itemId,
        parsedValue
      );
    }
  );
}

function bindPreparationEvents(
  onDayStart
) {
  const completeButton =
    document.querySelector(
      "#complete-preparation-button"
    );

  const startButton =
    document.querySelector(
      "#start-day-button"
    );

  const errorElement =
    document.querySelector(
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

  completeButton.addEventListener(
    "click",
    () => {
      errorElement.textContent =
        "";

      const selectedItems =
        SHOPPING_ITEMS
          .filter(
            (itemId) =>
              shoppingCart[itemId] >
              0
          )
          .map(
            (itemId) => ({
              itemId,
              quantity:
                shoppingCart[itemId],
            })
          );

      const totalCost =
        calculateShoppingTotal();

      if (
        totalCost >
        getMoney()
      ) {
        errorElement.textContent =
          "Bạn không đủ tiền để mua số nguyên liệu này.";

        return;
      }

      try {
        if (
          selectedItems.length >
          0
        ) {
          buyItems(
            selectedItems
          );
        }

        completePreparation();

        startButton.disabled =
          !canStartDay();

        completeButton.disabled =
          true;

        errorElement.textContent =
          "";

        startButton.classList.add(
          "ready"
        );

        updatePreparationShoppingSummary();

        const moneyElement =
          document.querySelector(
            "#preparation-money"
          );

        if (moneyElement) {
          moneyElement.textContent =
            formatMoney(
              getMoney()
            );
        }
      } catch (error) {
        errorElement.textContent =
          error.message;
      }
    }
  );

  startButton.addEventListener(
    "click",
    () => {
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
    }
  );
}

export {
  renderPreparationScreen,
};