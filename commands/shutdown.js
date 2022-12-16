// Shutdown Command
// Latest Update: 16 Dec 22
// Updated by: Alecaan (CO WEB)

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("Shuts down the Bot"),
    async execute(interaction) {

        const execStaff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Executive Staff"
        );
        const discordModerator = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );

        if (!interaction.member.roles.cache.has(execStaff)) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are missing the permissions to execute the command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${discordModerator}> to check if you can execute the command.`
                );
            return await interaction.reply({embeds: [errorEmbed]});
        }

        await interaction.reply("Shutting down...");
        const date = moment();
        const currentDate = date.format("DD/MM/YYYY hh:mm:ss")
        console.log(currentDate);

        await interaction.client.destroy();
    },
};
