// Ready Event
// Lastest Update: 10-09-22
// Updated by: Alecaan (CO WEB)

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
