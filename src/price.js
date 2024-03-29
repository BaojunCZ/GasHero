import { getAllFragmentPrices } from "./utils/fragment-utils.js";
import { getAllItemPrices } from "./utils/item-utils.js";

async function getAllPrices() {
  const fragmentPrices = await getAllFragmentPrices();
  const itemPrices = await getAllItemPrices();
  return {
    ...fragmentPrices,
    ...itemPrices,
  };
}

getAllPrices().then((prices) => {
  console.log(prices);
});
