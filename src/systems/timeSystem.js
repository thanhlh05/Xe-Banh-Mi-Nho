import { gameState } from "../game/gameState.js";

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 22;

function ensureRuntimeTime() {
  if (!gameState.runtime) {
    gameState.runtime = {};
  }

  if (!gameState.runtime.time) {
    gameState.runtime.time = {
      hour: DAY_START_HOUR,
      minute: 0,
    };
  }
}

function getCurrentTime() {
  ensureRuntimeTime();

  return {
    hour: gameState.runtime.time.hour,
    minute: gameState.runtime.time.minute,
  };
}

function validateTime(hour, minute) {
  if (
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23
  ) {
    throw new Error(
      `timeSystem: hour phải là số nguyên từ 0 đến 23, nhận được "${hour}".`
    );
  }

  if (
    !Number.isInteger(minute) ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(
      `timeSystem: minute phải là số nguyên từ 0 đến 59, nhận được "${minute}".`
    );
  }
}

function setCurrentTime(hour, minute) {
  validateTime(hour, minute);

  ensureRuntimeTime();

  gameState.runtime.time.hour = hour;
  gameState.runtime.time.minute = minute;

  return getCurrentTime();
}

function advanceTime(minutes) {
  if (
    !Number.isInteger(minutes) ||
    minutes <= 0
  ) {
    throw new Error(
      `timeSystem: minutes phải là số nguyên dương, nhận được "${minutes}".`
    );
  }

  const currentTime = getCurrentTime();

  const currentTotalMinutes =
    currentTime.hour * 60 +
    currentTime.minute;

  const dayEndTotalMinutes =
    DAY_END_HOUR * 60;

  let newTotalMinutes =
    currentTotalMinutes + minutes;

  if (
    newTotalMinutes >
    dayEndTotalMinutes
  ) {
    newTotalMinutes =
      dayEndTotalMinutes;
  }

  const newHour =
    Math.floor(newTotalMinutes / 60);

  const newMinute =
    newTotalMinutes % 60;

  return setCurrentTime(
    newHour,
    newMinute
  );
}

function isDayEnded() {
  const currentTime =
    getCurrentTime();

  return (
    currentTime.hour * 60 +
      currentTime.minute >=
    DAY_END_HOUR * 60
  );
}

function resetDayTime() {
  return setCurrentTime(
    DAY_START_HOUR,
    0
  );
}

export {
  DAY_START_HOUR,
  DAY_END_HOUR,
  getCurrentTime,
  setCurrentTime,
  advanceTime,
  isDayEnded,
  resetDayTime,
};