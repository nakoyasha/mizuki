import { ActivityType, RESTPostAPIApplicationCommandsJSONBody, RESTPutAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { Commands, CommandsV2 } from "@maps/CommandMaps";
import { Mizuki } from "@system/Mizuki";
import Logger from "@system/Logger";
const logger = new Logger("Listeners/Ready")

const botStatus = [
  // games that i (haruka) like

  // gacha
  "HATSUNE MIKU: COLORFUL STAGE!",
  "Honkai: Star Rail",
  "Honkai Impact 3rd",
  "龍が如くONLINE",

  // ryu ga gotoku studio
  "Yakuza 0",
  "Yakuza Kiwami",
  "Yakuza Kiwami 2",
  "Yakuza 3",
  "Yakuza 4",
  "Yakuza 5",
  "Yakuza 6: The song of Life",
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
  "A Hat in Time",
  "Cruelty Squad",

  // hehe
  "Crypt",

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
  const CommandsV1 = [...Commands.filter(
    (Command) => Command.servers == undefined,
  )]

  //logger.log(`Registering ${CommandsV1.length} CommandV1 commands`)
  // Mizuki.client.application?.commands.set(CommandsV1)

  let commandsV2 = CommandsV2.filter((Command => Command.servers == undefined))
  let CommandsV2Data = [] as RESTPostAPIApplicationCommandsJSONBody[]

  commandsV2.forEach((Command) => {
    CommandsV2Data.push((Command.data?.toJSON() as RESTPostAPIApplicationCommandsJSONBody))
  })

  const globalCommands = CommandsV2Data
  const rest = Mizuki.client.rest

  try {
    logger.log(`Started refreshing ${globalCommands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(Mizuki.client.user?.id as string),
      { body: globalCommands },
    ) as RESTPutAPIApplicationCommandsJSONBody

    logger.log(`Registered ${data.length} commands`);
  } catch (err) {
    logger.error(`Failed to register global commands: ${err}`)
  }


  pickRandomStatus();
};
