import { CommandV2 } from "../CommandInterface";
import { HSRChar } from "@commands/Hoyoverse/HSRChar";
import { Purge } from "@commands/Moderation/Purge";
import { GetChannelInfo } from "@commands/Roblox/Channels/GetChannelInfo";
import { IsItFucked } from "@commands/Util/IsItFucked";
import { ResolveAsset } from "@commands/Util/ResolveAsset";
import { FlameText } from "@commands/Fun/FlameText";
import { VideoToGif } from "@commands/Fun/VideoToGif";
import { ListJobs } from "@commands/Util/ListJobs";
import { ThrowException } from "@commands/Test/ThrowException";
import { BotInvite } from "@commands/Discord/BotInvite";
import { CreateGuildData } from "@commands/Test/CreateGuildData";
import { SupportServer } from "@commands/Discord/SupportServer";
import { moderate } from "@commands/Moderation/Moderate";
import { Regex } from "@commands/Regex";
import { ServerInfo } from "@commands/Discord/ServerInfo";
import { Avatar } from "@commands/User/Avatar";
import { PetPet } from "@commands/User/PetPet";
import { GetFFlag } from "@commands/Roblox/FFlag/GetFFlag";
import { Eval } from "@commands/Util/Eval";
import { UserInfo } from "@commands/Discord/UserInfo";
import { Base64 } from "@commands/Util/Base64";
import { ServerSetup } from "@commands/Server/config";
import { UpdateInstance } from "@commands/Util/UpdateInstance";
import { DoesItBeat } from "@commands/Fun/DoesItBeat";
import { ParkourTranslate } from "@commands/Fun/Parkour";
import { BotInfo } from "@commands/Discord/BotInfo";

export const CommandsV2: CommandV2[] = [
  GetChannelInfo,
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
  BotInfo,
  CreateGuildData,
  SupportServer,
  moderate,
  Regex,
  ServerInfo,
  Avatar,
  PetPet,
  GetFFlag,
  Eval,
  UserInfo,
  Base64,
  UpdateInstance,
  DoesItBeat,
  ParkourTranslate,
];
