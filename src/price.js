import { getAllFragmentPrices } from "./utils/fragment-utils.js";
import { getAllItemPrices } from "./utils/item-utils.js";

export async function getAllPrices() {
  const fragmentPrices = await getAllFragmentPrices();
  const itemPrices = await getAllItemPrices();
  return {
    ...fragmentPrices,
    ...itemPrices,
  };
}

export async function consolePrices() {
  const prices = await getAllPrices();
  console.log("白武器  ", prices.commonBlueprint.single);
  console.log("绿武器  ", prices.uncommonBlueprint.single);
  console.log("白宠物  ", prices.commonAncient.single);
  console.log("绿宠物  ", prices.uncommonAncient.single);
  console.log("进化饼干", prices.evolutionCookie.single);
  console.log("英雄药水", prices.heroPotion.single);
  console.log("气罐    ", prices.powerCan40.single);
}

consolePrices().then();
