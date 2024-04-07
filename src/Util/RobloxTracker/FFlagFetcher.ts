import { FFlag } from "./Types/FFlag";
import { FFlagType } from "./Types/FFlagType";
import { RobloxApplication } from "./Types/RobloxApplication";

export interface FFlagFetcher {
  getFFlag: (application: RobloxApplication, flag: FFlagType) => Promise<FFlag>,
  getFFlags: (application: RobloxApplication) => Promise<FFlag[]>
}