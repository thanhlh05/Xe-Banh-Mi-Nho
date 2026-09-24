import { gameState } from "../game/gameState.js";
import { UPGRADES } from "../data/upgrades.js";
import { spendMoney, getMoney } from "./moneySystem.js";

function getUpgradeLevel(upgradeId) {
  const upgrade = UPGRADES[upgradeId];

  if (!upgrade) {
    throw new Error(
      `upgradeSystem: upgradeId "${upgradeId}" không tồn tại.`
    );
  }

  return gameState.upgrades?.[upgradeId] || 0;
}

function getUpgradePrice(upgradeId) {
  const upgrade = UPGRADES[upgradeId];

  if (!upgrade) {
    throw new Error(
      `upgradeSystem: upgradeId "${upgradeId}" không tồn tại.`
    );
  }

  const currentLevel = getUpgradeLevel(upgradeId);

  if (currentLevel >= upgrade.maxLevel) {
    return null;
  }

  return upgrade.prices[currentLevel];
}

function canUpgrade(upgradeId) {
  const upgrade = UPGRADES[upgradeId];

  if (!upgrade) {
    throw new Error(
      `upgradeSystem: upgradeId "${upgradeId}" không tồn tại.`
    );
  }

  const currentLevel = getUpgradeLevel(upgradeId);

  if (currentLevel >= upgrade.maxLevel) {
    return false;
  }

  const price = getUpgradePrice(upgradeId);

  return getMoney() >= price;
}

function upgrade(upgradeId) {
  const upgradeData = UPGRADES[upgradeId];

  if (!upgradeData) {
    throw new Error(
      `upgradeSystem: upgradeId "${upgradeId}" không tồn tại.`
    );
  }

  const currentLevel = getUpgradeLevel(upgradeId);

  if (currentLevel >= upgradeData.maxLevel) {
    throw new Error(
      `upgradeSystem: "${upgradeId}" đã đạt cấp tối đa.`
    );
  }

  const price = getUpgradePrice(upgradeId);

  if (getMoney() < price) {
    throw new Error(
      `upgradeSystem: không đủ tiền để nâng cấp "${upgradeId}".`
    );
  }

  spendMoney(price);

  if (!gameState.upgrades) {
    gameState.upgrades = {};
  }

  gameState.upgrades[upgradeId] = currentLevel + 1;

  return {
    upgradeId,
    level: gameState.upgrades[upgradeId],
    price,
    remainingMoney: getMoney(),
  };
}

function getAllUpgrades() {
  return Object.values(UPGRADES).map((upgrade) => ({
    id: upgrade.id,
    name: upgrade.name,
    description: upgrade.description,
    maxLevel: upgrade.maxLevel,
    currentLevel: getUpgradeLevel(upgrade.id),
    nextPrice: getUpgradePrice(upgrade.id),
  }));
}

function resetUpgrades() {
  gameState.upgrades = {};
}

export {
  getUpgradeLevel,
  getUpgradePrice,
  canUpgrade,
  upgrade,
  getAllUpgrades,
  resetUpgrades,
};