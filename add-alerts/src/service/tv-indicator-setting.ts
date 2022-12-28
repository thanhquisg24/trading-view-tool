import { Browser, Page } from "puppeteer";
import {
  isEnvEnabled,
  logBaseDelay,
  styleOverride,
  waitForTimeout,
} from "./common-service";
import { get } from "lodash";
import {
  ICoinLong,
  IConfigCoinDetail,
  IConfigItemSelector,
  IStudyTemplate,
  LongStudyTemplate,
} from "./indicator-config";
import log, { logLogInfo } from "./log";
import {
  checkForInvalidSymbol,
  clickInputAndPutValue,
  configureInterval,
  fetchFirstXPath,
  isMatch,
  isXpathVisible,
  launchBrowser,
  login,
  minimizeFooterChartPanel,
  navigateToSymbol,
  takeScreenshot,
} from "./tv-page-actions";
import kleur from "kleur";
import { SelectionError, IndicatorError } from "../classes";

export const clickSubmitStudy = async (page) => {
  log.trace("clickSubmit()");
  const submitButton = await fetchFirstXPath(
    page,
    `//div[@data-name='indicator-properties-dialog']//button[@data-name='submit-button']`
  );
  submitButton.evaluate((b) => b.click());
};

export const openConfigStudyPanel = async (
  page,
  detailCoinItem: IConfigCoinDetail
) => {
  log.trace(
    `searching study for ${kleur.yellow(detailCoinItem.indicatorName)}`
  );
  const selectorIndicator =
    "//div[@data-name='legend-source-item']//div[@data-name='legend-settings-action']";

  await page.waitForXPath(selectorIndicator, { timeout: 8000 });
  const elements = await page.$x(selectorIndicator);

  if (elements.length == 0) {
    await takeScreenshot(page, "zero_indicators");
  }
  let found = false;
  let foundOptions = [];
  const conditionToMatch = detailCoinItem.indicatorName;
  for (const el of elements) {
    let optionText = await page.evaluate((element) => {
      const parent = element.closest("div[data-name='legend-source-item']");
      parent.classList.add("selected-G1_Pfvwd");
      const textElem = parent.querySelector(
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
      await waitForTimeout(0.5, "before click legend-settings-action");
      el.click();
      await waitForTimeout(0.5, "after click legend-settings-action");
      // return;
    }
  }
  if (!found) throw new SelectionError(conditionToMatch, foundOptions);
};

const getCoinDetailConfigValue = (
  coinItem: ICoinLong,
  coinTemplate: IStudyTemplate
): IConfigCoinDetail => {
  ///prepare data
  let dataValueDetail: { [x: string]: any } = {
    ...coinItem.strategyLong,
    ...coinItem.waveTrend,
    ...coinItem.rsiConfig,
    ...coinItem.MA,
  };
  ///fill checkbox value
  if (dataValueDetail.minMa100Percents > 0) {
    dataValueDetail = { ...dataValueDetail, useMa100Filter: true };
  }
  if (dataValueDetail.minMa50Percents > 0) {
    dataValueDetail = { ...dataValueDetail, useMa50Filter: true };
  }
  if (dataValueDetail.BolMinPercents > 0) {
    dataValueDetail = { ...dataValueDetail, useBolFilter: true };
  }
  if (dataValueDetail.rsiSMAignore > 0) {
    dataValueDetail = { ...dataValueDetail, useRSI_SMA_entry: true };
  }
  const detailCoinItem: IConfigCoinDetail = {
    indicatorName: coinTemplate.indicatorName,
    symbol: coinItem.symbol,
    timeFrame: coinItem.timeFrame,
    config: dataValueDetail,
  };
  return detailCoinItem;
};

export const fillSettingValueStudy = async (
  page,
  detailCoinItem: IConfigCoinDetail,
  coinTemplate: IStudyTemplate,
  listKeyTemplate: string[]
) => {
  log.trace("..make sure we're showing the indicator dialog");
  const isNotShowingAlertDialog = async () => {
    return !(await isXpathVisible(
      page,
      "//div[@data-name='indicator-properties-dialog']"
      // "//div[contains(@class, 'tv-alert-dialog')]"
    ));
  };
  if (await isNotShowingAlertDialog()) {
    log.warn("NOT showing indicator dialog?");
    log.error(" throwing error");
    throw new IndicatorError();
  }

  ///select all <input>
  log.trace(
    `searching dialog study for ${kleur.yellow(detailCoinItem.indicatorName)}`
  );
  const selectorAllInput =
    "//div[@data-name='indicator-properties-dialog']//input";

  await page.waitForXPath(selectorAllInput, { timeout: 8000 });
  const allInput = await page.$x(selectorAllInput);

  if (allInput.length == 0) {
    await takeScreenshot(page, "zero_indicators");
  } else {
    const dataValueDetail = detailCoinItem.config;
    for (let i = 0; i < listKeyTemplate.length; i++) {
      const k = listKeyTemplate[i];
      const infoInput: IConfigItemSelector = coinTemplate.configSelectors[k];
      let value = get(dataValueDetail, k);
      const indexOfinput = infoInput.index;
      if (infoInput.type === "checkbox") {
        value = value || false;
        const isChecked = await page.evaluate(
          (element) => element.checked,
          allInput[indexOfinput]
        );
        if (isChecked != value) {
          log.trace(`setting ${kleur.blue(k)} as checked | ${indexOfinput}`);
          allInput[indexOfinput].click();
          await waitForTimeout(0.3);
        }
      } else {
        if (value) {
          log.trace(
            `Typing value: ${kleur.blue(k)} = ${value} | ${indexOfinput}`
          );
          await clickInputAndPutValue(page, allInput[indexOfinput], value);
          await waitForTimeout(0.3);
        }
      }
    }
  }
};

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

export const configureStudyLongItem = async (
  page,
  coinItem: ICoinLong,
  coinTemplate: IStudyTemplate,
  listKeyTemplate: string[]
) => {
  try {
    const currentInterval = `${coinItem.timeFrame}`;
    await configureInterval(currentInterval.trim(), page);
    await waitForTimeout(3, "after changing the interval");
    await waitForTimeout(2, "let things settle from processing last alert");
    await navigateToSymbol(page, coinItem.symbol);
    await checkForInvalidSymbol(page, coinItem.symbol);
    await waitForTimeout(2, "after navigating to ticker");

    const detailCoinItem: IConfigCoinDetail = getCoinDetailConfigValue(
      coinItem,
      coinTemplate
    );
    //2 open config long study pannel
    await openConfigStudyPanel(page, detailCoinItem);

    //3 fill all setting and selector for each item
    await fillSettingValueStudy(
      page,
      detailCoinItem,
      coinTemplate,
      listKeyTemplate
    );
    //4 click btn ok to close panel
    await clickSubmitStudy(page);
  } catch (e) {
    console.error("configureStudyLongItem Fail!", e.message);
    throw e;
  }
};

export const configureStudyLongMain = async (coins: ICoinLong[]) => {
  try {
    const { browser, page } = await loginFlow();
    const coinExamples: ICoinLong[] = coins;
    const coinTemplate = LongStudyTemplate;
    const listKeyTemplate = Object.keys(LongStudyTemplate.configSelectors);
    //set config all coins
    for (let index = 0; index < coinExamples.length; index++) {
      const coinItem = coinExamples[index];
      await configureStudyLongItem(
        page,
        coinItem,
        coinTemplate,
        listKeyTemplate
      );
    }
  } catch (e) {
    console.error("configureStudyLongMain Fail!");
    throw e;
  }
};
