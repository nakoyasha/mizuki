import { APIEmbedField, EmbedBuilder, CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, ColorResolvable } from "discord.js";
import { CalculatedLevelStats, CharacterInfo } from "../../CharacterInfo"

import Map from "../../SRSMap"
import axios from "axios"
import Emojis from "../../Emojis"

import { stripHtml } from "string-strip-html";
import resolve_srs_asset from "../../resolveSRSAsset"
import { Command } from "src/CommandInterface";


const DESC_LIMIT = 180
const characterArtOverride: any = {
    trailblazer: "https://cdn.discordapp.com/attachments/1108389522456182836/1108389545965264946/bothmcphysical.png",
    "fire trailblazer": "https://cdn.discordapp.com/attachments/1108389522456182836/1108392529377898526/firemcbothv2.png"
}

// why the hell does typescript complain about string | number | undefined | blah blah
// not being able to be cast to a string??
// its LITERALLY the first type in the union !!
async function get_character_data(name: any): Promise<CharacterInfo> {
    try {
        const response = await axios.get(Map[name])
        return response.data
    } catch (err) {
        throw new Error("Failed to get character data for " + name)
    }
}


function calculateAscend(Level: any): number {
    if (Level <= 20) {
        return 0;
    } else if (Level > 20) {
        return 1
    } else if (Level > 40) {
        return 2
    } else if (Level > 50) {
        return 3
    } else if (Level > 60) {
        return 4
    } else if (Level > 70) {
        return 5
    } else if (Level > 80) {
        return 6
    } else {
        return 0;
    }
}

function calculateCharacterStats(Character: CharacterInfo, Ascend: number, Level: number): CalculatedLevelStats {
    const AttackBase = Character.levelData[Ascend].attackBase
    const AttackAdd = Character.levelData[Ascend].attackAdd

    const HPBase = Character.levelData[Ascend].hpBase
    const HPAdd = Character.levelData[Ascend].hpAdd

    const DefenseBase = Character.levelData[Ascend].defenseBase
    const DefenseAdd = Character.levelData[Ascend].defenseAdd

    var Attack = AttackBase
    var HP = HPBase
    var Defense = DefenseBase

    for (let level = 0; level < Level; level++) {
        Attack += AttackAdd + 0.5
        HP += HPAdd + 0.5
        Defense += DefenseAdd + 0.5
    }

    return {
        HP: Math.round(HP),
        Defense: Math.round(Defense),
        Attack: Math.round(Attack),
    }
}


export const SRSGet: Command = {
    name: "srsget",
    options: [
        {
            name: "character",
            description: "What character to get info for",
            type: ApplicationCommandOptionType.String,
            required: true,
        },

        {
            name: "level",
            description: "What character level info to show",
            type: ApplicationCommandOptionType.Number,
            minValue: 1,
            maxValue: 80,
            required: false,
        }
    ],
    description: "Gets character info from StarRailStation",
    type: ApplicationCommandType.ChatInput,
    deferReply: false,
    run: async (interaction: CommandInteraction) => {
        const character = interaction.options.get("character")
        const character_value: any = character?.value

        const level: any = interaction.options.get("level")?.value || 0

        try {
            const data = await get_character_data(character_value)
            const srsLink = "https://starrailstation.com/en/character/" + data.pageId
            const hasOverrideImage = characterArtOverride[character_value] != null

            var emojiRarity = Emojis.rarity_star.repeat(data.rarity)
            const CalculatedLevelStats = calculateCharacterStats(data, calculateAscend(level), level)

            const embed = new EmbedBuilder()
            const color: ColorResolvable | any = data.damageType.color
            console.log(color)
            embed.setColor(color)
            embed.setTitle("Info for " + data.name)
            embed.setURL(srsLink)
            embed.setDescription(
                emojiRarity +
                " | " +
                Emojis[data.damageType.name] + " " + data.damageType.name + " | " +
                Emojis[data.baseType.name] + " " + data.baseType.name + " | " +
                "HP: " + CalculatedLevelStats.HP + " | " +
                "ATK: " + CalculatedLevelStats.Attack + " | " +
                "DEF: " + CalculatedLevelStats.Defense + " | " +
                "\n\n" +
                data.descHash + "\n\n **Skills**\n")
            console.log(hasOverrideImage)
            //embed.setThumbnail(resolve_srs_asset(data.miniIconPath))
            if (hasOverrideImage != true) {
                embed.setThumbnail(resolve_srs_asset(data.artPath))
            } else {
                embed.setThumbnail(characterArtOverride[character_value])
            }

            const fields: APIEmbedField[] = []

            data.skills.forEach(skill => {
                //var trimmedDescription = skill.descHash.substring(50, skill.descHash.length)
                var trimmedDescription = stripHtml(skill.descHash).result
                trimmedDescription = trimmedDescription.replaceAll("#", "")
                trimmedDescription = trimmedDescription.replaceAll("[i]", "")
                trimmedDescription = trimmedDescription.replaceAll("[f1]", "")

                if (trimmedDescription.length > DESC_LIMIT) {
                    trimmedDescription = trimmedDescription.substring(0, DESC_LIMIT) + "..."
                }

                fields.push({
                    name: skill.name,
                    value: trimmedDescription,
                    inline: true,
                })
            });

            embed.setFields(fields)

            // broken.
            // why?
            // i dont know.

            // await interaction.reply({
            //     ephemeral: true,
            //     content: "Fetching character info..."
            // })
            await interaction.reply({
                embeds: [
                    embed
                ],
                content: ""
            })
        } catch (error: any) {
            console.log(error)
            await interaction.reply({
                ephemeral: false,
                content: error + " (does the character exist?)"
            })
        }
    }
};