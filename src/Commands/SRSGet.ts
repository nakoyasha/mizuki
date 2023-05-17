import { APIEmbedField, EmbedBuilder, CommandInteraction, ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../CommandInterface";
import { CharacterInfo } from "../CharacterInfo"

import Map from "../SRSMap"
import axios from "axios"
import Emojis from "../Emojis"

import { stripHtml } from "string-strip-html";
import resolve_srs_asset from "../resolveSRSAsset"

const DESC_LIMIT = 180

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


export const SRSGet: Command = {
    name: "srsget",
    options: [
        {
            name: "character",
            description: "What character to get info for",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    description: "Gets character info from StarRailStation",
    type: ApplicationCommandType.ChatInput,

    run: async (interaction: CommandInteraction) => {
        const character = interaction.options.get("character")
        const character_value = character?.value

        try {
            const srsLink = "https://starrailstation.com/en/character/" + character_value
            const data = await get_character_data(character_value)

            var emojiRarity = Emojis.rarity_star.repeat(data.rarity)

            const embed = new EmbedBuilder()
            embed.setColor("White")
            embed.setTitle("Info for " + data.name)
            embed.setURL(srsLink)
            embed.setDescription(
                emojiRarity +
                " | " +
                Emojis[data.damageType.name] + " " + data.damageType.name + " | " +
                Emojis[data.baseType.name] + " " + data.baseType.name +
                "\n\n" +
                data.descHash + "\n\n **Skills**\n")
            embed.setThumbnail(resolve_srs_asset(data.artPath))
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

            await interaction.followUp({
                embeds: [
                    embed
                ],
            })
        } catch (error: any) {
            console.log(error)
            // await interaction.followUp({
            //     ephemeral: false,
            //     content: "oopsie"
            // })
        }
    }
};