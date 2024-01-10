import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
  Guild,
  SlashCommandBuilder,
} from "discord.js";
import { Command, CommandV2 } from "../../CommandInterface";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { GuildModel } from "@system/Database/Models/GuildSchema";
import { RegexRule } from "src/Classes/RegexRule";

export const Regex: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("regex")
    .setDescription("Configure regex rules.")
    .addSubcommand(subCommand => subCommand
      .setName("add")
      .setDescription("Adds a regex rule.")
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
      )

    )
    .addSubcommand(subCommand => subCommand
      .setName("remove")
      .setDescription("Removes a regex rule. (aka auto response)")
      .addStringOption(option => option
        .setName("name")
        .setDescription("What rule to delete?")
        .setRequired(true)
      )
    )
    .addSubcommand(subCommand => subCommand
      .setName("list")
      .setDescription("Lists all of the currently active regex rules for the server.")
    )
  ,
  run: async (interaction: ChatInputCommandInteraction) => {
    const GuildData = await DatabaseSystem.getOrCreateGuildData(
      interaction.guild as Guild,
    );
    const subCommand = interaction.options.getSubcommand()
    const RegexRules = GuildData?.RegexRules as RegexRule[];

    const ruleName = interaction.options.get("name")?.value as string;
    const newRule = interaction.options.get("rule")?.value as string;
    const newResponse = interaction.options.get("response")?.value as string;

    if (subCommand == "add") {
      const newRegexRule = new RegexRule(ruleName, newRule, newResponse);
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
    } else if (subCommand == "remove") {
      let RegexRules = GuildData?.RegexRules as RegexRule[];
      RegexRules = RegexRules.filter((rule) => rule.name !== ruleName);

      try {
        await GuildModel.updateOne(
          {
            GuildId: GuildData?.GuildId,
          },
          { RegexRules: RegexRules },
        );
        interaction.reply({
          content: `Rule ${ruleName} has been successfully removed`,
          ephemeral: true,
        });
      } catch (err) {
        interaction.reply({
          content: `Something went wrong while trying to remove this rule: ${err}`,
          ephemeral: true,
        });
      }
    } else if (subCommand == "list") {
      const embed = new EmbedBuilder();
      const fields = [] as EmbedField[];
      embed.setColor(0xffffff);
      embed.setTitle(`Active regex rules for ${interaction.guild?.name}`);

      await RegexRules.forEach((rule) => {
        fields.push({
          name: `${rule.name}`,
          value: `${rule.response}`,
          inline: true,
        });
      });

      embed.setFields(fields);
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
