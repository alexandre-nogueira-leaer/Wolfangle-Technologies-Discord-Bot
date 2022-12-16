// Status Slash Command
// Latest Update: 25 Nov 22
// Updated by: Alecaan (CO WEB) w/ authorization granted by: Wolfangle Tech (EXEC STAFF)

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("discordmod")
        .setDescription("Grants the Discord Moderator Permissions to a staff user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("If not selected, your nickname will be changed")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("If not selected, your nickname will be changed")
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const execStaff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Executive Staff"
        );
        const staff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Staff"
        );
        const discordMod = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );

        if (
            !interaction.member.roles.cache.has(execStaff) ||
            !interaction.member.roles.cache.has(discordMod)
        ) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are missing the permissions to execute a **Moderation** command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${execStaff}>.`
                );
            return await interaction.editReply({embeds: [errorEmbed]});
        }

        const selectedUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        if (
            !interaction.guild.members.cache
                .get(selectedUser.id)
                .roles.cache.has(staff)
        ) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `The user you have selected is missing the required roles to be added to the Moderators List.\nMake sure you have selected the correct user.\n\nIn case of doubt, please contact a <@&${discordMod}> to check if you can execute the command.`
                );
            return await interaction.editReply({embeds: [errorEmbed]});
        }


        interaction.guild.members.cache
            .get(selectedUser.id)
            .roles.add(
            discordMod,
            `Moderation access granted per slash command executed by <${interaction.member.user.username}> (${interaction.member.nickname}) || Reason: ${reason}.`
        );

        // TODO - Make the reply an embed
        await interaction.editReply(
            `**Moderation access** successfully granted to user: **${
                interaction.guild.members.cache.get(selectedUser.id).nickname
            }**!"`
        );
    },
};
