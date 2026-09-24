import { gameState } from "../game/gameState.js";
import { getMoney } from "./moneySystem.js";
import { getItemQuantity } from "./inventorySystem.js";
import {
  getDayFlowState,
  startDay,
  DAY_FLOW_STATES,
} from "./dayFlowSystem.js";

let preparationCompleted = false;

function getPreparationStatus() {
  return {
    day: gameState.day.current,
    money: getMoney(),
    bread: getItemQuantity("bread"),
    meat: getItemQuantity("meat"),
    cha: getItemQuantity("cha"),
    pate: getItemQuantity("pate"),
    vegetables: getItemQuantity("vegetables"),
    cucumber: getItemQuantity("cucumber"),
    egg: getItemQuantity("egg"),
    state: getDayFlowState(),
    completed: preparationCompleted,
  };
}

function completePreparation() {
  if (getDayFlowState() !== DAY_FLOW_STATES.PREPARATION) {
    throw new Error(
      `preparationSystem: không thể hoàn thành chuẩn bị khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  preparationCompleted = true;

  return getPreparationStatus();
}

function canStartDay() {
  return (
    getDayFlowState() === DAY_FLOW_STATES.PREPARATION &&
    preparationCompleted
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
  preparationCompleted = false;

  return result;
}

function resetPreparation() {
  preparationCompleted = false;
}

export {
  getPreparationStatus,
  completePreparation,
  canStartDay,
  startPreparedDay,
  resetPreparation,
};