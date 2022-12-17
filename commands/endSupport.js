// Status Slash Command
// Latest Update: 23 Nov 22
// Updated by: Alecaan (CO WEB)

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("endsupport").setDescription("Ends an active support session"),
    async execute(interaction) {
        await interaction.deferReply();

        const discordMod = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );
        const staff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Staff"
        );
        const execStaff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Executive Staff"
        );
        const suppStaff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Support Staff"
        );

        if (!interaction.member.roles.cache.hasAny(staff, discordMod, execStaff, suppStaff)) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are missing permissions to execute the command.\n\nPlease contact a <@&${discordMod}> to check if your permissions are incorrectly set.`
                );
            return interaction.editReply({embeds: [errorEmbed]});
        }

        if (!interaction.member.voice.channel?.name.includes("Support Voice")) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are not on an active support channel to terminate a session.\n\nPlease contact a <@&${discordMod}> in case of error.`
                );
            return interaction.editReply({embeds: [errorEmbed]});
        }

        // TODO - edit this to an AFK channel or a queue
        const exitChannel = interaction.guild.channels.cache.findKey((channel) => channel.name === "General Voice")

        await interaction.member.voice.channel.members.forEach(
            member => {
                member.voice.setChannel(exitChannel)
            }
        )

        const errorEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(
                `Support session successfully ended!`
            );
        return interaction.editReply({embeds: [errorEmbed]});

    }
}