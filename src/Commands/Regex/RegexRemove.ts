import { ApplicationCommandOptionType, CommandInteraction, Guild } from "discord.js";
import { Command } from "../../CommandInterface";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { GuildModel } from "@system/Database/Models/GuildSchema";
import { RegexRule } from "src/Classes/RegexRule";


export const RegexRemove: Command = {
    name: "regexremove",
    options: [
        {
            name: "rulename",
            description: "The rule name. This is required for deleting the rule after.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },

    ],
    deferReply: false,
    description: "Removes a regex rule",
    run: async (interaction: CommandInteraction) => {
        const GuildData = await DatabaseSystem.getOrCreateGuildData(interaction.guild as Guild)
        const ruleName = interaction.options.get("rulename")?.value as string

        var RegexRules = GuildData?.RegexRules as RegexRule[]
        RegexRules = RegexRules.filter((rule) => rule.name == ruleName)

        try {
            await GuildModel.updateOne({
                GuildId: GuildData?.GuildId
            }, { RegexRules: RegexRules });
            interaction.reply({ content: `Rule ${ruleName} has been successfully removed`, ephemeral: true })
        } catch (err) {
            interaction.reply({ content: `Something went wrong while trying to remove this rule: ${err}`, ephemeral: true })
        }
    }
}