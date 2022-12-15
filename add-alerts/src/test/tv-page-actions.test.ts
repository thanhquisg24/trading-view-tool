import { expect, jest, test } from "@jest/globals";
import {
  isEnvEnabled,
  styleOverride,
  waitForTimeout,
} from "../service/common-service";
import { launchBrowser, login } from "../service/tv-page-actions";
import log from "../service/log";

describe("tv-page-actions tests", () => {
  jest.setTimeout(120000);
  let browser;

  let page;

  it("tv-page-actions()", async () => {
    console.log("current working directory: " + process.cwd());
    const headless = isEnvEnabled(process.env.HEADLESS);

    const chartUrl = process.env.TEST_TRADINGVIEW_CHART;
    const username = process.env.TEST_TRADINGVIEW_USERNAME;
    const password = process.env.TEST_TRADINGVIEW_PASSWORD;

    browser = await launchBrowser(false, `${chartUrl}#signin`);

    console.log(
      "🚀 ~ file: tv-page-actions.test.ts:26 ~ it ~ browser",
      browser
    );
    let accessDenied;
    console.log("🚀 ~ file:11111111111111111111");
    if (headless) {
      page = await browser.newPage();

      log.trace(`Go to ${chartUrl} and wait until domcontentloaded`);
      const pageResponse = await page.goto(chartUrl + "#signin", {
        waitUntil: "domcontentloaded",
      });
      await waitForTimeout(5, "let page load and see if access is denied");
      /* istanbul ignore next */
      await page.addStyleTag({ content: styleOverride });

      accessDenied = pageResponse.status() === 403;
    } else {
      page = (await browser.pages())[0];
      await waitForTimeout(5, "let page load and see if access is denied");
      await page.addStyleTag({ content: styleOverride });
      /* istanbul ignore next */
      accessDenied = await page.evaluate(() => {
        return document.title.includes("Denied");
      });
    }
    console.log("🚀 ~ file:2222222222222222222");
    if (accessDenied) {
      log.info("Access denied, logging in...");
      if (username && password) {
        await login(page, username, password);
      }
    }
    console.log(
      "🚀 ~ file: tv-page-actions.test.ts:63ssssssss ~ afterAll ~ browser",
      browser
    );
    await waitForTimeout(3, "wait a little longer for page to load");
  });

  afterAll(async () => {
    console.log("shutting down");
    console.log(
      "🚀 ~ file: tv-page-actions.test.ts:63 ~ afterAll ~ browser",
      browser
    );
    await browser.close();
  });

  // test.skip("dummy tv-page-actions test", async () => {
  //   expect("blah").toBeDefined();
  //   await waitForTimeout(3, "just waiting");
  // });
});
