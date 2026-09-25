import { renderHTML } from "../components/uiRenderer.js";

import {
  hasSaveGame,
  loadGame,
} from "../systems/saveSystem.js";

import {
  getDayFlowState,
  DAY_FLOW_STATES,
} from "../systems/dayFlowSystem.js";

import { renderShopNamingScreen } from "./shopNamingScreen.js";
import { renderInitialShoppingScreen } from "./initialShoppingScreen.js";
import { renderPreparationScreen } from "./preparationScreen.js";
import { renderGameplayScreen } from "./gameplayScreen.js";
import { renderDaySummaryScreen } from "./daySummaryScreen.js";

function renderMainMenu() {
  const hasSavedGame = hasSaveGame();

  renderHTML(`
    <main class="screen main-menu-screen">

      <section class="game-card main-menu-card">

        <div class="game-logo">

          <div class="logo-icon">
            🥖
          </div>

          <h1>
            XE BÁNH MÌ
          </h1>

          <p>
            Một ngày mới bắt đầu!
          </p>

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

        <p
          id="main-menu-error"
          class="form-error"
        ></p>

      </section>

    </main>
  `);

  bindMainMenuEvents();
}

function renderSavedGameByState() {
  const currentState =
    getDayFlowState();

  switch (currentState) {
    case DAY_FLOW_STATES.PREPARATION:
      renderPreparationScreen(() => {
        renderGameplayScreen();
      });
      return;

    case DAY_FLOW_STATES.PLAYING:
      renderGameplayScreen();
      return;

    case DAY_FLOW_STATES.DAY_ENDED:
    case DAY_FLOW_STATES.SUMMARY:
      renderDaySummaryScreen();
      return;

    default:
      throw new Error(
        `mainMenuScreen: không thể tiếp tục vì dayFlowState "${currentState}" không hợp lệ.`
      );
  }
}

function bindMainMenuEvents() {
  const startButton =
    document.querySelector(
      "#start-game-button"
    );

  const continueButton =
    document.querySelector(
      "#continue-game-button"
    );

  const settingsButton =
    document.querySelector(
      "#settings-button"
    );

  const errorElement =
    document.querySelector(
      "#main-menu-error"
    );

  if (startButton) {
    startButton.addEventListener(
      "click",
      () => {
        renderShopNamingScreen(() => {
          renderInitialShoppingScreen(() => {
            renderPreparationScreen(() => {
              renderGameplayScreen();
            });
          });
        });
      }
    );
  }

  if (continueButton) {
    continueButton.addEventListener(
      "click",
      () => {
        errorElement.textContent = "";

        try {
          const loaded =
            loadGame();

          if (!loaded) {
            errorElement.textContent =
              "Không tìm thấy dữ liệu game để tiếp tục.";

            return;
          }

          renderSavedGameByState();
        } catch (error) {
          console.error(error);

          errorElement.textContent =
            error.message ||
            "Không thể tải dữ liệu game.";
        }
      }
    );
  }

  if (settingsButton) {
    settingsButton.addEventListener(
      "click",
      () => {
        console.log(
          "Main Menu: mở cài đặt."
        );
      }
    );
  }
}

export {
  renderMainMenu,
};