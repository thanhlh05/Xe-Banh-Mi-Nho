import { renderHTML } from "../components/uiRenderer.js";
import { INGREDIENTS } from "../data/ingredients.js";
import { RECIPES } from "../data/recipes.js";

import {
  getCurrentCustomer,
  getCurrentGameplayOrder,
  finishCurrentSale,
} from "../systems/gameplaySystem.js";

import {
  toggleIngredient,
  getSelectedIngredients,
  resetSelection,
} from "../systems/ingredientSelectionSystem.js";

import {
  getItemQuantity,
} from "../systems/inventorySystem.js";

const SELECTABLE_INGREDIENTS = [
  "bread",
  "meat",
  "cha",
  "pate",
  "egg",
  "vegetables",
  "cucumber",
];

function renderIngredientButtons() {
  return SELECTABLE_INGREDIENTS.map((ingredientId) => {
    const quantity = getItemQuantity(ingredientId);
    const isOutOfStock = quantity <= 0;

    return `
      <button
        type="button"
        class="ingredient-button"
        data-ingredient-id="${ingredientId}"
        ${isOutOfStock ? "disabled" : ""}
      >
        <span>
          ${INGREDIENTS[ingredientId].name}
        </span>

        <span class="ingredient-quantity">
          Còn: ${quantity}
        </span>

        <span
          class="ingredient-check"
          data-check-for="${ingredientId}"
        >
          ○
        </span>
      </button>
    `;
  }).join("");
}

function renderSelectedIngredients() {
  const selected = getSelectedIngredients();

  if (selected.length === 0) {
    return "Chưa chọn nguyên liệu";
  }

  return selected
    .map((ingredientId) => INGREDIENTS[ingredientId].name)
    .join(", ");
}

function renderMakeBreadScreen(onResult) {
  const customer = getCurrentCustomer();
  const order = getCurrentGameplayOrder();

  if (!customer || !order) {
    throw new Error(
      "makeBreadScreen: hiện không có khách hàng đang được xử lý."
    );
  }

  const recipe = RECIPES[order.recipeId];

  if (!recipe) {
    throw new Error(
      `makeBreadScreen: recipeId "${order.recipeId}" không tồn tại.`
    );
  }

  resetSelection();

  renderHTML(`
    <main class="screen make-bread-screen">
      <section class="game-card make-bread-card">

        <div class="screen-header">
          <div class="screen-icon">🥖</div>

          <h1>Làm bánh</h1>

          <p>
            Khách hàng:
            <strong>${customer.name}</strong>
          </p>
        </div>

        <div class="customer-order">
          <span>Khách gọi:</span>
          <strong>${recipe.name}</strong>
        </div>

        <h2>Chọn nguyên liệu</h2>

        <div class="ingredient-selection">
          ${renderIngredientButtons()}
        </div>

        <div class="selected-ingredients">
          <span>Đã chọn:</span>

          <strong id="selected-ingredients-text">
            Chưa chọn nguyên liệu
          </strong>
        </div>

        <p id="make-bread-error" class="form-error"></p>

        <button
          id="confirm-bread-button"
          type="button"
          class="game-button primary-button"
        >
          HOÀN TẤT LÀM BÁNH
        </button>

      </section>
    </main>
  `);

  bindMakeBreadEvents(onResult);
}

function refreshSelectedIngredients() {
  const selectedText = document.querySelector(
    "#selected-ingredients-text"
  );

  if (selectedText) {
    selectedText.textContent =
      renderSelectedIngredients();
  }

  document
    .querySelectorAll("[data-check-for]")
    .forEach((checkElement) => {
      const ingredientId =
        checkElement.dataset.checkFor;

      const selected =
        getSelectedIngredients().includes(ingredientId);

      checkElement.textContent =
        selected ? "✓" : "○";
    });
}

function bindMakeBreadEvents(onResult) {
  const ingredientSelection =
    document.querySelector(".ingredient-selection");

  const confirmButton =
    document.querySelector("#confirm-bread-button");

  const errorElement =
    document.querySelector("#make-bread-error");

  if (
    !ingredientSelection ||
    !confirmButton ||
    !errorElement
  ) {
    throw new Error(
      "makeBreadScreen: không tìm thấy phần tử giao diện cần thiết."
    );
  }

  ingredientSelection.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        "[data-ingredient-id]"
      );

      if (!button || button.disabled) {
        return;
      }

      toggleIngredient(
        button.dataset.ingredientId
      );

      errorElement.textContent = "";

      refreshSelectedIngredients();
    }
  );

  confirmButton.addEventListener("click", () => {
    errorElement.textContent = "";

    try {
      const result = finishCurrentSale();

      if (typeof onResult === "function") {
        onResult(result);
      }
    } catch (error) {
      errorElement.textContent = error.message;
    }
  });
}

export {
  renderMakeBreadScreen,
};