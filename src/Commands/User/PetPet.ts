import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandV2 } from "src/CommandInterface";

const petPetGif = require("pet-pet-gif")

// a Mizuki CommandV2 command that makes a pet-pet-gif from a user's avatar.
export const PetPet: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("petpet")
    .setDescription("Pet someone's pfp")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to pet")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("delay")
        .setDescription("How long should the delay between frames be? Defaults to 30")
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName("resolution")
        .setDescription("The image resolution of the outputted gif - defaults to 128")
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Should everyone else see the outputted gif? - defaults to false")
        .setRequired(false),
    ),
  deferReply: true,
  contexts: ["user", "guild"],
  run: async (interaction: CommandInteraction) => {
    const user = interaction.options.getUser("user", true);
    const delay = interaction.options.get("delay")?.value as number || 30
    const resolution = interaction.options.get("resolution")?.value as number || 128
    const ephemeral = interaction.options.get("ephemeral")?.value as boolean || false

    const avatar = user.displayAvatarURL({ extension: "png", size: 4096 });

    const gif = await petPetGif(avatar, {
      delay: delay,
      resolution: resolution,
    });

    await interaction.followUp({
      files: [{
        attachment: gif,
        name: "petpet.gif"
      }],
      ephemeral: ephemeral
    });
  }
}
