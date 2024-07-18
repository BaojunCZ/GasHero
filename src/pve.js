import { getFragmentRewardPrices } from "./utils/fragment.js";
import { getItemRewardPrices } from "./utils/item.js";
import { consolePrices } from "./utils/price.js";

const selectedRound = ["2-3", "2-4", "2-5", "2-6", "3-1"];

async function getPve() {
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

  await consolePrices();

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
        min: price.min,
        withoutTax: (price.min * 0.94).toFixed(2),
        average: price.average,
      });
      result[key].sort((a, b) => b.min - a.min);
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

getPve();
