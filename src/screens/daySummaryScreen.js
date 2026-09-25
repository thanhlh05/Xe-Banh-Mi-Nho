import {
  renderHTML,
  formatMoney,
} from "../components/uiRenderer.js";

import {
  getDaySummary,
} from "../systems/daySummarySystem.js";

import {
  getDayFlowState,
  DAY_FLOW_STATES,
  prepareNextDay,
  openDaySummary,
} from "../systems/dayFlowSystem.js";

import {
  saveGame,
} from "../systems/saveSystem.js";

import {
  renderPreparationScreen,
} from "./preparationScreen.js";

import {
  renderGameplayScreen,
} from "./gameplayScreen.js";

import {
  INGREDIENTS,
} from "../data/ingredients.js";

function renderDaySummaryScreen() {
  const currentState =
    getDayFlowState();

  if (
    currentState !==
      DAY_FLOW_STATES.SUMMARY &&
    currentState !==
      DAY_FLOW_STATES.DAY_ENDED
  ) {
    throw new Error(
      `daySummaryScreen: không thể mở tổng kết khi trạng thái hiện tại là "${currentState}".`
    );
  }

  /*
  * Nếu save đang ở DAY_ENDED,
  * chuyển sang SUMMARY trước khi hiển thị.
  *
  * Nếu đã là SUMMARY thì giữ nguyên.
  */
  if (
    currentState ===
    DAY_FLOW_STATES.DAY_ENDED
  ) {
    openDaySummary();
  }

  const summary =
    getDaySummary();

  const wasteEntries =
    Object.entries(
      summary.waste
    );

  const wasteHTML =
  wasteEntries.length === 0
    ? "<p>Không có nguyên liệu bị bỏ đi.</p>"
    : wasteEntries
        .map(([itemId, quantity]) => {
          const ingredient = INGREDIENTS[itemId];

          const ingredientName =
            ingredient?.name ?? itemId;

          return `
            <div>
              <span>${ingredientName}</span>
              <strong>${quantity}</strong>
            </div>
          `;
        })
        .join("");

  renderHTML(`
    <main class="screen summary-screen">
      <section class="game-card summary-card">

        <div class="screen-header">
          <div class="screen-icon">🌙</div>

            <h1>
              HẾT NGÀY
            </h1>

            <p>
              Ngày ${summary.day}
            </p>
        </div>

        <div class="summary-stats">

          <div>
            <span>👥 Khách hàng</span>
            <strong>
              ${summary.customers}
            </strong>
          </div>

          <div>
            <span>🥖 Bánh bán</span>
            <strong>
              ${summary.breadsSold}
            </strong>
          </div>

          <div>
            <span>💰 Doanh thu</span>
            <strong>
              ${formatMoney(summary.revenue)}
            </strong>
          </div>

          <div>
            <span>🛒 Chi phí</span>
            <strong>
              ${formatMoney(summary.ingredientCost)}
            </strong>
          </div>

          <div>
            <span>📈 Lợi nhuận</span>
            <strong>
              ${formatMoney(summary.profit)}
            </strong>
          </div>

          <div>
            <span>⭐ Đánh giá</span>
            <strong>
              ${summary.averageRating.toFixed(1)}
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
            TIẾP TỤC CHUẨN BỊ
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
  const nextDayButton =
    document.querySelector(
      "#next-day-button"
    );

  const saveButton =
    document.querySelector(
      "#save-game-button"
    );

  if (nextDayButton) {
    nextDayButton.addEventListener(
      "click",
      () => {
        try {
          prepareNextDay();

          renderPreparationScreen(
            () => {
              renderGameplayScreen();
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      () => {
        saveGame();

        saveButton.textContent =
          "ĐÃ LƯU ✓";

        setTimeout(() => {
          saveButton.textContent =
            "LƯU GAME";
        }, 1500);
      }
    );
  }
}



export {
  renderDaySummaryScreen,
};