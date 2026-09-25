import { renderHTML, formatMoney } from "../components/uiRenderer.js";
import { gameState } from "../game/gameState.js";
import {
  getCurrentTime,
} from "../systems/timeSystem.js";
import {
  getDayFlowState,
  DAY_FLOW_STATES,
  advanceDayTime,
  openDaySummary,
} from "../systems/dayFlowSystem.js";
import {
  createQueue,
  hasWaitingCustomer,
  getNextOrderId,
  moveToNextCustomer,
  getQueueLength,
} from "../systems/customerQueueSystem.js";
import {
  startCustomerVisit,
  hasActiveCustomer,
  getCurrentCustomer,
  getCurrentGameplayOrder,
  resetGameplay,
} from "../systems/gameplaySystem.js";
import { RECIPES } from "../data/recipes.js";
import { renderMakeBreadScreen } from "./makeBreadScreen.js";
import { renderServingResultScreen } from "./servingResultScreen.js";
import { renderDaySummaryScreen } from "./daySummaryScreen.js";

let queueInitializedDay = null;

const DAILY_ORDER_IDS = [
  "order_001",
  "order_002",
  "order_003",
  "order_005",
  "order_006",
];

function formatGameTime() {
  const time = getCurrentTime();

  return `${String(time.hour).padStart(2, "0")}:${String(
    time.minute
  ).padStart(2, "0")}`;
}

function initializeDailyQueue() {
  const currentDay = gameState.day.current;

  if (queueInitializedDay === currentDay && getQueueLength() > 0) {
    return;
  }

  createQueue(DAILY_ORDER_IDS);
  queueInitializedDay = currentDay;
}

function renderGameplayScreen() {
  initializeDailyQueue();

  renderHTML(`
    <main class="screen gameplay-screen">

      <section class="gameplay-container">

        <header class="gameplay-header">

          <div>
            <span>Ngày</span>
            <strong>${gameState.day.current}</strong>
          </div>

          <div>
            <span>Giờ</span>
            <strong id="game-time">
              ${formatGameTime()}
            </strong>
          </div>

          <div>
            <span>Tiền</span>
            <strong id="game-money">
              ${formatMoney(gameState.player.money)}
            </strong>
          </div>

        </header>

        <section
          id="customer-area"
          class="customer-area"
        >
          ${renderCustomerArea()}
        </section>

        <section class="gameplay-actions">

          <button
            id="advance-time-button"
            type="button"
            class="game-button secondary-button"
          >
            ⏩ Thời gian +30 phút
          </button>

        </section>

      </section>

    </main>
  `);

  bindGameplayEvents();
}

function renderCustomerArea() {
  if (hasActiveCustomer()) {
    const customer = getCurrentCustomer();
    const order = getCurrentGameplayOrder();
    const recipe = RECIPES[order.recipeId];

    return `
      <div class="customer-card active-customer">

        <div class="customer-icon">👤</div>

        <h2>${customer.name}</h2>

        <p class="customer-type">
          ${customer.type}
        </p>

        <div class="customer-order">
          <span>Khách gọi:</span>
          <strong>${recipe.name}</strong>
        </div>

        <button
          id="serve-customer-button"
          type="button"
          class="game-button primary-button"
        >
          LÀM BÁNH
        </button>

      </div>
    `;
  }

  if (hasWaitingCustomer()) {
    const nextOrderId = getNextOrderId();

    return `
      <div class="customer-card waiting-customer">

        <div class="customer-icon">👋</div>

        <h2>Có khách đang chờ!</h2>

        <p>
          Một khách hàng muốn mua bánh mì.
        </p>

        <button
          id="next-customer-button"
          type="button"
          class="game-button primary-button"
        >
          GỌI KHÁCH
        </button>

        <small>
          Order: ${nextOrderId}
        </small>

      </div>
    `;
  }

  return `
    <div class="customer-card no-customer">

      <div class="customer-icon">🪑</div>

      <h2>Chưa có khách</h2>

      <p>
        Hãy chờ thêm một chút...
      </p>

    </div>
  `;
}

function refreshGameplay() {
  const customerArea =
    document.querySelector("#customer-area");

  const timeElement =
    document.querySelector("#game-time");

  const moneyElement =
    document.querySelector("#game-money");

  if (customerArea) {
    customerArea.innerHTML = renderCustomerArea();
  }

  if (timeElement) {
    timeElement.textContent = formatGameTime();
  }

  if (moneyElement) {
    moneyElement.textContent =
      formatMoney(gameState.player.money);
  }

  bindCustomerButton();
}

function bindCustomerButton() {
  const nextCustomerButton = document.querySelector(
    "#next-customer-button"
  );

  if (nextCustomerButton) {
    nextCustomerButton.addEventListener("click", () => {
      try {
        const orderId = moveToNextCustomer();

        if (!orderId) {
          return;
        }

        startCustomerVisit(orderId);

        refreshGameplay();
      } catch (error) {
        console.error(error);
      }
    });
  }

  const serveButton = document.querySelector(
    "#serve-customer-button"
  );

  if (serveButton) {
    serveButton.addEventListener("click", () => {
      try {
        renderMakeBreadScreen((result) => {
          renderServingResultScreen(result, () => {
            renderGameplayScreen();
          });
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}

function bindGameplayEvents() {
  const advanceButton = document.querySelector(
    "#advance-time-button"
  );

  if (advanceButton) {
    advanceButton.addEventListener("click", () => {
      if (
        getDayFlowState() !== DAY_FLOW_STATES.PLAYING
      ) {
        return;
      }

      try {
        advanceDayTime(30);

        if (
          getDayFlowState() === DAY_FLOW_STATES.DAY_ENDED
        ) {
          resetGameplay();

          openDaySummary();

          renderDaySummaryScreen();

          return;
        }

        refreshGameplay();
      } catch (error) {
        console.error(error);
      }
    });
  }

  bindCustomerButton();
}

export { renderGameplayScreen, refreshGameplay };