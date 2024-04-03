import { getPriceFromMooar } from "./mooar.js";
import {
  getCommonBlueprintPrice,
  getUncommonBlueprintPrice,
} from "./fragment-utils.js";

const contractAddress = "0x00509e403CA5e24b91007472b79cA78E06c8268A";
const Dagger = "Dagger";
const Sword = "Sword";
const Axe = "Axe";
const Hammer = "Hammer";
const Bow = "Bow";
const Gun = "Gun";
const Staff = "Staff";
const Book = "Book";

const weaponList = [Dagger, Sword, Axe, Hammer, Bow, Gun, Staff, Book];

const Common = "Common";
const Uncommon = "Uncommon";
const Rare = "Rare";

export async function getAllWeaponPrices() {
  const allWeaponPrices = [];
  let totalCommon = 0;
  let totalUncommon = 0;
  for (const weapon of weaponList) {
    const weaponPrices = {};
    const commonPrice = await getPriceFromMooar(
      contractAddress,
      getTraitType(weapon, Common)
    );
    totalCommon += commonPrice;
    const uncommonPrice = await getPriceFromMooar(
      contractAddress,
      getTraitType(weapon, Uncommon)
    );
    totalUncommon += uncommonPrice;
    weaponPrices[getWeaponChinese(weapon, Common)] = commonPrice;
    weaponPrices[getWeaponChinese(weapon, Uncommon)] = uncommonPrice;
    allWeaponPrices.push(weaponPrices);
  }
  allWeaponPrices.push({
    "白 均价": parseInt((totalCommon / allWeaponPrices.length).toFixed(0)),
    "绿 均价": parseInt((totalUncommon / allWeaponPrices.length).toFixed(0)),
  });
  const commonBlueprintPrice = await getCommonBlueprintPrice();
  const uncommonBlueprintPrice = await getUncommonBlueprintPrice();
  allWeaponPrices.push({
    "白 碎片": commonBlueprintPrice,
    "绿 碎片": uncommonBlueprintPrice,
  });
  return allWeaponPrices;
}

function getTraitType(type, rarity) {
  return [
    { key: "State", value: ["Unlock"] },
    { key: "Type", value: [type] },
    { key: "Rarity", value: [rarity] },
  ];
}

function getWeaponChinese(type, rarity) {
  let str = "";
  if (rarity === Common) {
    str = "白 ";
  } else if (rarity === Uncommon) {
    str = "绿 ";
  } else if (rarity === Rare) {
    str = "蓝 ";
  }
  if (type === Dagger) {
    return str + "匕首";
  } else if (type === Sword) {
    return str + "长剑";
  } else if (type === Axe) {
    return str + "斧子";
  } else if (type === Hammer) {
    return str + "锤子";
  } else if (type === Bow) {
    return str + "弓箭";
  } else if (type === Gun) {
    return str + "枪支";
  } else if (type === Staff) {
    return str + "法杖";
  } else if (type === Book) {
    return str + "法书";
  } else {
    return "未知";
  }
}
