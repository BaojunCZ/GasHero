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

getAllPrices().then((prices) => {
  console.log("白武器", prices.commonBlueprint.single);
  console.log("绿武器", prices.uncommonBlueprint.single);
  console.log("白宠物", prices.commonAncient.single);
  console.log("绿宠物", prices.uncommonAncient.single);
  console.log("进化饼干", prices.evolutionCookie.single);
  console.log("英雄药水", prices.heroPotion.single);
  console.log("gas", prices.powerCan40.single);
});
