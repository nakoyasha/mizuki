import {
  ApplicationCommandOptionType,
  CommandInteraction,
  Guild,
  SlashCommandBuilder,
} from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { GuildModel } from "@system/Database/Models/GuildSchema";
import { RegexRule } from "src/Classes/RegexRule";

export const RegexAdd: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("regexadd")
    .setDescription("Adds a Regex Rule. (aka auto response)")
    .addStringOption(option => option
      .setName("name")
      .setDescription("The rule name. This is required for deleting the rule.")
      .setRequired(true))
    .addStringOption(option => option
      .setName("rule")
      .setDescription("The regex rule to listen for ex. /(boo)/g) will listen for \"boo\" ")
      .setRequired(true))
    .addStringOption(option => option
      .setName("response")
      .setDescription("What should the bot respond with? (ex. boo!)")
      .setRequired(true)
    ),
  run: async (interaction: CommandInteraction) => {
    const GuildData = await DatabaseSystem.getOrCreateGuildData(
      interaction.guild as Guild,
    );
    const RegexRules = GuildData?.RegexRules;

    const ruleName = interaction.options.get("name")?.value as string;
    const newRule = interaction.options.get("rule")?.value as string;
    const newResponse = interaction.options.get("response")?.value as string;

    const newRegexRule = new RegexRule(ruleName, newRule, newResponse);
    console.log(newRegexRule.name);

    // if it already exists...
    if (RegexRules?.find((rule) => rule.name == ruleName)) {
      interaction.reply("There can only be one rule with that name.");
      return;
    }
    RegexRules?.push(newRegexRule);

    try {
      await GuildModel.updateOne(
        {
          GuildId: GuildData?.GuildId,
        },
        { RegexRules: RegexRules },
      );
      interaction.reply({
        content: `Rule ${ruleName} has been successfully added`,
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
        content: `Something went wrong while trying to add this rule: ${err}`,
        ephemeral: true,
      });
    }
  },
};
