import { getAllFragmentPrices } from "./fragment.js";
import { getAllItemPrices } from "./item.js";
import { getAllPetPrices } from "./pet.js";
import { getAllWeaponPrices } from "./weapon.js";

async function getAllPrices() {
  const fragmentPrices = await getAllFragmentPrices();
  const itemPrices = await getAllItemPrices();
  const petPrices = await getAllPetPrices();
  const weaponPrices = await getAllWeaponPrices();
  return {
    ...fragmentPrices,
    ...itemPrices,
    petPrices,
    weaponPrices,
  };
}

export async function consolePrices() {
  const prices = await getAllPrices();
  console.log(prices.petPrices);
  console.log(prices.weaponPrices);

  console.log("进化饼干", prices.evolutionCookie.single);
  console.log("英雄药水", prices.heroPotion.single);
  console.log("气罐    ", prices.powerCan40.single);
}
