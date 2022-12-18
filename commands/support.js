// Status Slash Command
// Latest Update: 25 Nov 22
// Updated by: Alecaan (CO WEB)
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

//TODO - Merge all support commands into one with subcommands
module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Commands for a support session")
        .addSubcommand(subcommand =>
            subcommand
                .setName("start")
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
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName("end")
                .setDescription("Ends an active support session")),

    async execute(interaction) {
        await interaction.deferReply();

        const selectedUser = interaction.options.getUser("user");

        // TODO - refactor get roles code (perhaps transform into a method to be used on all files)

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
                    `You are missing the permissions to execute the command.\nMake sure you are allowed to execute this command.\n\nIn case of doubt, please contact a <@&${discordMod}> to check if you can execute the command.`
                );
            return await interaction.reply({embeds: [errorEmbed]});
        }

        if (interaction.options.getSubcommand() === "start") {
            if (interaction.member.voice.channel?.name !== "General Voice")
                // TODO !IMPORTANT - Change to correct channel, after debugging and completion
            {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription(
                        `Could not move you.\nYou are not in the Support Waiting Room.\nMake sure to join the correct voice channel.\n\nIn case of error, please contact a <@&${discordMod}>.`
                    );
                return await interaction.editReply({embeds: [errorEmbed]});
            }

            if (
                interaction.guild.members.cache.get(selectedUser.id).voice.channel?.name !==
                "General Voice" // TODO !IMPORTANT - Change to correct channel, after debugging and completion
            ) {
                // Error for user not on waiting room channel
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription(
                        `Could not move the selected user.\nThe user you are selecting is not on the Support Waiting Room.\nMake sure to guide the user to the correct voice channel.\n\nIn case of error, please contact a <@&${discordMod}>.`
                    );
                return await interaction.editReply({embeds: [errorEmbed]});
            }

            if (!interaction.guild.channels.cache.some(
                ((channel) => {
                    if (channel.name.includes("Support Voice")) {
                        if (channel.members.size === 0) {
                            interaction.member.voice.setChannel(channel);
                            interaction.guild.members.cache
                                .get(selectedUser.id)
                                .voice.setChannel(channel);
                            return true;
                        }
                    }
                })
            )) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription(
                        `All support channels full.\nPlease wait for a free room in order to conduct the support.\nIf the waiting time is too long, please use other methods of assistance.\n\nIn case of error, please contact a <@&${discordMod}>.`
                    );
                return await interaction.editReply({embeds: [errorEmbed]});
            }

            const errorEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(
                    `Support session successfully started!\nTo end the session please use the \`/endsupport\` slash command`
                );
            return interaction.editReply({embeds: [errorEmbed]});
        }

        if (interaction.options.getSubcommand() === "end") {
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


    },
};
