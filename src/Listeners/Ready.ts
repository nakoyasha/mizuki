import { ActivityType, RESTPatchAPIApplicationCommandJSONBody, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPutAPIApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from "discord.js";
import { CommandsV2 } from "@maps/CommandMaps";
import { Mizuki } from "@system/Mizuki";
import Logger from "@system/Logger";
import { captureException } from "@sentry/node";
import { CommandContextString, CommandContextSerialized, CommandV2 } from "src/CommandInterface";

export type RESTPostAPIChatInputApplicationCommandsJSONBodyWithContext = RESTPostAPIChatInputApplicationCommandsJSONBody & {
  contexts?: CommandContextString | CommandContextSerialized,
  integration_types: [0, 1],
}

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
  let commandsV2 = CommandsV2.filter((Command => Command.servers == undefined))
  let globalCommands: RESTPostAPIChatInputApplicationCommandsJSONBodyWithContext[] = []

  commandsV2.forEach((Command) => {
    globalCommands.push((Command.data?.toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBodyWithContext))
  })

  const rest = Mizuki.client.rest

  try {
    logger.log(`Started refreshing ${globalCommands.length} application (/) commands.`);

    // making the commands work for users
    globalCommands.forEach((command) => {
      const commandData = commandsV2.find((Command) => Command.data?.name == command.name)
      // this should never happen; but maybe itll happen somehow :airidizzy:
      if (commandData == undefined) { return; }

      let commandContexts = commandData.contexts
      let serializedCommandContext: CommandContextSerialized = [0, 1, 2]

      // messy code ahead !!
      if (commandContexts != undefined) {
        serializedCommandContext = commandContexts.map((context: any) => {
          if (context == 1 || context == 2) {
            return context
          }

          if (context == "guild") {
            return 0
          } else if (context == "user") {
            return 2
          }
        }) as CommandContextSerialized
      }

      command.contexts = serializedCommandContext;
      command.integration_types = [0, 1]
    })

    const data = await rest.put(
      Routes.applicationCommands(Mizuki.client.user?.id as string),
      { body: globalCommands },
    ) as RESTPutAPIApplicationCommandsJSONBody

    logger.log(`Registered ${data.length} commands`);
  } catch (err) {
    captureException(err)
    console.log(err)
    logger.error(`Failed to register global commands: ${err}`)
  }


  pickRandomStatus();
};
