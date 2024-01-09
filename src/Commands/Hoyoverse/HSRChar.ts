import {
  APIEmbedField,
  EmbedBuilder,
  CommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ColorResolvable,
  SlashCommandBuilder,
} from "discord.js";
import { CalculatedLevelStats, CharacterInfo } from "../../Types/CharacterInfo";

import axios from "axios";
import Emojis from "../../Maps/EmojisMap";

import { stripHtml } from "string-strip-html";
import resolve_srs_asset from "../../resolveSRSAsset";
import { Command, CommandV2 } from "src/CommandInterface";
import { generateSRSUrlV2 } from "src/Util/GenerateSRSUrl";

const DESC_LIMIT = 180;
const characterArtOverride = {
  trailblazer:
    "https://cdn.discordapp.com/attachments/1108389522456182836/1108389545965264946/bothmcphysical.png",
  "fire trailblazer":
    "https://cdn.discordapp.com/attachments/1108389522456182836/1108392529377898526/firemcbothv2.png",
};

// why the hell does typescript complain about string | number | undefined | blah blah
// not being able to be cast to a string??
// its LITERALLY the first type in the union !!
async function get_character_data(name: string): Promise<CharacterInfo> {
  try {
    const characterHash = await generateSRSUrlV2(name);
    console.log(`Hash: ${characterHash}`);
    const response = await axios.get(
      `https://starrailstation.com/api/v1/data/d509fd548f777f9ea5665f83e76f9654/${characterHash}`,
    );
    return response.data;
  } catch (err) {
    throw new Error("Failed to get character data for " + name + ` ${err}`);
  }
}

function calculateAscend(Level: number): number {
  if (Level <= 20) {
    return 0;
  } else if (Level > 20) {
    return 1;
  } else if (Level > 40) {
    return 2;
  } else if (Level > 50) {
    return 3;
  } else if (Level > 60) {
    return 4;
  } else if (Level > 70) {
    return 5;
  } else if (Level > 80) {
    return 6;
  } else {
    return 0;
  }
}

function calculateCharacterStats(
  Character: CharacterInfo,
  Ascend: number,
  Level: number,
): CalculatedLevelStats {
  const AttackBase = Character.levelData[Ascend].attackBase;
  const AttackAdd = Character.levelData[Ascend].attackAdd;

  const HPBase = Character.levelData[Ascend].hpBase;
  const HPAdd = Character.levelData[Ascend].hpAdd;

  const DefenseBase = Character.levelData[Ascend].defenseBase;
  const DefenseAdd = Character.levelData[Ascend].defenseAdd;

  let Attack = AttackBase;
  let HP = HPBase;
  let Defense = DefenseBase;

  for (let level = 0; level < Level; level++) {
    Attack += AttackAdd + 0.5;
    HP += HPAdd + 0.5;
    Defense += DefenseAdd + 0.5;
  }

  return {
    HP: Math.round(HP),
    Defense: Math.round(Defense),
    Attack: Math.round(Attack),
  };
}

export const HSRChar: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("hsrchar")
    .setDescription("Gets info about a Honkai: Star Rail info")
    .addStringOption(option => option
      .setName("character")
      .setDescription("What character to get info for")
      .setRequired(true)
    )
    .addIntegerOption(option => option
      .setName("level")
      .setDescription("WIP: Attempts to get the stats for the level.")
      .setRequired(true)
    )
  ,
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    const character = interaction.options.get("character", true);
    const character_value =
      character?.value as keyof typeof characterArtOverride;

    const level =
      (interaction.options.get("level", false)?.value as number) || 0;

    try {
      const data = await get_character_data(character_value);
      const srsLink = "https://starrailstation.com/en/character/" + data.pageId;
      const hasOverrideImage = characterArtOverride[character_value] != null;

      const emojiRarity = Emojis.rarity_star.repeat(data.rarity);
      const CalculatedLevelStats = calculateCharacterStats(
        data,
        calculateAscend(level),
        level,
      );

      const resolvedThumbnail = resolve_srs_asset(data.artPath);

      const embed = new EmbedBuilder();
      const color: ColorResolvable = data.damageType.color;
      embed.setColor(color);
      embed.setTitle("Info for " + data.name);
      embed.setURL(srsLink);
      embed.setDescription(
        emojiRarity +
        " | " +
        Emojis[data.damageType.name as never] +
        " " +
        data.damageType.name +
        " | " +
        Emojis[data.baseType.name as never] +
        " " +
        data.baseType.name +
        " | " +
        "HP: " +
        CalculatedLevelStats.HP +
        " | " +
        "ATK: " +
        CalculatedLevelStats.Attack +
        " | " +
        "DEF: " +
        CalculatedLevelStats.Defense +
        " | " +
        "\n\n" +
        data.descHash +
        "\n\n **Skills**\n",
      );
      if (hasOverrideImage != true) {
        embed.setImage(resolvedThumbnail);
      } else {
        embed.setImage(characterArtOverride[character_value]);
      }

      const fields: APIEmbedField[] = [];

      data.skills.forEach((skill) => {
        //var trimmedDescription = skill.descHash.substring(50, skill.descHash.length)
        let trimmedDescription = stripHtml(skill.descHash).result;
        trimmedDescription = trimmedDescription.replaceAll("#", "");
        trimmedDescription = trimmedDescription.replaceAll("[i]", "");
        trimmedDescription = trimmedDescription.replaceAll("[f1]", "");

        if (trimmedDescription.length > DESC_LIMIT) {
          trimmedDescription =
            trimmedDescription.substring(0, DESC_LIMIT) + "...";
        }

        fields.push({
          name: skill.name,
          value: trimmedDescription,
          inline: true,
        });
      });

      embed.setFields(fields);

      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      await interaction.reply({
        ephemeral: false,
        content: error + " (does the character exist?)",
      });
    }
  },
};
