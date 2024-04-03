import { getPriceFromMooar } from "./mooar.js";
import {
  getCommonAncientPrice,
  getUncommonAncientPrice,
} from "./fragment-utils.js";

const contractAddress = "0xA07Cd19aE5e1272B35846e5b91551548f2AeA9d1";
const Water = "Water";
const Plant = "Plant";
const Land = "Land";
const Flight = "Flight";

const petList = [Water, Plant, Land, Flight];

const Common = "Common";
const Uncommon = "Uncommon";
const Rare = "Rare";

export async function getAllPetPrices() {
  const allPetPrices = [];
  let totalCommon = 0;
  let totalUncommon = 0;
  for (const pet of petList) {
    const petPrices = {};
    const commonPrice = await getPriceFromMooar(
      contractAddress,
      getTraitType(pet, Common)
    );
    totalCommon += commonPrice;
    const uncommonPrice = await getPriceFromMooar(
      contractAddress,
      getTraitType(pet, Uncommon)
    );
    totalUncommon += uncommonPrice;
    petPrices[getPetChinese(pet, Common)] = commonPrice;
    petPrices[getPetChinese(pet, Uncommon)] = uncommonPrice;
    allPetPrices.push(petPrices);
  }
  allPetPrices.push({
    "白 均价": parseInt((totalCommon / allPetPrices.length).toFixed(0)),
    "绿 均价": parseInt((totalUncommon / allPetPrices.length).toFixed(0)),
  });
  const commonAncientPrice = await getCommonAncientPrice();
  const uncommonAncientPrice = await getUncommonAncientPrice();
  allPetPrices.push({
    "白 碎片": commonAncientPrice,
    "绿 碎片": uncommonAncientPrice,
  });
  return allPetPrices;
}

function getTraitType(type, rarity) {
  return [
    { key: "State", value: ["Unlock"] },
    { key: "Type", value: [type] },
    { key: "Rarity", value: [rarity] },
  ];
}

function getPetChinese(type, rarity) {
  let str = "";
  if (rarity === Common) {
    str = "白 ";
  } else if (rarity === Uncommon) {
    str = "绿 ";
  } else if (rarity === Rare) {
    str = "蓝 ";
  }
  if (type === Water) {
    str += "螃蟹";
  } else if (type === Plant) {
    str += "树精";
  } else if (type === Land) {
    str += "熊猫";
  } else if (type === Flight) {
    str += "飞龙";
  }
  return str;
}
