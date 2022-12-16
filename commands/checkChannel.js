const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkchannel")
        .setDescription("TODO"),
    async execute(interaction) {
        await interaction.deferReply();

        const discordMod = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );

        if (!interaction.member.roles.cache.has(discordMod)) {
            return interaction.editReply("You cannot access this command.");
        }

        console.log(interaction.member.voice.channel.name);
        await interaction.editReply(interaction.member.voice.channel.name);
    }
}