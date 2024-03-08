import { Command, CommandV2 } from "../CommandInterface";
import { HSRChar } from "../Commands/Hoyoverse/HSRChar";
import { Purge } from "../Commands/Moderation/Purge";
import { GetChannelInfo } from "../Commands/Roblox/GetChannelInfo";
import { GetRobloxAds } from "../Commands/Roblox/GetRobloxAds";
import { IsItFucked } from "../Commands/Util/IsItFucked";
import { ResolveAsset } from "../Commands/Util/ResolveAsset";
import { FlameText } from "../Commands/Fun/FlameText";
import { VideoToGif } from "../Commands/Fun/VideoToGif";
import { ListJobs } from "../Commands/Util/ListJobs";
import { Setup } from "../Commands/Server/config";
import { ThrowException } from "../Commands/Test/ThrowException";
import { BotInvite } from "@commands/Discord/BotInvite";
import { CreateGuildData } from "@commands/Test/CreateGuildData";
import { BotInfo } from "@commands/Discord/BotInfo";
import { SupportServer } from "@commands/Discord/SupportServer";
import { GetExperiment } from "@commands/Discord/GetExperiment";
import { GetClientExperiments } from "@commands/Test/GetClientExperiments";
import { moderate } from "@commands/Moderation/moderate"
import { Regex } from "@commands/Regex/regex";
import { ServerInfo } from "@commands/Discord/ServerInfo";
import { BuildDiff } from "@commands/Discord/BuildDiff";
import { BuildInfo } from "@commands/Discord/BuildInfo";
import { CanaryCompare } from "@commands/Discord/CanaryCompare";

// legacy commands that stink
export const Commands: Command[] = [

]


export const CommandsV2: CommandV2[] = [
  GetChannelInfo,
  GetRobloxAds,
  IsItFucked,
  ResolveAsset,
  HSRChar,
  Purge,
  FlameText,
  VideoToGif,
  ListJobs,
  ThrowException,
  BotInvite,
  CreateGuildData,
  BotInfo,
  SupportServer,
  GetExperiment,
  GetClientExperiments,
  moderate,
  Regex,
  ServerInfo,
  BuildDiff,
  BuildInfo,
  CanaryCompare,
]