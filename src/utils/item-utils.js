import { getPriceFromMooar } from "./mooar.js";

const contractAddress = "0xF6011e7F61Cc9154839f0b10aF7372Cea8000F71";
const BaseConstructionVehicle = "Base Construction Vehicle";
const EvolutionCookie = "Evolution Cookie";
const HeroPotion = "Hero Potion";
const PowerCan = "Power Can";

export async function getAllItemPrices() {
  const evolutionCookiePrice = await getEvolutionCookiePrice();
  const heroPotionPrice = await getHeroPotionPrice();
  const power40CanPrice = await getPowerCan40Price();
  return {
    evolutionCookie: {
      package100: evolutionCookiePrice,
      single: evolutionCookiePrice / 100,
    },
    heroPotion: {
      package100: heroPotionPrice,
      single: heroPotionPrice / 100,
    },
    powerCan40: {
      package40: power40CanPrice,
      single: power40CanPrice / 40,
    },
  };
}

async function getBaseConstructionVehiclePrice() {
  return getPriceFromMooar(
    contractAddress,
    getTraitType(BaseConstructionVehicle)
  );
}

async function getEvolutionCookiePrice() {
  return getPriceFromMooar(contractAddress, getTraitType(EvolutionCookie, 100));
}

async function getHeroPotionPrice() {
  return getPriceFromMooar(contractAddress, getTraitType(HeroPotion, 100));
}

async function getPowerCan40Price() {
  return getPriceFromMooar(contractAddress, getTraitType(PowerCan, 40));
}

function getTraitType(type, count) {
  return [
    { key: "State", value: ["Unlock"] },
    { key: "Type", value: [type] },
    { key: "Count", value: [count.toString()] },
  ];
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
      [12, 15],
      [13, 16],
      [15, 18],
      [16, 19],
    ],
  ];
  return rewardList[difficulty][round];
}

async function getAllRewardPricesByType(type, count) {
  const singlePrice =
    (await getPriceFromMooar(contractAddress, getTraitType(type, count))) /
    count;
  const rewardPrices = {};
  for (let difficulty = 0; difficulty < 2; difficulty++) {
    for (let round = 0; round < 6; round++) {
      const [min, max] = getRewardCount(difficulty, round);
      rewardPrices[`${difficulty + 1}-${round + 1}`] = {
        min: (min * singlePrice).toFixed(2),
        average: (((min + max) / 2) * singlePrice).toFixed(2),
        max: (max * singlePrice).toFixed(2),
      };
    }
  }
  return rewardPrices;
}

export async function getAllRewardPrices() {
  const powerCanPrices = await getAllRewardPricesByType(PowerCan, 40);
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

// getAllRewardPrices(PowerCan, 40).then((prices) => {
//   console.log(prices);
// });
