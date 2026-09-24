import { renderHTML } from "../components/uiRenderer.js";
import { hasSaveGame } from "../systems/saveSystem.js";
import { renderShopNamingScreen } from "./shopNamingScreen.js";
import { renderInitialShoppingScreen } from "./initialShoppingScreen.js";

function renderMainMenu() {
  const hasSavedGame = hasSaveGame();

  renderHTML(`
    <main class="screen main-menu-screen">
      <section class="game-card main-menu-card">
        <div class="game-logo">
          <div class="logo-icon">🥖</div>
          <h1>XE BÁNH MÌ</h1>
          <p>Một ngày mới bắt đầu!</p>
        </div>

        <div class="main-menu-actions">
          <button
            id="start-game-button"
            class="game-button primary-button"
            type="button"
          >
            BẮT ĐẦU BÁN
          </button>

          ${
            hasSavedGame
              ? `
                <button
                  id="continue-game-button"
                  class="game-button secondary-button"
                  type="button"
                >
                  TIẾP TỤC
                </button>
              `
              : ""
          }

          <button
            id="settings-button"
            class="game-button secondary-button"
            type="button"
          >
            CÀI ĐẶT
          </button>
        </div>
      </section>
    </main>
  `);

  bindMainMenuEvents();
}

function bindMainMenuEvents() {
  const startButton = document.querySelector("#start-game-button");

  if (startButton) {
    startButton.addEventListener("click", () => {
      renderShopNamingScreen((shopName) => {
        renderInitialShoppingScreen(() => { 
            console.log("Đã hoàn tất mua nguyên liệu.");
        });
      });
    });
  }

  const continueButton = document.querySelector("#continue-game-button");

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      console.log("Main Menu: tiếp tục game.");
    });
  }

  const settingsButton = document.querySelector("#settings-button");

  if (settingsButton) {
    settingsButton.addEventListener("click", () => {
      console.log("Main Menu: mở cài đặt.");
    });
  }
}

export { renderMainMenu };