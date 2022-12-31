import { Browser, Page } from "puppeteer";
import {
  isEnvEnabled,
  logBaseDelay,
  styleOverride,
  waitForTimeout,
} from "./common-service";
import { get } from "lodash";
import {
  IBaseCoin,
  IBaseConfigYML,
  ICoinAlertInfo,
  ICoinLong,
  ICoinShort,
  IConfigCoinDetail,
  IConfigLongItemSelector,
  ILongStudyTemplate,
  IShortStudyTemplate,
  LongStudyTemplate,
  ShortStudyTemplate,
} from "./indicator-config";
import log, { logLogInfo } from "./log";
import {
  addAlert,
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
import { ISingleAlertSettings } from "../interfaces";

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

const getLongCoinDetailConfigValue = (
  coinItem: ICoinLong,
  coinTemplate: ILongStudyTemplate
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
    shortSymbol: coinItem.shortSymbol,
    timeFrame: coinItem.timeFrame,
    config: dataValueDetail,
  };
  return detailCoinItem;
};
const getShortCoinDetailConfigValue = (
  coinItem: ICoinShort,
  coinTemplate: IShortStudyTemplate
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
  if (dataValueDetail.rsiOverBuy_1 > 0) {
    dataValueDetail = { ...dataValueDetail, useRsiOverBuy_1: true };
  }
  if (dataValueDetail.rsiOverBuy_2 > 0) {
    dataValueDetail = { ...dataValueDetail, useRsiOverBuy_2: true };
  }
  if (dataValueDetail.rsiOverBuy_3 > 0) {
    dataValueDetail = { ...dataValueDetail, useRsiOverBuy_3: true };
  }
  if (dataValueDetail.rsiOverBuy_4 > 0) {
    dataValueDetail = { ...dataValueDetail, useRsiOverBuy_4: true };
  }
  const detailCoinItem: IConfigCoinDetail = {
    indicatorName: coinTemplate.indicatorName,
    symbol: coinItem.symbol,
    shortSymbol: coinItem.shortSymbol,
    timeFrame: coinItem.timeFrame,
    config: dataValueDetail,
  };
  return detailCoinItem;
};

export const fillSettingValueStudy = async (
  page,
  detailCoinItem: IConfigCoinDetail,
  coinTemplate: ILongStudyTemplate | IShortStudyTemplate,
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
      const infoInput: IConfigLongItemSelector =
        coinTemplate.configSelectors[k];
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

export const switchCoinAndTimeFrame = async (
  page,
  timeFrame: number,
  symbol: string
) => {
  try {
    const currentInterval = `${timeFrame}`;
    await configureInterval(currentInterval.trim(), page);
    await waitForTimeout(2, "after changing the interval");
    await waitForTimeout(2, "let things settle from processing last alert");
    await navigateToSymbol(page, symbol);
    await checkForInvalidSymbol(page, symbol);
    await waitForTimeout(2, "after navigating to ticker");
  } catch (e) {
    console.error("switchCoinAndTimeFrame Fail!", e.message);
    throw e;
  }
};

export const configureStudyLongItem = async (
  page,
  coinItem: ICoinLong,
  coinTemplate: ILongStudyTemplate,
  listKeyTemplate: string[]
) => {
  try {
    const detailCoinItem: IConfigCoinDetail = getLongCoinDetailConfigValue(
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
export const configureStudyShortItem = async (
  page,
  coinItem: ICoinShort,
  coinTemplate: IShortStudyTemplate,
  listKeyTemplate: string[]
) => {
  try {
    const detailCoinItem: IConfigCoinDetail = getShortCoinDetailConfigValue(
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

export const addAlertForStudy = async (page, alertInfo: ICoinAlertInfo) => {
  try {
    const singleAlertSettings: ISingleAlertSettings = {
      name: `${alertInfo.shortSymbol} ${alertInfo.timeFrame}m ${alertInfo.indicatorName} ${alertInfo.direction} *`,
      condition: alertInfo.condition,
      actions: alertInfo.actions,
    };
    await page.addStyleTag({ content: styleOverride });
    await addAlert(page, singleAlertSettings);
    log.info(`add ${kleur.green(singleAlertSettings.name)} success!`);
  } catch (error) {
    console.error("addAlertForStudy Fail!");
    throw error;
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
      await switchCoinAndTimeFrame(page, coinItem.timeFrame, coinItem.symbol);
      await configureStudyLongItem(
        page,
        coinItem,
        coinTemplate,
        listKeyTemplate
      );
      await waitForTimeout(0.1, "after config study completed");
      const alertInfo: ICoinAlertInfo = {
        indicatorName: coinTemplate.indicatorName,
        symbol: coinItem.symbol,
        shortSymbol: coinItem.shortSymbol,
        timeFrame: coinItem.timeFrame,
        direction: "LONG",
        condition: {
          primaryLeft: coinTemplate.indicatorName,
          secondary: "Any alert() function call",
        },
        actions: {
          webhook: {
            enabled: true,
            url: "https://3commas.io/trade_signal/trading_view",
          },
        },
      };
      await addAlertForStudy(page, alertInfo);
    }
  } catch (e) {
    console.error("configureStudyLongMain Fail!");
    throw e;
  }
};

export const configureStudyShortMain = async (coins: ICoinShort[]) => {
  try {
    const { browser, page } = await loginFlow();
    const coinExamples: ICoinShort[] = coins;
    const coinTemplate = ShortStudyTemplate;
    const listKeyTemplate = Object.keys(ShortStudyTemplate.configSelectors);
    //set config all coins
    for (let index = 0; index < coinExamples.length; index++) {
      const coinItem = coinExamples[index];
      await switchCoinAndTimeFrame(page, coinItem.timeFrame, coinItem.symbol);
      await configureStudyShortItem(
        page,
        coinItem,
        coinTemplate,
        listKeyTemplate
      );
      await waitForTimeout(0.1, "after config study completed");
      const alertInfo: ICoinAlertInfo = {
        indicatorName: coinTemplate.indicatorName,
        symbol: coinItem.symbol,
        shortSymbol: coinItem.shortSymbol,
        timeFrame: coinItem.timeFrame,
        direction: "SHORT",
        condition: {
          primaryLeft: coinTemplate.indicatorName,
          secondary: "Any alert() function call",
        },
        actions: {
          webhook: {
            enabled: true,
            url: "https://3commas.io/trade_signal/trading_view",
          },
        },
      };
      await addAlertForStudy(page, alertInfo);
    }
  } catch (e) {
    console.error("configureStudyLongMain Fail!");
    throw e;
  }
};

export const addAlertWithoutConfigStudy = async (
  coins: IBaseCoin[],
  baseConfigYML: IBaseConfigYML
) => {
  try {
    const { page } = await loginFlow();
    //set config all coins
    for (let index = 0; index < coins.length; index++) {
      const coinItem = coins[index];
      await switchCoinAndTimeFrame(
        page,
        baseConfigYML.tradingview.interval,
        coinItem.symbol
      );
      await waitForTimeout(0.1, "after switch coin completed");
      const alertInfo: ICoinAlertInfo = {
        indicatorName: baseConfigYML.alert.condition.primaryLeft,
        symbol: coinItem.symbol,
        shortSymbol: coinItem.shortSymbol,
        timeFrame: baseConfigYML.tradingview.interval,
        direction: "",
        condition: {
          primaryLeft: baseConfigYML.alert.condition.primaryLeft,
          secondary: baseConfigYML.alert.condition.secondary,
        },
        actions: {
          webhook: {
            enabled: baseConfigYML.alert.actions.webhook.enabled,
            url: baseConfigYML.alert.actions.webhook.url,
          },
        },
      };
      await addAlertForStudy(page, alertInfo);
    }
    log.info(`add all Alerts success!`);
  } catch (e) {
    console.error("addAlertWithoutConfigStudy Fail!");
    throw e;
  }
};
