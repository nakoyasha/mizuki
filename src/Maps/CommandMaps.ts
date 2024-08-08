import { Command, CommandV2 } from "../CommandInterface";
import { HSRChar } from "@commands/Hoyoverse/HSRChar";
import { Purge } from "@commands/Moderation/Purge";
import { GetChannelInfo } from "@commands/Roblox/Channels/GetChannelInfo";
import { GetRobloxAds } from "@commands/Roblox/GetRobloxAds";
import { IsItFucked } from "@commands/Util/IsItFucked";
import { ResolveAsset } from "@commands/Util/ResolveAsset";
import { FlameText } from "@commands/Fun/FlameText";
import { VideoToGif } from "@commands/Fun/VideoToGif";
import { ListJobs } from "@commands/Util/ListJobs";
import { ThrowException } from "@commands/Test/ThrowException";
import { BotInvite } from "@commands/Discord/BotInvite";
import { CreateGuildData } from "@commands/Test/CreateGuildData";
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
import { UserInfo } from "@commands/Discord/UserInfo";
import { Base64 } from "@commands/Util/Base64";
import { ServerSetup } from "@commands/Server/config";
import { UpdateInstance } from "@commands/Util/UpdateInstance";

export const CommandsV2: CommandV2[] = [
  GetChannelInfo,
  GetRobloxAds,
  ServerSetup,
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
  Eval,
  UserInfo,
  Base64,
  UpdateInstance,
]