// Shutdown Command
// Latest Update: 08-09-22
// Updated by: Alecaan (CO WEB)

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("Shuts down the Bot"),
    async execute(interaction) {
        // Checks for Executive Staff role to execute
        if (
            interaction.member.roles.cache.some(
                (role) => role.name === "Executive Staff"
            )
        ) {
            await interaction.reply("Shutting down...");
            const currentDate = new Date();
            // TODO - format the time to add zeros at missing spots
            console.log(
                `Bot shut down by ${
                    interaction.member.nickname
                } at time ${currentDate.getFullYear()}/${
                    currentDate.getMonth() + 1
                }/${currentDate.getDate()}-${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
            );
            await interaction.client.destroy();
        } else {
            // Build the error embed
            const discordModeratorId = interaction.guild.roles.cache.findKey(
                (role) => role.name === "Discord Moderator"
            );
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are missing the permissions to execute the command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${discordModeratorId}> to check if you can execute the command.`
                );
            interaction.reply({embeds: [errorEmbed]});
        }
    },
};
