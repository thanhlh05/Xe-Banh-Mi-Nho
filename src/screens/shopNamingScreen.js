import { renderHTML } from "../components/uiRenderer.js";
import { gameState } from "../game/gameState.js";

function renderShopNamingScreen(onComplete) {
  renderHTML(`
    <main class="screen shop-naming-screen">
      <section class="game-card shop-naming-card">
        <div class="screen-header">
          <div class="screen-icon">🏪</div>
          <h1>Đặt tên xe</h1>
          <p>Hãy đặt một cái tên thật đặc biệt cho xe bánh mì của bạn.</p>
        </div>

        <form id="shop-naming-form" class="game-form">
          <label for="shop-name-input">
            Tên xe bánh mì
          </label>

          <input
            id="shop-name-input"
            name="shopName"
            type="text"
            maxlength="30"
            placeholder="Ví dụ: Bánh Mì Thanh"
            autocomplete="off"
            required
          />

          <p id="shop-name-error" class="form-error"></p>

          <button
            type="submit"
            class="game-button primary-button"
          >
            XÁC NHẬN
          </button>
        </form>
      </section>
    </main>
  `);

  const form = document.querySelector("#shop-naming-form");
  const input = document.querySelector("#shop-name-input");
  const errorElement = document.querySelector("#shop-name-error");

  if (!form || !input || !errorElement) {
    throw new Error(
      "shopNamingScreen: không tìm thấy phần tử giao diện cần thiết."
    );
  }

  input.value = gameState.shop.name || "";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const shopName = input.value.trim();

    if (shopName.length < 2) {
      errorElement.textContent =
        "Tên xe phải có ít nhất 2 ký tự.";

      return;
    }

    gameState.shop.name = shopName;

    errorElement.textContent = "";

    if (typeof onComplete === "function") {
      onComplete(shopName);
    }
  });
}

export { renderShopNamingScreen };