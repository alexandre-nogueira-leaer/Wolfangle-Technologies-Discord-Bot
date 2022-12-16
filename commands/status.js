// Status Slash Command
// Lastest Update: 07-09-22
// Updated by: Alecaan (CO WEB)

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Replies with Bot Status"),
  async execute(interaction) {
    // Check for discord-config channel to execute
    if (interaction.channel.name === "discord-config") {
      await interaction.reply("Status: **Online**!");
    } else {
      // Builds the embed error
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "This command cannot be used on this channel.\nPlease use an authorized channel to execute the command."
        );

      interaction.channel.send({ embeds: [errorEmbed] });
    }
  },
};
