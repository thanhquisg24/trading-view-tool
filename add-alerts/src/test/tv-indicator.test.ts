import { jest } from "@jest/globals";
import { addAlertsMain } from "../add-alerts";
import { coinlongtop } from "../service/indicator-config";
import { configureStudyLongMain } from "../service/tv-indicator-setting";

// describe("TV indicator Test Long", () => {
//   jest.setTimeout(120000);

//   it("TV indicator Test", async () => {
//     try {
//       const coins = coinlongtop;
//       await configureStudyLongMain(coins);
//     } catch (e) {
//       console.info("Test Catching Study");
//       throw e;
//     }
//   });
// });

describe("TV indicator Test Short", () => {
  jest.setTimeout(120000);

  it("TV indicator Test", async () => {
    try {
      const coins = coinlongtop;
      await configureStudyLongMain(coins);
    } catch (e) {
      console.info("Test Catching Study");
      throw e;
    }
  });
});
