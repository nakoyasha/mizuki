import {
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
  Guild,
} from "discord.js";
import { Command } from "../../CommandInterface";
import { DatabaseSystem } from "@system/Database/DatabaseSystem";
import { RegexRule } from "../../Types/RegexRule";

export const RegexList: Command = {
  name: "regexlist",
  options: [],
  deferReply: false,
  description: "Lists all active regex rules.",
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
