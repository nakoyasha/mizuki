import {
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
  Guild,
  SlashCommandBuilder,
} from "discord.js";
import { CommandV2 } from "../../CommandInterface";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { RegexRule } from "../../Types/RegexRule";

export const RegexList: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("regexlist")
    .setDescription("Lists all of the currently active regex rules for the server."),
  deferReply: false,
  run: async (interaction: CommandInteraction) => {
    const GuildData = await DatabaseSystem.getOrCreateGuildData(
      interaction.guild as Guild,
    );
    const RegexRules = GuildData?.RegexRules as RegexRule[];
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
  },
};
