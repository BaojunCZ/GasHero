import { getFragmentRewardPrices } from "./utils/fragment-utils.js";
import { getItemRewardPrices } from "./utils/item-utils.js";
import { consolePrices } from "./price.js";

const selectedRound = ["1-6", "2-4"];

async function getAllPrices() {
  const fragmentPrices = await getFragmentRewardPrices();
  const itemPrices = await getItemRewardPrices();
  // console.log("武器");
  // fragmentPrices.blueprint.forEach((price) => {
  //   console.log(price.round, price.average);
  // });
  // console.log("宠物");
  // fragmentPrices.ancient.forEach((price) => {
  //   console.log(price.round, price.average);
  // });
  // console.log("进化饼干");
  // itemPrices.evolutionCookie.forEach((price) => {
  //   console.log(price.round, price.average);
  // });
  // console.log("英雄药水");
  // itemPrices.heroPotion.forEach((price) => {
  //   console.log(price.round, price.average);
  // });
  // console.log("gas");
  // itemPrices.powerCan.forEach((price) => {
  //   console.log(price.round, price.average);
  // });

  // Combine and group the prices
  const combinedPrices = fragmentPrices.blueprint.concat(
    fragmentPrices.ancient,
    itemPrices.evolutionCookie,
    itemPrices.heroPotion,
    itemPrices.powerCan
  );
  const groupedPrices = combinedPrices.reduce((result, price) => {
    const key = `${price.round}`;
    if (!result[key]) {
      result[key] = [];
    }
    if (selectedRound.includes(key)) {
      result[key].push({
        type: price.type,
        average: price.average,
        withoutTax: (price.average * 0.94).toFixed(2),
        min: price.min,
      });
      result[key].sort((a, b) => b.average - a.average); // Sort by average in descending order
    }
    return result;
  }, {});
  Object.keys(groupedPrices).forEach((key) => {
    if (groupedPrices[key].length === 0) {
      delete groupedPrices[key];
    }
  });
  console.log(groupedPrices);
}

getAllPrices();
