import { getPriceFromMooar } from "./mooar.js";

const contractAddress = "0xa284BB9b0cC45B9df9072589f508C48E0C5123d0";

const BlueprintFragment = "Blueprint Fragment";
const AncientFragment = "Ancient Fragment";

const Common = "Common";
const Uncommon = "Uncommon";
const Rare = "Rare";

export async function getAllFragmentPrices() {
  const commonBlueprintPrice = await getCommonBlueprintPrice();
  const uncommonBlueprintPrice = await getUncommonBlueprintPrice();
  const rareBlueprintPrice = await getRareBlueprintPrice();
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
    rareBlueprint: {
      package100: rareBlueprintPrice,
      single: rareBlueprintPrice / 100,
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

export async function getCommonBlueprintPrice() {
  return getPriceFromMooar(
    contractAddress,
    getCommonTraitType(BlueprintFragment)
  );
}

export async function getUncommonBlueprintPrice() {
  return getPriceFromMooar(
    contractAddress,
    getUncommonTraitType(BlueprintFragment)
  );
}

export async function getRareBlueprintPrice() {
  return getPriceFromMooar(
    contractAddress,
    getTraitType(BlueprintFragment, Rare)
  );
}

export async function getCommonAncientPrice() {
  return getPriceFromMooar(
    contractAddress,
    getCommonTraitType(AncientFragment)
  );
}

export async function getUncommonAncientPrice() {
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

function getRareTraitType(type) {
  return getTraitType(type, rarity);
}

function getTraitType(type, rarity) {
  return [
    { key: "State", value: ["Unlock"] },
    { key: "Type", value: [type] },
    { key: "Rarity", value: [rarity] },
  ];
}

function getTypeChinese(type) {
  if (type === BlueprintFragment) {
    return "武器";
  } else if (type === AncientFragment) {
    return "宠物";
  } else {
    return "未知";
  }
}

function getBlueprintRewardCount(difficulty, round) {
  const rewards = [
    [
      [1, 2],
      [4, 5],
      [7, 8],
      [9, 12],
      [12, 15],
      [14, 17],
    ],
    [
      [13, 16, 0, 1],
      [12, 15, 1, 2],
      [10, 13, 3, 4],
      [9, 10, 4, 5],
      [6, 7, 6, 7],
      [0, 0, 8, 9],
    ],
    [
      [0, 0, 9, 10],
      [0, 0, 8, 9, 0, 1],
      [0, 0, 5, 6, 1, 2],
      [0, 0, 4, 5, 2, 3],
      [0, 0, 4, 5, 3, 4],
      [0, 0, 0, 0, 5, 6],
    ],
  ];
  return rewards[difficulty][round];
}

function getAncientRewardCount(difficulty, round) {
  const rewards = [
    [
      [4, 5],
      [12, 15],
      [19, 24],
      [26, 31],
      [33, 40],
      [40, 49],
    ],
    [
      [36, 43, 1, 2],
      [34, 41, 2, 3],
      [30, 37, 4, 5],
      [26, 31, 5, 6],
      [19, 24, 8, 9],
      [11, 14, 10, 13],
    ],
    [
      [0, 0, 12, 15],
      [0, 0, 14, 17],
      [0, 0, 15, 18],
      [0, 0, 18, 21],
      [0, 0, 20, 25],
      [0, 0, 23, 28],
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
  const singleRarePrice =
    (await getPriceFromMooar(contractAddress, getTraitType(type, Rare))) / 100;
  const rewardPrices = [];
  for (let difficulty = 0; difficulty < 3; difficulty++) {
    for (let round = 0; round < 6; round++) {
      const [
        commonMin,
        commonMax,
        _uncommonMin,
        _uncommonMax,
        _rareMin,
        _rareMax,
      ] =
        BlueprintFragment == type
          ? getBlueprintRewardCount(difficulty, round)
          : getAncientRewardCount(difficulty, round);
      let uncommonMin = 0;
      if (_uncommonMin != undefined) {
        uncommonMin = _uncommonMin;
      }
      let uncommonMax = 0;
      if (_uncommonMax != undefined) {
        uncommonMax = _uncommonMax;
      }
      let rareMin = 0;
      if (_rareMin != undefined) {
        rareMin = _rareMin;
      }
      let rareMax = 0;
      if (_rareMax != undefined) {
        rareMax = _rareMax;
      }
      rewardPrices.push({
        type: getTypeChinese(type),
        round: `${difficulty + 1}-${round + 1}`,
        min: (
          commonMin * singleCommonPrice +
          uncommonMin * singleUncommonPrice +
          rareMin * singleRarePrice
        ).toFixed(2),
        average: (
          ((commonMin + commonMax) / 2) * singleCommonPrice +
          ((uncommonMin + uncommonMax) / 2) * singleUncommonPrice +
          ((rareMin + rareMax) / 2) * singleRarePrice
        ).toFixed(2),
        max: (
          commonMax * singleCommonPrice +
          uncommonMax * singleUncommonPrice +
          rareMax * singleRarePrice
        ).toFixed(2),
      });
    }
  }
  return rewardPrices;
}

export async function getFragmentRewardPrices() {
  const blueprintPrices = await getRewardPricesByType(BlueprintFragment);
  const ancientPrices = await getRewardPricesByType(AncientFragment);
  return {
    blueprint: blueprintPrices,
    ancient: ancientPrices,
  };
}

// getBlueprintAveragePrices().then((prices) => {
//   console.log(prices);
// });
