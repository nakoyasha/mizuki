import { ClientSettingsFetcher } from "@util/RobloxTracker/ClientSettingsFetch";
import { RobloxApplication } from "@util/RobloxTracker/Types/RobloxApplication";

(async () => {
  const clientSettingsFetcher = new ClientSettingsFetcher();
  const data = await clientSettingsFetcher.getFFlags(RobloxApplication.PCDesktopClient);

  console.log(data)
})()