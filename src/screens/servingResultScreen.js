import {
  renderHTML,
  formatMoney,
} from "../components/uiRenderer.js";

import { INGREDIENTS } from "../data/ingredients.js";
import { RECIPES } from "../data/recipes.js";

function renderStars(rating) {
  return (
    "★".repeat(rating) +
    "☆".repeat(5 - rating)
  );
}

function getResultTitle(level) {
  if (level === "PERFECT") {
    return "PHỤC VỤ THÀNH CÔNG!";
  }

  if (level === "GOOD") {
    return "PHỤC VỤ TẠM ỔN";
  }

  return "KẾT QUẢ PHỤC VỤ";
}

function getResultLevelText(level) {
  if (level === "PERFECT") {
    return "Hoàn hảo! ⭐";
  }

  if (level === "GOOD") {
    return "Khá tốt!";
  }

  return "Khách chưa hài lòng.";
}

function getResultIcon(level) {
  if (level === "PERFECT") {
    return "😊";
  }

  return "😐";
}

function renderSelectedIngredientNames(
  selectedIngredients
) {
  if (
    !selectedIngredients ||
    selectedIngredients.length === 0
  ) {
    return "Không có";
  }

  return selectedIngredients
    .map(
      (ingredientId) =>
        INGREDIENTS[ingredientId]?.name ||
        ingredientId
    )
    .join(", ");
}

function renderServingResultScreen(
  result,
  onContinue
) {
  if (!result) {
    throw new Error(
      "servingResultScreen: không có kết quả phục vụ."
    );
  }

  const recipe =
    RECIPES[result.recipeId];

  const recipeName = recipe
    ? recipe.name
    : result.recipeId;

  const selectedNames =
    renderSelectedIngredientNames(
      result.selectedIngredients
    );

  const ingredientCost =
    result.ingredientCost || 0;

  const profit =
    result.payment - ingredientCost;

  renderHTML(`
    <main class="screen serving-result-screen">

      <section class="game-card serving-result-card">

        <div class="result-icon">
          ${getResultIcon(
            result.resultLevel
          )}
        </div>

        <h1>
          ${getResultTitle(
            result.resultLevel
          )}
        </h1>

        <h2>
          ${result.customerName}
        </h2>

        <div class="rating-stars">
          ${renderStars(result.rating)}
        </div>

        <div class="result-level">
          ${getResultLevelText(
            result.resultLevel
          )}
        </div>

        <div class="customer-order result-order">

          <span>Món đã phục vụ</span>

          <strong>
            ${recipeName}
          </strong>

        </div>

        <div class="result-details">

          <div>
            <span>Tiền nhận được</span>

            <strong>
              ${formatMoney(
                result.payment
              )}
            </strong>
          </div>

          <div>
            <span>Chi phí nguyên liệu</span>

            <strong>
              ${formatMoney(
                ingredientCost
              )}
            </strong>
          </div>

          <div>
            <span>Lãi giao dịch</span>

            <strong>
              ${formatMoney(profit)}
            </strong>
          </div>

          <div>
            <span>Nguyên liệu đã chọn</span>

            <strong>
              ${selectedNames}
            </strong>
          </div>

        </div>

        <button
          id="continue-after-serving-button"
          type="button"
          class="game-button primary-button"
        >
          TIẾP TỤC
        </button>

      </section>

    </main>
  `);

  const continueButton =
    document.querySelector(
      "#continue-after-serving-button"
    );

  if (continueButton) {
    continueButton.addEventListener(
      "click",
      () => {
        if (
          typeof onContinue ===
          "function"
        ) {
          onContinue();
        }
      }
    );
  }
}

export {
  renderServingResultScreen,
};