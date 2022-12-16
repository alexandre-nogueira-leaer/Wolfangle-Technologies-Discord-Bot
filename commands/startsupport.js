// Status Slash Command
// Latest Update: 25 Nov 22
// Updated by: Alecaan (CO WEB)
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

//TODO - Merge all support commands into one with subcommands
module.exports = {
    data: new SlashCommandBuilder()
        .setName("startsupport")
        .setDescription("Starts a support session")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user that requested support")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason of the requested support")
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const selectedUser = interaction.options.getUser("user");

        const discordMod = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Discord Moderator"
        );

        const staff = interaction.guild.roles.cache.findKey(
            (role) => role.name === "Staff"
        );

        if (!interaction.member.roles.cache.hasAny(staff)) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You are missing the permissions to execute the command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${discordMod}> to check if you can execute the command.`
                );
            return await interaction.reply({embeds: [errorEmbed]});
        }

        //console.log(interaction.guild.members.cache.get(selectedUser.id).voice.channel)
        //console.log(interaction.member.voice.channel.name)

        if (
            interaction.guild.members.cache.get(selectedUser.id).voice.channel?.name !==
            "General Voice" // IMPORTANT - Change to correct channel, after debugging and completion
        ) {
            // Error for user not on waiting room channel
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `Cloud not move the selected user.\nThe user you are selecting is not on the Support Waiting Room.\nMake sure to guide the user to the correct voice channel.\n\nIn case of error, please contact a <@&${discordMod}>.`
                );
            return await interaction.editReply({embeds: [errorEmbed]});
        }

        const supportChannels = [];

        interaction.guild.channels.cache.forEach(
            ((channel) => {
                if (channel.name.includes("Support Voice")) {
                    supportChannels.push(channel);
                }
            })
        );

        supportChannels.every((channel) => {
            if (channel.members.size === 0) {
                interaction.guild.members.cache
                    .get(selectedUser.id)
                    .voice.setChannel(channel);
                return false;
            }
            return true;
        });
    },
};
