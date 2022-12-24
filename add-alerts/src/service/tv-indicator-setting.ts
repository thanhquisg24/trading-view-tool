import { Browser, Page } from "puppeteer";
import {
  isEnvEnabled,
  logBaseDelay,
  styleOverride,
  waitForTimeout,
} from "./common-service";
import {
  ICoinLong,
  IConfigCoinDetail,
  LongStudyTemplate,
} from "./indicator-config";
import log, { logLogInfo } from "./log";
import {
  checkForInvalidSymbol,
  configureInterval,
  isMatch,
  launchBrowser,
  login,
  minimizeFooterChartPanel,
  navigateToSymbol,
  takeScreenshot,
} from "./tv-page-actions";
import kleur from "kleur";
import { SelectionError } from "../classes";

export const loginFlow = async (): Promise<{
  browser: Browser;
  page: Page;
}> => {
  try {
    const headless = isEnvEnabled(process.env.HEADLESS);
    const tradingview = {
      chartUrl: process.env.TEST_TRADINGVIEW_CHART,
      username: process.env.TEST_TRADINGVIEW_USERNAME,
      password: process.env.TEST_TRADINGVIEW_PASSWORD,
    };
    logLogInfo();
    logBaseDelay();
    const browser: Browser = await launchBrowser(
      headless,
      `${tradingview.chartUrl}#signin`
    );

    let page: Page;
    let accessDenied;

    if (headless) {
      page = await browser.newPage();
      log.trace(`Go to ${tradingview.chartUrl} and wait until domloaded`);
      const pageResponse = await page.goto(tradingview.chartUrl + "#signin", {
        waitUntil: "domcontentloaded",
      });
      await waitForTimeout(8, "let page load and see if access is denied");
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

    if (accessDenied) {
      if (tradingview.username && tradingview.password) {
        await login(page, tradingview.username, tradingview.password);
      } else {
        log.warn(
          "You'll need to sign into TradingView in this browser (one time only)\n...after signing in, press ctrl-c to kill this script, then run it again"
        );
        await waitForTimeout(1000000);
        await browser.close();
        process.exit(1);
      }
    }

    await waitForTimeout(3, "wait a little longer for page to load");
    await minimizeFooterChartPanel(page); // otherwise pine script editor might capture focus
    return { browser, page };
  } catch (e) {
    console.error("Login Fail!");
    throw e;
  }
};

export const configureStudyLongItem = async (page, coinItem: ICoinLong) => {
  try {
    const currentInterval = `${coinItem.timeFrame}`;
    // await configureInterval(currentInterval.trim(), page);
    // await waitForTimeout(3, "after changing the interval");
    // await waitForTimeout(2, "let things settle from processing last alert");
    // await navigateToSymbol(page, coinItem.symbol);
    // await checkForInvalidSymbol(page, coinItem.symbol);
    await waitForTimeout(2, "after navigating to ticker");

    const templatePanel = LongStudyTemplate;
    const detailCoinItem: IConfigCoinDetail = {
      indicatorName: LongStudyTemplate.indicatorName,
      symbol: coinItem.symbol,
      timeFrame: coinItem.timeFrame,
      config: {},
    };
    //2 open config long study pannel
    log.trace(
      `searching menu for ${kleur.yellow(detailCoinItem.indicatorName)}`
    );
    const selectorIndicator = "//div[@data-name='legend-source-item']";

    await page.waitForXPath(selectorIndicator, { timeout: 8000 });
    const elements = await page.$x(selectorIndicator);

    if (elements.length == 0) {
      await takeScreenshot(page, "zero_indicators");
    }
    let found = false;
    let foundOptions = [];
    const conditionToMatch = detailCoinItem.indicatorName;
    for (const el of elements) {
      /* istanbul ignore next */
      let optionText = await page.evaluate((element) => {
        const textElem = element.querySelector(
          `div[data-name="legend-source-title"]`
        );
        if (textElem) {
          return textElem.innerText;
        }
        return "";
      }, el);
      optionText = optionText.replace(/[\u200B]/g, "");
      foundOptions.push(optionText);
      if (isMatch(conditionToMatch, optionText)) {
        log.trace(`Found! Clicking ${kleur.yellow(optionText)}`);
        found = true;
        // el.click();
        await page.evaluate((element) => {
          element.classList.add("selected-G1_Pfvwd");
          return "";
        }, el);
        await waitForTimeout(0.5, "after click  legend-source-item");

        await page.evaluateHandle(
          (element) =>
            element
              .querySelector('div[data-name="legend-settings-action"]')
              .click(),
          el
        );

        return;
      }
    }
    if (!found) throw new SelectionError(conditionToMatch, foundOptions);
    //3 fill all setting and selector for each item

    //4 click btn ok to close panel
  } catch (e) {
    console.error("configureStudyLongItem Fail!", e.message);
    throw e;
  }
};

export const configureStudyLongMain = async (coins: ICoinLong[]) => {
  try {
    const { browser, page } = await loginFlow();
    const coinExamples: ICoinLong[] = coins;
    //set config all coins
    for (let index = 0; index < coinExamples.length; index++) {
      const coinItem = coinExamples[index];
      await configureStudyLongItem(page, coinItem);
    }
  } catch (e) {
    console.error("configureStudyLongMain Fail!");
    throw e;
  }
};
