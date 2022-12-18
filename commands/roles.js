// Add Role Slash Command
// Lastest Update: 09-09-22
// Updated by: Alecaan (CO WEB)

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Manage roles")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a role to a member")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to remove a role")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to be added")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("reason")
                        .setDescription("The reason the role was added")
                        .setRequired(false)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
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
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const execStaff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Executive Staff"
        );

        const discordMod = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );

        if (
            !interaction.member.roles.cache.hasAny(execStaff, discordMod)
        ) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are missing the permissions to execute the command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${discordMod}> to check if you can execute the command.`
                );
            return await interaction.editReply({embeds: [errorEmbed]});
        }

        const selectedUser = interaction.options.getUser("user");
        const selectedRole = interaction.options.getRole("role");
        const reason = interaction.options.getString("reason");

        if (interaction.options.getSubcommand() === "add") {
            await interaction.guild.members.cache
                .get(selectedUser.id)
                .roles.add(
                    selectedRole,
                    `Role added per slash command executed by <${interaction.member.user.username}> (${interaction.member.nickname}) || Reason: ${reason}.`
                );

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(
                    `Role added successfully`
                );
            return interaction.editReply({embeds: [successEmbed]});
        }

        if (interaction.options.getSubcommand() === "remove") {
            await interaction.guild.members.cache
                .get(selectedUser.id)
                .roles.remove(
                    selectedRole,
                    `Role removed per slash command executed by <${interaction.member.user.username}> (${interaction.member.nickname}) || Reason: ${reason}.`
                );

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(
                    `Role removed successfully`
                );
            return interaction.editReply({embeds: [successEmbed]});
        }


    },
};
