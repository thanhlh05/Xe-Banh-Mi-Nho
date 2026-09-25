import {
  getCurrentTime,
  resetDayTime,
  advanceTime,
  isDayEnded,
} from "./timeSystem.js";

import {
  getCurrentDay,
  nextDay,
} from "./daySystem.js";

import {
  startDayStatistics,
} from "./statisticsSystem.js";

import {
  discardFreshIngredients,
} from "./endDaySystem.js";

import {
  getDaySummary,
} from "./daySummarySystem.js";

import {
  autoSave,
} from "./autoSaveSystem.js";

import { gameState } from "../game/gameState.js";

const DAY_FLOW_STATES = {
  PREPARATION: "PREPARATION",
  PLAYING: "PLAYING",
  DAY_ENDED: "DAY_ENDED",
  SUMMARY: "SUMMARY",
};

function ensureRuntime() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (
    typeof gameState.runtime.dayFlowState !==
    "string"
  ) {
    gameState.runtime.dayFlowState =
      DAY_FLOW_STATES.PREPARATION;
  }
}

function getDayFlowState() {
  ensureRuntime();

  return gameState.runtime.dayFlowState;
}

function setDayFlowState(state) {
  ensureRuntime();

  const isValidState =
    Object.values(DAY_FLOW_STATES).includes(
      state
    );

  if (!isValidState) {
    throw new Error(
      `dayFlowSystem: state "${state}" không hợp lệ.`
    );
  }

  gameState.runtime.dayFlowState =
    state;
}

function startDay() {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PREPARATION
  ) {
    throw new Error(
      `dayFlowSystem: không thể bắt đầu ngày mới khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  resetDayTime();

  startDayStatistics();

  setDayFlowState(
    DAY_FLOW_STATES.PLAYING
  );

  return {
    day: getCurrentDay(),
    time: getCurrentTime(),
    state: getDayFlowState(),
  };
}

function advanceDayTime(minutes) {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PLAYING
  ) {
    throw new Error(
      `dayFlowSystem: không thể tăng thời gian khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  const newTime =
    advanceTime(minutes);

  if (isDayEnded()) {
    endDay();
  }

  return newTime;
}

function endDay() {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.PLAYING
  ) {
    throw new Error(
      `dayFlowSystem: không thể kết thúc ngày khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  discardFreshIngredients();

  setDayFlowState(
    DAY_FLOW_STATES.DAY_ENDED
  );

  /*
   * Auto Save ngay khi ngày kết thúc.
   *
   * Lúc này:
   * - thời gian đã là 22:00
   * - nguyên liệu tươi đã được bỏ đi
   * - dayFlowState = DAY_ENDED
   * - dayStatistics đã được cập nhật
   *
   * Vì vậy người chơi có thể F5
   * mà không mất tiến trình của ngày vừa chơi.
   */
  autoSave();

  return getDaySummary();
}

function openDaySummary() {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.DAY_ENDED
  ) {
    throw new Error(
      `dayFlowSystem: không thể mở summary khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  setDayFlowState(
    DAY_FLOW_STATES.SUMMARY
  );

  /*
   * Auto Save sau khi chuyển sang
   * màn hình SUMMARY.
   *
   * Điều này giúp LocalStorage phản ánh
   * chính xác vị trí hiện tại của người chơi.
   */
  autoSave();

  return getDaySummary();
}

function prepareNextDay() {
  if (
    getDayFlowState() !==
    DAY_FLOW_STATES.SUMMARY
  ) {
    throw new Error(
      `dayFlowSystem: không thể chuẩn bị ngày tiếp theo khi trạng thái hiện tại là "${getDayFlowState()}".`
    );
  }

  nextDay();

  resetDayTime();

  setDayFlowState(
    DAY_FLOW_STATES.PREPARATION
  );

  /*
   * Auto Save NGAY LẬP TỨC khi chuyển
   * sang ngày mới.
   *
   * Người chơi chưa cần hoàn thành
   * Preparation vẫn được lưu:
   *
   * day = ngày mới
   * time = 06:00
   * state = PREPARATION
   */
  autoSave();

  return {
    day: getCurrentDay(),
    time: getCurrentTime(),
    state: getDayFlowState(),
  };
}

export {
  DAY_FLOW_STATES,
  getDayFlowState,
  startDay,
  advanceDayTime,
  endDay,
  openDaySummary,
  prepareNextDay,
};