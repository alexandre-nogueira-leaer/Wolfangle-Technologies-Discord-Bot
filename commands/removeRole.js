// Remove Role Slash Command
// Lastest Update: 10-09-22
// Updated by: Alecaan (CO WEB)

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Remove a role from a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove a role")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to be removed")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason the role was removed")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const execStaff = interaction.guild.roles.cache.findKey(
      (role) => role.name === "Executive Staff"
    );

    const discordMod = interaction.guild.roles.cache.findKey(
      (role) => role.name === "Discord Moderator"
    );

    if (
      !interaction.member.roles.cache.has(discordMod) &&
      !interaction.member.roles.cache.has(execStaff)
    ) {
      //interaction.deleteReply();
      const discordModeratorId = interaction.guild.roles.cache.findKey(
        (role) => role.name === "Discord Moderator"
      );
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `You are missing the permissions to execute the command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${discordModeratorId}> to check if you can execute the command.`
        );
      interaction.editReply({ embeds: [errorEmbed] });
    } else {
      const selectedUser = interaction.options.getUser("user");
      const selectedRole = interaction.options.getRole("role");
      const reason = interaction.options.getString("reason");

      await interaction.guild.members.cache
        .get(selectedUser.id)
        .roles.remove(
          selectedRole,
          `Role removed per slash command executed by <${interaction.member.user.username}> (${interaction.member.nickname}) || Reason: ${reason}.`
        );

      interaction.editReply("Role removed successfuly.");
    }
  },
};
