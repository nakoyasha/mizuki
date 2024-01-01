import { EmbedBuilder } from "@discordjs/builders";

export default (message: string) => {
  const embed = new EmbedBuilder().setDescription(message).setColor(16724787);

  return embed;
};
