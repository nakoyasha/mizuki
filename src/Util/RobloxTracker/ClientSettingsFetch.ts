import { FFlagFetcher } from "./FFlagFetcher";
import { FFlag } from "./Types/FFlag";
import { FFlagType } from "./Types/FFlagType";
import { RobloxApplication } from "./Types/RobloxApplication";

export type ClientSettings = {
  // the returned json is:
  // {"applicationSettings": "fflag1": "value"}
  applicationSettings: Object
}

export class ClientSettingsFetcher implements FFlagFetcher {
  private readonly BASE_URL = "https://clientsettings.roblox.com/v2/settings/application/";
  constructor() { };

  async getFFlags(application: RobloxApplication): Promise<FFlag[]> {
    const url = new URL(application, this.BASE_URL)
    const response = await fetch(url);

    const data: ClientSettings = await response.json();
    const entries = Object.entries(data.applicationSettings);

    const fflags: FFlag[] = []

    for (const [fflagName, fflagValue] of entries) {
      const isFlag = fflagName.startsWith(FFlagType.Flag)
      const isDynamicFlag = fflagName.startsWith(FFlagType.DynamicFlag)
      const isSynchronizedFastFlag = fflagName.startsWith(FFlagType.SynchronizedFast)

      let flagType;

      if (isFlag == true) {
        flagType = FFlagType.Flag
      } else if (isDynamicFlag == true) {
        flagType = FFlagType.DynamicFlag
      } else if (isSynchronizedFastFlag == true) {
        flagType = FFlagType.SynchronizedFast
      }

      let value = fflagValue
      const isValueString = typeof (value) === "string"

      if (isValueString === true) {
        // TODO: this might not be a good way to check if its an array !!
        const isArray = value.includes(";")

        if (isArray === true) {
          const array = value.split(";")
          value = array;
        }
      }

      const flag: FFlag = {
        name: fflagName,
        type: flagType,
        value: value
      }

      fflags.push(flag)
    }

    return fflags;
  }

  async getFFlag(application: RobloxApplication, fflagName: string): Promise<FFlag> {
    const fflags = await this.getFFlags(application)
    const flag = fflags.find(fflag => fflag.name == fflagName)

    if (flag === undefined) {
      throw new Error(`FFlag ${fflagName} does not exist`)
    } else {
      return flag;
    }
  }
}