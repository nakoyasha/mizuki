import { Command, CommandV2 } from "../CommandInterface";
import { HSRChar } from "../Commands/Hoyoverse/HSRChar";
import { ban } from "../Commands/Moderation/ban";
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
import { RegexAdd } from "@commands/Regex/RegexAdd";
import { BotInfo } from "@commands/Discord/BotInfo";
import { RegexRemove } from "@commands/Regex/RegexRemove";
import { RegexList } from "@commands/Regex/RegexList";
import { SupportServer } from "@commands/Discord/SupportServer";
import { kick } from "@commands/Moderation/kick";
import { GetExperiment } from "@commands/Discord/GetExperiment";

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
  RegexAdd,
  BotInfo,
  RegexRemove,
  RegexList,
  SupportServer,
  ban,
  kick,
]