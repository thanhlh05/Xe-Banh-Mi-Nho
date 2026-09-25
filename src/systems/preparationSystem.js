import { gameState } from "../game/gameState.js";
import { getMoney } from "./moneySystem.js";
import { getItemQuantity } from "./inventorySystem.js";
import { autoSave } from "./autoSaveSystem.js";

import {
  getDayFlowState,
  startDay,
  DAY_FLOW_STATES,
} from "./dayFlowSystem.js";

function ensurePreparationState() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (
    typeof gameState.runtime
      .preparationCompleted !== "boolean"
  ) {
    gameState.runtime.preparationCompleted =
      false;
  }
}

function getPreparationStatus() {
  ensurePreparationState();

  return {
    day: gameState.day.current,
    money: getMoney(),
    bread: getItemQuantity("bread"),
    meat: getItemQuantity("meat"),
    cha: getItemQuantity("cha"),
    pate: getItemQuantity("pate"),
    vegetables:
      getItemQuantity("vegetables"),
    cucumber:
      getItemQuantity("cucumber"),
    egg: getItemQuantity("egg"),
    state: getDayFlowState(),
    completed:
      gameState.runtime
        .preparationCompleted,
  };
}

function completePreparation() {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PREPARATION
  ) {
    throw new Error(
      `preparationSystem: không thể hoàn thành chuẩn bị khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  ensurePreparationState();

  gameState.runtime.preparationCompleted =
    true;

  /*
   * Auto Save sau khi người chơi
   * hoàn thành bước Preparation.
   *
   * Lúc này gameState đã chứa:
   * - tên xe
   * - tiền
   * - inventory
   * - ngày hiện tại
   * - preparationCompleted = true
   */
  autoSave();

  return getPreparationStatus();
}

function canStartDay() {
  ensurePreparationState();

  return (
    getDayFlowState() ===
      DAY_FLOW_STATES.PREPARATION &&
    gameState.runtime
      .preparationCompleted === true
  );
}

function startPreparedDay() {
  if (!canStartDay()) {
    throw new Error(
      "preparationSystem: chưa thể bắt đầu ngày. " +
        "Hãy hoàn thành bước chuẩn bị trước."
    );
  }

  const result = startDay();

  ensurePreparationState();

  gameState.runtime.preparationCompleted =
    false;

  /*
   * startDay() đã chuyển game sang PLAYING.
   *
   * Sau đó preparationCompleted được
   * reset về false vì bước Preparation
   * của ngày này đã kết thúc.
   *
   * Auto Save ở đây sẽ lưu:
   * - day hiện tại
   * - thời gian 06:00
   * - dayFlowState = PLAYING
   * - preparationCompleted = false
   */
  autoSave();

  return result;
}

function resetPreparation() {
  ensurePreparationState();

  gameState.runtime.preparationCompleted =
    false;
}

export {
  getPreparationStatus,
  completePreparation,
  canStartDay,
  startPreparedDay,
  resetPreparation,
};