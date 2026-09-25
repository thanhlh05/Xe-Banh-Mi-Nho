import { saveGame } from "./saveSystem.js";

let autoSaveEnabled = true;

function setAutoSaveEnabled(enabled) {
  if (typeof enabled !== "boolean") {
    throw new Error(
      "autoSaveSystem: enabled phải là boolean."
    );
  }

  autoSaveEnabled = enabled;
}

function isAutoSaveEnabled() {
  return autoSaveEnabled;
}

function autoSave() {
  if (!autoSaveEnabled) {
    return false;
  }

  saveGame();

  return true;
}

export {
  autoSave,
  setAutoSaveEnabled,
  isAutoSaveEnabled,
};