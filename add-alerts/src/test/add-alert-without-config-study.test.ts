import { jest } from "@jest/globals";
import YAML from "yaml";
import path from "path";
import { addAlertsMain, readFilePromise } from "../add-alerts";
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { InvalidSymbolError } from "../classes";
import { IBaseCoin, IBaseConfigYML } from "./../service/indicator-config";
import log from "../service/log";
import kleur from "kleur";
import { addAlertWithoutConfigStudy } from "../service/tv-indicator-setting";

describe("add-alert-without-config-study.test", () => {
  jest.setTimeout(120000);
  it("run add-alert-without-config-study.test()", async () => {
    // read template config file
    const templateConfigPath = path.join(process.cwd(), "config.ci.yml");
    const configString = readFileSync(templateConfigPath, {
      encoding: "utf-8",
    });
    const config: IBaseConfigYML = YAML.parse(configString);

    const symbolPath = path.join(process.cwd(), "base_symbol_example.csv");
    let symbolRows: IBaseCoin[] = [];

    try {
      log.trace(
        `${kleur.gray("Reading input file: ")}${kleur.cyan(symbolPath)}`
      );
      symbolRows = await readFilePromise(symbolPath);
    } catch (e) {
      log.fatal(`Unable to open file specified in config: ${symbolPath}`);
      process.exit(1);
    }

    try {
      await addAlertWithoutConfigStudy(symbolRows, config);
    } catch (e) {
      console.info("run add-alert-without-config-study.test fail");
    }
  });
});
