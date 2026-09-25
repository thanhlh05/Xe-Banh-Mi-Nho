import { renderHTML, formatMoney } from "../components/uiRenderer.js";
import { INGREDIENTS } from "../data/ingredients.js";

function renderStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function renderServingResultScreen(result, onContinue) {
  if (!result) {
    throw new Error(
      "servingResultScreen: không có kết quả phục vụ."
    );
  }

  const selectedNames = result.selectedIngredients
    .map(
      (ingredientId) =>
        INGREDIENTS[ingredientId]?.name || ingredientId
    )
    .join(", ");

  renderHTML(`
    <main class="screen serving-result-screen">
      <section class="game-card serving-result-card">

        <div class="result-icon">
          ${result.rating >= 4 ? "😊" : "😐"}
        </div>

        <h1>Phục vụ thành công!</h1>

        <h2>${result.customerName}</h2>

        <div class="rating-stars">
          ${renderStars(result.rating)}
        </div>

        <div class="result-level">
          ${getResultLevelText(result.resultLevel)}
        </div>

        <div class="result-details">

          <div>
            <span>Tiền nhận được</span>
            <strong>
              ${formatMoney(result.payment)}
            </strong>
          </div>

          <div>
            <span>Nguyên liệu đã chọn</span>
            <strong>${selectedNames || "Không có"}</strong>
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

  const continueButton = document.querySelector(
    "#continue-after-serving-button"
  );

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      if (typeof onContinue === "function") {
        onContinue();
      }
    });
  }
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

export { renderServingResultScreen };