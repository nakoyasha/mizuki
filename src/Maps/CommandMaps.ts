import { Command, CommandV2 } from "../CommandInterface";
import { HSRChar } from "../Commands/Hoyoverse/HSRChar";
import { Purge } from "../Commands/Moderation/Purge";
import { GetChannelInfo } from "../Commands/Roblox/Channels/GetChannelInfo";
import { GetRobloxAds } from "../Commands/Roblox/GetRobloxAds";
import { IsItFucked } from "../Commands/Util/IsItFucked";
import { ResolveAsset } from "../Commands/Util/ResolveAsset";
import { FlameText } from "../Commands/Fun/FlameText";
import { VideoToGif } from "../Commands/Fun/VideoToGif";
import { ListJobs } from "../Commands/Util/ListJobs";
import { ThrowException } from "../Commands/Test/ThrowException";
import { BotInvite } from "@commands/Discord/BotInvite";
import { CreateGuildData } from "@commands/Test/CreateGuildData";
import { BotInfo } from "@commands/Discord/BotInfo";
import { SupportServer } from "@commands/Discord/SupportServer";
import { GetExperiment } from "@commands/Discord/GetExperiment";
import { GetClientExperiments } from "@commands/Test/GetClientExperiments";
import { moderate } from "@commands/Moderation/Moderate"
import { Regex } from "@commands/Regex";
import { ServerInfo } from "@commands/Discord/ServerInfo";
import { BuildDiff } from "@commands/Discord/BuildDiff";
import { BuildInfo } from "@commands/Discord/BuildInfo";
import { CanaryCompare } from "@commands/Discord/CanaryCompare";
import { Avatar } from "@commands/User/Avatar";
import { PetPet } from "@commands/User/PetPet";
import { GetFFlag } from "@commands/Roblox/FFlag/GetFFlag";
import { Eval } from "@commands/Util/Eval";

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
  Avatar,
  PetPet,
  GetFFlag,
  Eval
]