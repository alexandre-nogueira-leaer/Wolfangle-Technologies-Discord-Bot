// Status Discord Bot
// Latest Update: 25 Nov 22
// Updated by: Alecaan (CO WEB)

require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const {Client, GatewayIntentBits, Collection} = require("discord.js");

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates]});

// Retrieving commands on commands directory and adding them to the commands collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

// Retrieving the events on events directory and add them to the collection
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...agrs) => event.execute(...args));
    }
}

// Executes a command that is called
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error executing the command",
            ephemeral: true,
        });
    }
});

client.login(process.env.TOKEN);
