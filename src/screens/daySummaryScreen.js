import { renderHTML, formatMoney } from "../components/uiRenderer.js";
import { getDaySummary } from "../systems/daySummarySystem.js";
import {
  prepareNextDay,
} from "../systems/dayFlowSystem.js";
import { saveGame } from "../systems/saveSystem.js";
import { renderPreparationScreen } from "./preparationScreen.js";
import { renderGameplayScreen } from "./gameplayScreen.js";

function renderDaySummaryScreen() {
  const summary = getDaySummary();

  const wasteEntries =
    Object.entries(summary.waste);

  const wasteHTML =
    wasteEntries.length === 0
      ? "<p>Không có nguyên liệu bị bỏ đi.</p>"
      : wasteEntries
          .map(
            ([itemId, quantity]) =>
              `<div>
                <span>${itemId}</span>
                <strong>${quantity}</strong>
              </div>`
          )
          .join("");

  renderHTML(`
    <main class="screen summary-screen">
      <section class="game-card summary-card">

        <div class="screen-header">
          <div class="screen-icon">🌙</div>

          <h1>Tổng kết ngày ${summary.day}</h1>

          <p>
            Một ngày bán hàng đã kết thúc.
          </p>
        </div>

        <div class="summary-stats">

          <div>
            <span>Doanh thu</span>
            <strong>
              ${formatMoney(summary.revenue)}
            </strong>
          </div>

          <div>
            <span>Chi phí nguyên liệu</span>
            <strong>
              ${formatMoney(summary.ingredientCost)}
            </strong>
          </div>

          <div>
            <span>Lợi nhuận</span>
            <strong>
              ${formatMoney(summary.profit)}
            </strong>
          </div>

          <div>
            <span>Khách hàng</span>
            <strong>
              ${summary.customers}
            </strong>
          </div>

          <div>
            <span>Bánh đã bán</span>
            <strong>
              ${summary.breadsSold}
            </strong>
          </div>

          <div>
            <span>Rating trung bình</span>
            <strong>
              ${
                summary.averageRating.toFixed(1)
              } ★
            </strong>
          </div>

        </div>

        <div class="summary-waste">
          <h2>Nguyên liệu bỏ đi</h2>

          ${wasteHTML}
        </div>

        <div class="summary-actions">

          <button
            id="next-day-button"
            type="button"
            class="game-button primary-button"
          >
            CHUẨN BỊ NGÀY TIẾP THEO
          </button>

          <button
            id="save-game-button"
            type="button"
            class="game-button secondary-button"
          >
            LƯU GAME
          </button>

        </div>

      </section>
    </main>
  `);

  bindSummaryEvents();
}

function bindSummaryEvents() {
  const nextDayButton = document.querySelector(
    "#next-day-button"
  );

  const saveButton = document.querySelector(
    "#save-game-button"
  );

  if (nextDayButton) {
    nextDayButton.addEventListener("click", () => {
      try {
        prepareNextDay();

        renderPreparationScreen(() => {
          renderGameplayScreen();
        });
      } catch (error) {
        console.error(error);
      }
    });
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      saveGame();

      saveButton.textContent = "ĐÃ LƯU ✓";

      setTimeout(() => {
        saveButton.textContent = "LƯU GAME";
      }, 1500);
    });
  }
}

export { renderDaySummaryScreen };