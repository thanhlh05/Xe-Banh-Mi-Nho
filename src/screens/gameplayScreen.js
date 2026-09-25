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
  getQueueLength,
} from "../systems/customerQueueSystem.js";

import {
  hasActiveCustomer,
  getCurrentCustomer,
  getCurrentGameplayOrder,
  getLastSaleResult,
  clearLastSaleResult,
  resetGameplay,
} from "../systems/gameplaySystem.js";

import {
  shouldSpawnCustomer,
  spawnNextCustomer,
  getSpawnedOrders,
  resetSpawnSystem,
} from "../systems/customerSpawnSystem.js";

import {
  getCustomerHint,
  getAllRegularCustomers,
} from "../systems/regularCustomerSystem.js";

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

  const savedQueue =
    gameState.runtime?.customerQueue;

  const savedSpawn =
    gameState.runtime?.customerSpawn;

  const queueBelongsToCurrentDay =
    savedQueue &&
    savedQueue.day === currentDay;

  const spawnBelongsToCurrentDay =
    savedSpawn &&
    savedSpawn.day === currentDay;

  if (
    queueBelongsToCurrentDay &&
    spawnBelongsToCurrentDay
  ) {
    return;
  }

  createQueue(DAILY_ORDER_IDS);

  resetSpawnSystem();
}

function trySpawnCustomer() {
  if (!shouldSpawnCustomer()) {
    return false;
  }

  const result = spawnNextCustomer();

  return result !== null;
}

function getCustomerProgress() {
  const totalCustomers = getQueueLength();
  const spawnedCustomers = getSpawnedOrders().length;

  return {
    totalCustomers,
    spawnedCustomers,
  };
}

function renderGameplayScreen() {
  initializeDailyQueue();

  const lastSaleResult =
    getLastSaleResult();

  if (lastSaleResult) {
    renderServingResultScreen(
      lastSaleResult,
      () => {
        clearLastSaleResult();
        renderGameplayScreen();
      }
    );

    return;
  }

  if (hasActiveCustomer()) {
    renderMakeBreadScreen((result) => {
      renderServingResultScreen(result, () => {
        clearLastSaleResult();
        renderGameplayScreen();
      });
    });

    return;
  }

  trySpawnCustomer();

  if (hasActiveCustomer()) {
    renderMakeBreadScreen((result) => {
      renderServingResultScreen(result, () => {
        clearLastSaleResult();
        renderGameplayScreen();
      });
    });

    return;
  }

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

        <section class="gameplay-progress">
          ${renderCustomerProgress()}
        </section>

        <section class="gameplay-actions">

          <button
            id="regular-customers-button"
            type="button"
            class="game-button secondary-button"
          >
            📖 SỔ KHÁCH QUEN
          </button>

          <button
            id="advance-time-button"
            type="button"
            class="game-button secondary-button"
          >
            ⏩ Thời gian +30 phút
          </button>

        </section>

        <section
          id="regular-customers-area"
          class="regular-customers-area"
          hidden
        >
          ${renderRegularCustomersBook()}
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

    const customerHint = getCustomerHint(customer.id);

    return `
      <div class="customer-card active-customer">

        <div class="customer-icon">👤</div>

        <h2>${customer.name}</h2>

        <p class="customer-type">
          ${customer.type}
        </p>

        ${
          customerHint
            ? `
              <div class="regular-customer-hint">

                <strong>⭐ KHÁCH QUEN</strong>

                <span>
                  Đã ghé: ${customerHint.visitCount} lần
                </span>

                <span>
                  Món thường gọi:
                  ${
                    RECIPES[customerHint.usualOrder]
                      ? RECIPES[customerHint.usualOrder].name
                      : customerHint.usualOrder
                  }
                </span>

                <p>
                  💬 ${customerHint.message}
                </p>

              </div>
            `
            : ""
        }

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

  const progress = getCustomerProgress();

  if (
    progress.spawnedCustomers >= progress.totalCustomers &&
    progress.totalCustomers > 0
  ) {
    return `
      <div class="customer-card no-customer">

        <div class="customer-icon">🌙</div>

        <h2>Hôm nay hết khách</h2>

        <p>
          Bạn đã phục vụ hết khách trong ngày.
        </p>

      </div>
    `;
  }

  const currentTime = getCurrentTime();

  if (
    currentTime.hour < 6 ||
    (
      currentTime.hour === 6 &&
      currentTime.minute < 30
    )
  ) {
    return `
      <div class="customer-card waiting-customer">

        <div class="customer-icon">🕐</div>

        <h2>Chưa tới giờ khách</h2>

        <p>
          Khách đầu tiên sẽ xuất hiện lúc 06:30.
        </p>

      </div>
    `;
  }

  return `
    <div class="customer-card waiting-customer">

      <div class="customer-icon">👋</div>

      <h2>Đang chờ khách</h2>

      <p>
        Hãy tiếp tục theo dõi thời gian.
      </p>

    </div>
  `;
}

function renderCustomerProgress() {
  const progress = getCustomerProgress();

  return `
    <div class="customer-progress-card">

      <div>
        <span>Khách hôm nay</span>
        <strong>
          ${progress.spawnedCustomers} / ${progress.totalCustomers}
        </strong>
      </div>

      <div>
        <span>Rating</span>
        <strong>
          ${gameState.player.rating.toFixed(1)} ★
        </strong>
      </div>

    </div>
  `;
}

function renderRegularCustomersBook() {
  const regularCustomers = getAllRegularCustomers();

  if (regularCustomers.length === 0) {
    return `
      <div class="regular-customers-card">

        <h2>📖 Sổ khách quen</h2>

        <p>
          Chưa có khách nào được ghi vào sổ.
        </p>

      </div>
    `;
  }

  const customerHTML = regularCustomers
    .map((customer) => {
      const recipe = RECIPES[customer.usualOrder];

      return `
        <div class="regular-customer-item">

          <div class="regular-customer-name">
            👤 ${customer.name}
          </div>

          <div>
            Đã ghé:
            <strong>${customer.visitCount} lần</strong>
          </div>

          <div>
            Món thường gọi:
            <strong>
              ${recipe ? recipe.name : customer.usualOrder}
            </strong>
          </div>

          ${
            customer.notes
              ? `
                <div class="regular-customer-note">
                  📝 ${customer.notes}
                </div>
              `
              : ""
          }

        </div>
      `;
    })
    .join("");

  return `
    <div class="regular-customers-card">

      <h2>📖 Sổ khách quen</h2>

      <div class="regular-customers-list">
        ${customerHTML}
      </div>

    </div>
  `;
}

function refreshRegularCustomersBook() {
  const area = document.querySelector(
    "#regular-customers-area"
  );

  if (!area) {
    return;
  }

  area.innerHTML = renderRegularCustomersBook();
}

function bindRegularCustomersButton() {
  const button = document.querySelector(
    "#regular-customers-button"
  );

  const area = document.querySelector(
    "#regular-customers-area"
  );

  if (!button || !area) {
    return;
  }

  button.addEventListener("click", () => {
    const isHidden = area.hidden;

    area.hidden = !isHidden;

    if (!isHidden) {
      button.textContent = "📖 SỔ KHÁCH QUEN";
      return;
    }

    refreshRegularCustomersBook();

    button.textContent = "📕 ĐÓNG SỔ KHÁCH QUEN";
  });
}

function refreshGameplay() {
  trySpawnCustomer();

  const customerArea =
    document.querySelector("#customer-area");

  const progressArea =
    document.querySelector(".gameplay-progress");

  const timeElement =
    document.querySelector("#game-time");

  const moneyElement =
    document.querySelector("#game-money");

  if (customerArea) {
    customerArea.innerHTML = renderCustomerArea();
  }

  if (progressArea) {
    progressArea.innerHTML = renderCustomerProgress();
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

  bindRegularCustomersButton();
  bindCustomerButton();
}

export {
  renderGameplayScreen,
  refreshGameplay,
};