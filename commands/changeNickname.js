// Change Nickname Slash Command
// Lastest Update: 25 Nov 22
// Updated by: Alecaan (CO WEB)

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changenickname")
        .setDescription("Changes a user's nickname")
        .addStringOption((option) =>
            option
                .setName("nickname")
                .setDescription("The new nickname")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("If not selected, your nickname will be changed")
                .setRequired(false)
        ).addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the name change")
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const execStaff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Excutive Staff"
        );

        const discordMod = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );

        const newNickname = interaction.options.getString("nickname");
        const selectedUser = interaction.options.getUser("user");

        let reason = interaction.options.getString("reason");
        if (reason == null) {
            reason = "Not specified";
        }

        if (selectedUser == null) {
            await interaction.member.setNickname(
                newNickname,
                `Nickname changed per slash command executed by <${interaction.member.user.username}> (${interaction.member.nickname}) Reason: ${reason}.`
            );
            return await interaction.editReply("Nickname successfully changed!");
        }

        if (
            !interaction.member.roles.cache.hasAny(execStaff)
        ) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are not allowed to change other user's nicknames.\n\nPlease contact a <@&${discordMod}> to execute the command or to check if you can execute the command.`
                );
            return await interaction.editReply({embeds: [errorEmbed]});
        }

        // TODO - errors for user not found
        await interaction.guild.members.cache
            .get(selectedUser.id)
            .setNickname(
                newNickname,
                `Nickname changed per slash command executed by <${interaction.member.user.username}> (${interaction.member.nickname}) || Reason: ${reason}.`
            );
        return await interaction.editReply("Nickname successfully changed!");


    },
};
