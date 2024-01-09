import puppeteer from "puppeteer";
import { Experiment, Experiments } from ".";
import { ExperimentPuller } from "./ExperimentPuller";
import Logger from "@system/Logger";
import { Mizuki } from "@system/Mizuki";

const getExperimentsJS = `
  // webpack require..?
  let wpRequire;
  window.webpackChunkdiscord_app.push([[Math.random()], {}, (req) => { wpRequire = req; }]);

  // get experimentStore and get the registered experiments from LegacyExperimentStore
  Object.values(wpRequire.c).find(x => x?.exports?.default?.getRegisteredExperiments).exports.default.getRegisteredExperiments()
`


const logger = new Logger("PuppteerPull")

export class PuppeteerPull extends ExperimentPuller {
  async getClientExperiments(): Promise<Experiment[] | void | undefined> {
    let experiments;
    const browser = await puppeteer.launch({ headless: "new", args: ["--disable-gpu"] });
    const discord = await browser.pages().then(e => e[0]);
    const setTokenJS = `localStorage.setItem("token", ${Mizuki.secrets.EXP_TOKEN})`

    await discord.evaluateOnNewDocument(setTokenJS)
    await discord.goto('https://discord.com/app');
    await discord.setViewport({ width: 1, height: 1 });

    try {
      experiments = await discord.evaluate(getExperimentsJS) as Experiment[]
    } catch (err) {
      logger.error(`Error while pulling experiments: ${err}`)
      throw err;
    }

    await browser.close();
    return experiments
  }
}