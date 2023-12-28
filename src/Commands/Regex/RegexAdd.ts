import { ApplicationCommandOptionType, CommandInteraction, Guild } from "discord.js";
import { Command } from "../../CommandInterface";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { GuildModel } from "@system/Database/Models/GuildSchema";
import { RegexRule } from "src/Classes/RegexRule";

export const RegexAdd: Command = {
    name: "regexadd",
    options: [
        {
            name: "rulename",
            description: "The rule name. This is required for deleting the rule after.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "rule",
            description: "The regex rule to listen for ex. /(boo)/g)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "response",
            description: "What should the bot respond with? (ex. boo!)",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    deferReply: false,
    description: "Adds a Regex Rule. (aka auto response)",
    run: async (interaction: CommandInteraction) => {
        const GuildData = await DatabaseSystem.getOrCreateGuildData(interaction.guild as Guild)
        const RegexRules = GuildData?.RegexRules

        const ruleName = interaction.options.get("rulename")?.value as string
        const newRule = interaction.options.get("rule")?.value as string
        const newResponse = interaction.options.get("response")?.value as string

        const newRegexRule = new RegexRule(ruleName, newRule, newResponse)
        console.log(newRegexRule.name)

        // if it already exists...
        if (RegexRules?.find((rule) => rule.name == ruleName)) {
            interaction.reply("There can only be one rule with that name.")
            return;
        }
        RegexRules?.push(newRegexRule)

        try {
            await GuildModel.updateOne({
                GuildId: GuildData?.GuildId
            }, { RegexRules: RegexRules });
            interaction.reply({ content: `Rule ${ruleName} has been successfully added`, ephemeral: true })
        } catch (err) {
            interaction.reply({ content: `Something went wrong while trying to add this rule: ${err}`, ephemeral: true })
        }
    }
}