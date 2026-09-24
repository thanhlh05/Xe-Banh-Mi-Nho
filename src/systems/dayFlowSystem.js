// src/systems/dayFlowSystem.js
//
// File này điều phối vòng đời của một ngày trong game.
//
// Flow:
// PREPARATION → PLAYING → DAY_ENDED → SUMMARY
//
// File này KHÔNG xử lý UI, DOM hoặc LocalStorage.

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

const DAY_FLOW_STATES = {
  PREPARATION: "PREPARATION",
  PLAYING: "PLAYING",
  DAY_ENDED: "DAY_ENDED",
  SUMMARY: "SUMMARY",
};

let currentState = DAY_FLOW_STATES.PREPARATION;

// Trả về trạng thái hiện tại.
function getDayFlowState() {
  return currentState;
}

// Bắt đầu một ngày mới từ trạng thái Preparation.
function startDay() {
  if (currentState !== DAY_FLOW_STATES.PREPARATION) {
    throw new Error(
      `dayFlowSystem: không thể bắt đầu ngày mới khi trạng thái hiện tại là "${currentState}".`
    );
  }

  resetDayTime();
  startDayStatistics();

  currentState = DAY_FLOW_STATES.PLAYING;

  return {
    day: getCurrentDay(),
    time: getCurrentTime(),
    state: currentState,
  };
}

// Tăng thời gian trong ngày.
function advanceDayTime(minutes) {
  if (currentState !== DAY_FLOW_STATES.PLAYING) {
    throw new Error(
      `dayFlowSystem: không thể tăng thời gian khi trạng thái hiện tại là "${currentState}".`
    );
  }

  const newTime = advanceTime(minutes);

  if (isDayEnded()) {
    endDay();
  }

  return newTime;
}

// Kết thúc ngày hiện tại.
function endDay() {
  if (currentState !== DAY_FLOW_STATES.PLAYING) {
    throw new Error(
      `dayFlowSystem: không thể kết thúc ngày khi trạng thái hiện tại là "${currentState}".`
    );
  }

  discardFreshIngredients();

  currentState = DAY_FLOW_STATES.DAY_ENDED;

  return getDaySummary();
}

// Chuyển sang trạng thái Summary.
function openDaySummary() {
  if (currentState !== DAY_FLOW_STATES.DAY_ENDED) {
    throw new Error(
      `dayFlowSystem: không thể mở summary khi trạng thái hiện tại là "${currentState}".`
    );
  }

  currentState = DAY_FLOW_STATES.SUMMARY;

  return getDaySummary();
}

// Chuẩn bị cho ngày tiếp theo.
function prepareNextDay() {
  if (currentState !== DAY_FLOW_STATES.SUMMARY) {
    throw new Error(
      `dayFlowSystem: không thể chuẩn bị ngày tiếp theo khi trạng thái hiện tại là "${currentState}".`
    );
  }

  nextDay();

  resetDayTime();

  currentState = DAY_FLOW_STATES.PREPARATION;

  return {
    day: getCurrentDay(),
    time: getCurrentTime(),
    state: currentState,
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