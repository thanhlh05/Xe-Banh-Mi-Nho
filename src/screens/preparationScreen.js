import { renderHTML, formatMoney } from "../components/uiRenderer.js";
import { gameState } from "../game/gameState.js";
import {
  getPreparationStatus,
  completePreparation,
  canStartDay,
  startPreparedDay,
} from "../systems/preparationSystem.js";
import { getCurrentDay } from "../systems/daySystem.js";

function renderInventoryItem(name, quantity) {
  return `
    <div class="preparation-item">
      <span>${name}</span>
      <strong>${quantity}</strong>
    </div>
  `;
}

function renderPreparationScreen(onDayStart) {
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
            <strong>${formatMoney(status.money)}</strong>
          </div>
        </div>

        <h2>Nguyên liệu</h2>

        <div class="preparation-inventory">
          ${renderInventoryItem("🥖 Bánh mì", status.bread)}
          ${renderInventoryItem("🥩 Thịt", status.meat)}
          ${renderInventoryItem("🥓 Chả", status.cha)}
          ${renderInventoryItem("🥫 Pate", status.pate)}
          ${renderInventoryItem("🥬 Rau", status.vegetables)}
          ${renderInventoryItem("🥒 Dưa leo", status.cucumber)}
          ${renderInventoryItem("🥚 Trứng", status.egg)}
        </div>

        <p id="preparation-error" class="form-error"></p>

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

  if (!completeButton || !startButton || !errorElement) {
    throw new Error(
      "preparationScreen: không tìm thấy phần tử giao diện cần thiết."
    );
  }

  completeButton.addEventListener("click", () => {
    try {
      completePreparation();

      startButton.disabled = !canStartDay();
      completeButton.disabled = true;
      errorElement.textContent = "";
      startButton.classList.add("ready");
    } catch (error) {
      errorElement.textContent = error.message;
    }
  });

  startButton.addEventListener("click", () => {
    try {
      const result = startPreparedDay();

      if (typeof onDayStart === "function") {
        onDayStart(result);
      }
    } catch (error) {
      errorElement.textContent = error.message;
    }
  });
}

export { renderPreparationScreen };