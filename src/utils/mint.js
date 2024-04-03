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
    白1绿1: await getMintStaff(
      "Common",
      1,
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
  } = getMintStaffSingle(typeA, mintCountA);
  const {
    heroPotion: heroPotionB,
    powerCan: powerCanB,
    gmt: gmtB,
  } = getMintStaffSingle(typeB, mintCountB);
  const heroPotion = heroPotionA + heroPotionB;
  const powerCan = powerCanA + powerCanB;
  const gmt = gmtA + gmtB;
  const total = parseInt(
    (heroPotion * heroPotionPrice + powerCan * powerCanPrice + gmt).toFixed(2)
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
  let heroPotion = 0;
  let gmt = 0;
  if (type === Common) {
    if (mintCount <= 2) {
      heroPotion = 30;
      gmt = 2;
    } else if (mintCount == 3) {
      heroPotion = 45;
      gmt = 3;
    }
  } else if (type === Uncommon) {
    if (mintCount <= 2) {
      heroPotion = 100;
      gmt = 3;
    } else if (mintCount == 3) {
      heroPotion = 125;
      gmt = 4;
    }
  }
  const powerCan = Math.ceil(heroPotion / 2);
  return { heroPotion, powerCan, gmt };
}

getAllMintStaff().then((result) => {
  console.log(result);
});
