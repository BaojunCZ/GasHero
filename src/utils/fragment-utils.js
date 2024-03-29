import { getPriceFromMooar } from "./mooar.js";

const contractAddress = "0xa284BB9b0cC45B9df9072589f508C48E0C5123d0";

const BlueprintFragment = "Blueprint Fragment";
const AncientFragment = "Ancient Fragment";

const Common = "Common";
const Uncommon = "Uncommon";

export async function getAllFragmentPrices() {
  const commonBlueprintPrice = await getCommonBlueprintPrice();
  const uncommonBlueprintPrice = await getUncommonBlueprintPrice();
  const commonAncientPrice = await getCommonAncientPrice();
  const uncommonAncientPrice = await getUncommonAncientPrice();
  return {
    commonBlueprint: {
      package100: commonBlueprintPrice,
      single: commonBlueprintPrice / 100,
    },
    uncommonBlueprint: {
      package100: uncommonBlueprintPrice,
      single: uncommonBlueprintPrice / 100,
    },
    commonAncient: {
      package100: commonAncientPrice,
      single: commonAncientPrice / 100,
    },
    uncommonAncient: {
      package: uncommonAncientPrice,
      single: uncommonAncientPrice / 100,
    },
  };
}

async function getCommonBlueprintPrice() {
  return getPriceFromMooar(
    contractAddress,
    getUncommonTraitType(BlueprintFragment)
  );
}

async function getUncommonBlueprintPrice() {
  return getPriceFromMooar(
    contractAddress,
    getUncommonTraitType(BlueprintFragment)
  );
}

async function getCommonAncientPrice() {
  return getPriceFromMooar(
    contractAddress,
    getCommonTraitType(AncientFragment)
  );
}

async function getUncommonAncientPrice() {
  return getPriceFromMooar(
    contractAddress,
    getUncommonTraitType(AncientFragment)
  );
}

function getCommonTraitType(type) {
  return getTraitType(type, Common);
}

function getUncommonTraitType(type) {
  return getTraitType(type, Uncommon);
}

function getTraitType(type, rarity) {
  return [
    { key: "State", value: ["Unlock"] },
    { key: "Type", value: [type] },
    { key: "Rarity", value: [rarity] },
  ];
}

function getBlueprintRewardCount(difficulty, round) {
  const rewards = [
    [
      [1, 2, 0, 0],
      [4, 5, 0, 0],
      [7, 8, 0, 0],
      [9, 12, 0, 0],
      [11, 14, 0, 0],
      [13, 16, 0, 0],
    ],
    [
      [12, 15, 0, 1],
      [11, 14, 1, 2],
      [10, 13, 3, 4],
      [8, 9, 4, 5],
      [5, 6, 5, 6],
      [0, 0, 8, 9],
    ],
  ];
  return rewards[difficulty][round];
}

function getAncientRewardCount(difficulty, round) {
  const rewards = [
    [
      [4, 5, 0, 0],
      [12, 15, 0, 0],
      [19, 24, 0, 0],
      [26, 31, 0, 0],
      [32, 39, 0, 0],
      [37, 46, 0, 0],
    ],
    [
      [34, 41, 1, 2],
      [32, 39, 2, 3],
      [28, 35, 4, 5],
      [25, 30, 5, 6],
      [18, 21, 7, 8],
      [9, 12, 9, 12],
    ],
  ];
  return rewards[difficulty][round];
}

async function getRewardPricesByType(type) {
  const singleCommonPrice =
    (await getPriceFromMooar(contractAddress, getTraitType(type, Common))) /
    100;
  const singleUncommonPrice =
    (await getPriceFromMooar(contractAddress, getTraitType(type, Uncommon))) /
    100;
  const rewardPrices = {};
  for (let difficulty = 0; difficulty < 2; difficulty++) {
    for (let round = 0; round < 6; round++) {
      const [commonMin, commonMax, uncommonMin, uncommonMax] =
        BlueprintFragment == type
          ? getBlueprintRewardCount(difficulty, round)
          : getAncientRewardCount(difficulty, round);
      console.log(commonMin, commonMax, uncommonMin, uncommonMax);
      rewardPrices[`${difficulty + 1}-${round + 1}`] = {
        min: (
          commonMin * singleCommonPrice +
          uncommonMin * singleUncommonPrice
        ).toFixed(2),
        average: (
          ((commonMin + commonMax) / 2) * singleCommonPrice +
          ((uncommonMin + uncommonMax) / 2) * singleUncommonPrice
        ).toFixed(2),
        max: (
          commonMax * singleCommonPrice +
          uncommonMax * singleUncommonPrice
        ).toFixed(2),
      };
    }
  }
  return rewardPrices;
}

export async function getAllRewardPrices() {
  const blueprintPrices = await getRewardPricesByType(BlueprintFragment);
  const ancientPrices = await getRewardPricesByType(AncientFragment);
  return {
    blueprint: blueprintPrices,
    ancient: ancientPrices,
  };
}

getAllRewardPrices().then((prices) => {
  console.log(prices);
});