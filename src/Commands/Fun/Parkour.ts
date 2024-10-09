// In Parkour Civilizatio-
import {
  SlashCommandBuilder,
  CommandInteraction,
  codeBlock,
  ChatInputCommandInteraction,
} from "discord.js";
import { CommandV2 } from "src/CommandInterface";

// Phew, thank god it's Latin!
// this has to be wrapped in Object.entries because
// otherwise... js doesn't like it, i guess.
const languageMap = new Map<string, string>(
  Object.entries({
    a: "_",
    b: "[]",
    c: "!",
    d: "L",
    e: "H",
    f: "[L]",
    g: "[H]",
    h: "_|",
    i: "_||",
    j: "_|||",
    k: "_||||",
    l: "[_]",
    m: "↺",

    // lower-line
    n: "_",
    o: "[]",
    p: "!",
    q: "L",
    r: "H",
    s: "[L]",
    t: "[H]",
    u: "_|",
    v: "_||",
    w: "_|||",
    x: "_||||",
    y: "[_]",
    z: "↺",

    // special
    " ": "_",
  })
);

export const ParkourTranslate: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("parkour")
    .setDescription(
      "Translates text into the Parkour Civilization's language and back. (why did i make this)"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("translate-to")
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("What do you want to translate?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("translate-from")
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("What do you want to translate?")
            .setRequired(true)
        )
    ),

  run: async (interaction: ChatInputCommandInteraction) => {
    const text = interaction.options.get("text")?.value as string;

    const split = text.split("");
    let result = "";

    if (interaction.options.getSubcommand() == "translate-to") {
      for (let character of split) {
        const lowerCase = character.toLowerCase();
        const parkourLetter = languageMap.get(lowerCase);

        if (parkourLetter == undefined) {
          console.warn(`Unknown letter: ${lowerCase}`);
          continue;
        }

        result = `${result}${parkourLetter}`;
      }
    } else if (interaction.options.getSubcommand() == "translate-from") {
      for (let character of split) {
        const lowerCase = character.toLowerCase();
        const parkourLetter = languageMap.get(lowerCase);

        if (parkourLetter == undefined) {
          console.warn(`Unknown letter: ${lowerCase}`);
          continue;
        }

        result = `${result}${parkourLetter}`;
      }
    }

    await interaction.reply(codeBlock(result));
  },
};
