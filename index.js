import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
	],
})

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
    // Basic checking
    if (message.author.bot) return false;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
    if (message.mentions.has(client.user.id) || message.content.includes("sedbot->")) {
        console.log("Bot mentioned!")
        if (message.type == "REPLY") {
            console.log(message.reference);
        } else {
            console.log(message.content);
        }
    }
})

client.login(process.env.TOKEN);