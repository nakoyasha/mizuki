import { Command } from "../CommandInterface";
import { SRSGet } from "../Commands/Hoyoverse/SRSGet";
import { ban } from "../Commands/Moderation/ban";
import { Purge } from "../Commands/Moderation/Purge";
import { GetChannelInfo } from "../Commands/Roblox/GetChannelInfo";
import { GetRobloxAds } from "../Commands/Roblox/GetRobloxAds";
import { IsItFucked } from "../Commands/Util/IsItFucked";
import { ResolveAsset } from "../Commands/Util/ResolveAsset";
import { FlameText } from "../Commands/Fun/FlameText";
import { VideoToGif } from "../Commands/Fun/VideoToGif";
import { ListJobs } from "../Commands/Util/ListJobs";
import { Setup } from "../Commands/Server/config"
import { ThrowException } from "../Commands/Test/ThrowException";
import { BotInvite } from "@commands/Discord/BotInvite";
import { CreateGuildData } from "@commands/Test/CreateGuildData";
import { RegexAdd } from "@commands/Regex/RegexAdd";
import { BotInfo } from "@commands/Discord/BotInfo";
import { RegexRemove } from "@commands/Regex/RegexRemove";
import { RegexList } from "@commands/Regex/RegexList";
import { SupportServer } from "@commands/Discord/SupportServer";
import { kick } from "@commands/Moderation/kick";

export var Commands: Command[] = [GetChannelInfo, GetRobloxAds, IsItFucked, ResolveAsset, SRSGet, Purge, FlameText, VideoToGif, ListJobs, Setup, ThrowException, BotInvite, CreateGuildData, RegexAdd, BotInfo, RegexRemove, RegexList, SupportServer, ban, kick];