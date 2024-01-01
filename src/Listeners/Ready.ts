import { ActivityType } from "discord.js";
import { Commands } from "@maps/CommandMaps";
import { Mizuki } from "@system/Mizuki";
import { Command } from "../CommandInterface";

const botStatus = [
  // games that i (haruka) like

  // gacha
  "HATSUNE MIKU: COLORFUL STAGE!",
  "Honkai: Star Rail",
  "Honkai Impact 3rd",
  "龍が如くONLINE",

  // ryu ga gotoku studios
  "Yakuza: Like a Dragon",
  "Like a Dragon: Infinite Wealth",
  "Like a Dragon Gaiden: The (Wo)Man Who Erased His Name",
  "LOST JUDGMENT",
  "LOST JUDGMENT: The Kaito Files",
  "JUDGMENT",
  "JUDGE EYES REMASTERED",

  "Minecraft",
  "SIGNALIS",
  "VA-11 Hall-A: Cyberpunk Bartender Action",
  "Lethal Company",
  "Abiotic Factor",
  "Starbound",
  "Blender",
  "Cruelty Squad",

  // other websites
  "Twitter🔥",
  "wetdry.world: Battle Royale",

  // random messages to other devs :3
  "starrailstation devs please make your api public",
  "discord.js devs please stop rewriting your docs site every 6 months",
];

function pickRandomStatus() {
  const status = botStatus[Math.floor(Math.random() * botStatus.length)];

  Mizuki.client.user?.setPresence({
    status: "online",
    activities: [
      {
        name: status,
        type: ActivityType.Playing,
      },
    ],
  });

  setTimeout(pickRandomStatus, 1800000);
}

export default async (): Promise<void> => {
  const serverOnlyCommands = {} as { string: [Command?] };
  const globalCommands = Commands.filter(
    (Command) => Command.servers == undefined,
  );
  console.log(globalCommands.length);
  await Mizuki.client.application?.commands.set(globalCommands);

  pickRandomStatus();
};
