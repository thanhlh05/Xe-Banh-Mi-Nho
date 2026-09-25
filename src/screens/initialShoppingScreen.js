import { renderHTML, formatMoney } from "../components/uiRenderer.js";
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

function getItemDisplayName(itemId) {
  return INGREDIENTS[itemId]?.name || itemId;
}

function getItemCategory(itemId) {
  return INGREDIENTS[itemId]?.category || "";
}

/*
 * Nguyên liệu tươi:
 * - sử dụng trong ngày
 * - mỗi lần + / - thay đổi 5 đơn vị
 *
 * Gia vị:
 * - sử dụng lâu dài
 * - mỗi lần + / - thay đổi 1 đơn vị
 */
function getQuantityStep(itemId) {
  const category = getItemCategory(itemId);

  if (category === "fresh") {
    return 5;
  }

  return 1;
}

function calculateTotalCost() {
  let total = 0;

  for (const itemId of SHOPPING_ITEMS) {
    const quantity = shoppingCart[itemId] || 0;

    total +=
      SHOPPING_PRICES[itemId] *
      quantity;
  }

  return total;
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
          ${formatMoney(price)} / đơn vị
        </span>

      </div>

      <div class="quantity-control">

        <button
          type="button"
          class="quantity-button"
          data-action="decrease"
          data-item-id="${itemId}"
          aria-label="Giảm ${getItemDisplayName(itemId)}"
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
          aria-label="Số lượng ${getItemDisplayName(itemId)}"
        />

        <button
          type="button"
          class="quantity-button"
          data-action="increase"
          data-item-id="${itemId}"
          aria-label="Tăng ${getItemDisplayName(itemId)}"
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

        ${
          step === 5
            ? "Mỗi lần ±: 5"
            : "Mỗi lần ±: 1"
        }

      </div>

    </div>
  `;
}

function renderShoppingGroup(title, itemIds) {
  if (itemIds.length === 0) {
    return "";
  }

  return `
    <section class="shopping-group">

      <h3>
        ${title}
      </h3>

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

function updateShoppingItem(itemId) {
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

function updateShoppingSummary() {
  const totalElement =
    document.querySelector(
      "#initial-shopping-total"
    );

  const moneyElement =
    document.querySelector(
      "#initial-shopping-money"
    );

  if (totalElement) {
    totalElement.textContent =
      formatMoney(
        calculateTotalCost()
      );
  }

  if (moneyElement) {
    moneyElement.textContent =
      formatMoney(getMoney());
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

  if (!Number.isInteger(quantity)) {
    quantity = 0;
  }

  quantity = Math.max(
    0,
    quantity
  );

  shoppingCart[itemId] =
    quantity;

  updateShoppingItem(itemId);
  updateShoppingSummary();
}

function bindShoppingEvents(
  onComplete
) {
  const shoppingContainer =
    document.querySelector(
      "#initial-shopping-items"
    );

  const completeButton =
    document.querySelector(
      "#complete-initial-shopping-button"
    );

  const errorElement =
    document.querySelector(
      "#initial-shopping-error"
    );

  if (
    !shoppingContainer ||
    !completeButton ||
    !errorElement
  ) {
    throw new Error(
      "initialShoppingScreen: không tìm thấy phần tử giao diện cần thiết."
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

      updateShoppingItem(itemId);
      updateShoppingSummary();
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
       */
      if (input.value === "") {
        shoppingCart[itemId] = 0;

        updateShoppingSummary();

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

      updateShoppingItem(itemId);
      updateShoppingSummary();
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

  completeButton.addEventListener(
    "click",
    () => {
      errorElement.textContent = "";

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
        calculateTotalCost();

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

        completeButton.disabled =
          true;

        if (
          typeof onComplete ===
          "function"
        ) {
          onComplete();
        }
      } catch (error) {
        errorElement.textContent =
          error.message;
      }
    }
  );
}

function renderInitialShoppingScreen(
  onComplete
) {
  resetShoppingCart();

  renderHTML(`
    <main class="screen initial-shopping-screen">

      <section class="game-card shopping-card">

        <div class="screen-header">

          <div class="screen-icon">
            🛒
          </div>

          <h1>
            Mua nguyên liệu
          </h1>

          <p>
            Chuẩn bị nguyên liệu cho ngày bán đầu tiên.
          </p>

        </div>

        <div class="shopping-money">

          <span>
            Số tiền:
          </span>

          <strong
            id="initial-shopping-money"
          >
            ${formatMoney(getMoney())}
          </strong>

        </div>

        <div
          id="initial-shopping-items"
          class="shopping-items"
        >
          ${renderShoppingItems()}
        </div>

        <div class="shopping-summary">

          <div>
            Tổng tiền:

            <strong
              id="initial-shopping-total"
            >
              ${formatMoney(0)}
            </strong>
          </div>

        </div>

        <p
          id="initial-shopping-error"
          class="form-error"
        ></p>

        <button
          id="complete-initial-shopping-button"
          type="button"
          class="game-button primary-button"
        >
          HOÀN TẤT MUA HÀNG
        </button>

      </section>

    </main>
  `);

  bindShoppingEvents(onComplete);
  updateShoppingSummary();
}

export {
  renderInitialShoppingScreen,
};