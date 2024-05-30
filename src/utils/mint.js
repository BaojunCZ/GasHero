import { getHeroPotionPrice, getPowerCan40Price } from "./item.js";

const Common = "Common";
const Uncommon = "Uncommon";

export async function getAllMintStaff() {
  const heroPotionPrice = (await getHeroPotionPrice()) / 100;
  const powerCanPrice = (await getPowerCan40Price()) / 40;
  return {
    白1白1: await getMintStaff(
      "Common",
      1,
      "Common",
      1,
      heroPotionPrice,
      powerCanPrice
    ),
    白1白3: await getMintStaff(
      "Common",
      1,
      "Common",
      3,
      heroPotionPrice,
      powerCanPrice
    ),
    绿1绿1: await getMintStaff(
      "Uncommon",
      1,
      "Uncommon",
      1,
      heroPotionPrice,
      powerCanPrice
    ),
    绿1绿3: await getMintStaff(
      "Uncommon",
      1,
      "Uncommon",
      3,
      heroPotionPrice,
      powerCanPrice
    ),
    绿3绿3: await getMintStaff(
      "Uncommon",
      3,
      "Uncommon",
      3,
      heroPotionPrice,
      powerCanPrice
    ),
    白1绿1: await getMintStaff(
      "Common",
      1,
      "Uncommon",
      1,
      heroPotionPrice,
      powerCanPrice
    ),
    白1绿3: await getMintStaff(
      "Common",
      1,
      "Uncommon",
      3,
      heroPotionPrice,
      powerCanPrice
    ),
    白3绿1: await getMintStaff(
      "Common",
      3,
      "Uncommon",
      1,
      heroPotionPrice,
      powerCanPrice
    ),
  };
}

async function getMintStaff(
  typeA,
  mintCountA,
  typeB,
  mintCountB,
  heroPotionPrice,
  powerCanPrice
) {
  const {
    heroPotion: heroPotionA,
    powerCan: powerCanA,
    gmt: gmtA,
    updateHeroPotion: updateHeroPotionA,
  } = getMintStaffSingle(typeA, mintCountA);
  const {
    heroPotion: heroPotionB,
    powerCan: powerCanB,
    gmt: gmtB,
    updateHeroPotion: updateHeroPotionB,
  } = getMintStaffSingle(typeB, mintCountB);
  const heroPotion = heroPotionA + heroPotionB;
  const powerCan = powerCanA + powerCanB;
  const gmt = gmtA + gmtB;
  const updateHeroPotion = updateHeroPotionA + updateHeroPotionB;
  const total = parseInt(
    (
      heroPotion * heroPotionPrice +
      powerCan * powerCanPrice +
      gmt +
      updateHeroPotion * heroPotionPrice
    ).toFixed(2)
  );
  return {
    heroPotion,
    powerCan,
    gmt,
    total,
    最低价: parseInt((total / 0.94).toFixed(2)),
  };
}

function getMintStaffSingle(type, mintCount) {
  const commonBaseHeroPotion = 30;
  const uncommonBaseHeroPotion = 100;
  const commonBaseGMT = 2;
  const uncommonBaseGMT = 3;
  let heroPotion = 0;
  let gmt = 0;
  let baseHeroPositon = 0;
  let updateHeroPotion = 0;
  if (type === Common) {
    gmt = commonBaseGMT;
    baseHeroPositon = commonBaseHeroPotion;
  } else if (type === Uncommon) {
    gmt = uncommonBaseGMT;
    baseHeroPositon = uncommonBaseHeroPotion;
  }

  if (mintCount <= 2) {
    heroPotion = baseHeroPositon;
    updateHeroPotion = 9 / 2;
  } else {
    gmt += mintCount - 2;
    heroPotion = baseHeroPositon * mintCount * 0.5;
    updateHeroPotion = 18 / mintCount / 2;
  }

  const powerCan = Math.ceil(heroPotion / 2);
  return { heroPotion, powerCan, gmt, updateHeroPotion };
}

getAllMintStaff().then((result) => {
  console.log(result);
});
