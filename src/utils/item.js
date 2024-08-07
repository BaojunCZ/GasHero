import { getPriceFromMooar } from "./mooar.js";

const contractAddress = "0xF6011e7F61Cc9154839f0b10aF7372Cea8000F71";
const BaseConstructionVehicle = "Base Construction Vehicle";
const EvolutionCookie = "Evolution Cookie";
const HeroPotion = "Hero Potion";
const PowerCan = "Power Can";

export async function getAllItemPrices() {
  const evolutionCookiePrice = await getEvolutionCookiePrice();
  const heroPotionPrice = await getHeroPotionPrice();
  const powerCanPrice = await getPowerCanPrice();
  return {
    evolutionCookie: {
      package100: evolutionCookiePrice,
      single: evolutionCookiePrice / 100,
    },
    heroPotion: {
      package100: heroPotionPrice,
      single: heroPotionPrice / 100,
    },
    powerCan: {
      package100: powerCanPrice,
      single: powerCanPrice / 100,
    },
  };
}

export async function getEvolutionCookiePrice() {
  return getPriceFromMooar(contractAddress, getTraitType(EvolutionCookie, 100));
}

export async function getHeroPotionPrice() {
  return getPriceFromMooar(contractAddress, getTraitType(HeroPotion, 100));
}

export async function getPowerCanPrice() {
  return getPriceFromMooar(contractAddress, getTraitType(PowerCan, 100));
}

async function getBaseConstructionVehiclePrice() {
  return getPriceFromMooar(
    contractAddress,
    getTraitType(BaseConstructionVehicle)
  );
}

function getTraitType(type, count) {
  return [
    { key: "State", value: ["Unlock"] },
    { key: "Type", value: [type] },
    { key: "Count", value: [count.toString()] },
  ];
}

function getTypeChinese(type) {
  if (type === PowerCan) {
    return "气罐";
  } else if (type === HeroPotion) {
    return "药水";
  } else if (type === EvolutionCookie) {
    return "饼干";
  } else {
    return "未知";
  }
}

function getRewardCount(difficulty, round) {
  const rewardList = [
    [
      [1, 1],
      [3, 4],
      [5, 6],
      [6, 7],
      [8, 9],
      [9, 12],
    ],
    [
      [10, 13],
      [11, 14],
      [13, 16],
      [14, 17],
      [16, 19],
      [18, 21],
    ],
    [
      [18, 23],
      [20, 25],
      [22, 27],
      [25, 30],
      [29, 36],
      [34, 41],
    ],
  ];
  return rewardList[difficulty][round];
}

async function getAllRewardPricesByType(type, count) {
  const singlePrice =
    (await getPriceFromMooar(contractAddress, getTraitType(type, count))) /
    count;
  const rewardPrices = [];
  for (let difficulty = 0; difficulty < 3; difficulty++) {
    for (let round = 0; round < 6; round++) {
      const [min, max] = getRewardCount(difficulty, round);
      rewardPrices.push({
        type: getTypeChinese(type),
        round: `${difficulty + 1}-${round + 1}`,
        min: (min * singlePrice).toFixed(2),
        average: (((min + max) / 2) * singlePrice).toFixed(2),
        max: (max * singlePrice).toFixed(2),
      });
    }
  }
  return rewardPrices;
}

export async function getItemRewardPrices() {
  const powerCanPrices = await getAllRewardPricesByType(PowerCan, 100);
  const heroPotionPrices = await getAllRewardPricesByType(HeroPotion, 100);
  const evolutionCookiePrices = await getAllRewardPricesByType(
    EvolutionCookie,
    100
  );
  return {
    heroPotion: heroPotionPrices,
    powerCan: powerCanPrices,
    evolutionCookie: evolutionCookiePrices,
  };
}
