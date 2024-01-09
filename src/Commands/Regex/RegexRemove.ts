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

export const RegexRemove: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("regexremove")
    .setDescription("Removes a regex rule. (aka auto response)")
    .addStringOption(option => option
      .setName("name")
      .setDescription("What rule to delete?")
      .setRequired(true)
    ),
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    const GuildData = await DatabaseSystem.getOrCreateGuildData(
      interaction.guild as Guild,
    );
    const ruleName = interaction.options.get("name")?.value as string;

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
  },
};
