import { Client, Events, GatewayIntentBits, MessageType } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
	],
})

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
    // Basic checking
    if (message.author.bot) return false;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
    if (message.mentions.has(client.user.id)) {
        let messageContent;
        if (message.type == MessageType.Reply) {
            messageContent = message.content.replace(`<@${client.user.id}>`, "").trimStart();
            messageContent += " " + (await message.fetchReference(message.reference.messageId)).content.trimStart();
        } else {
            messageContent = message.content.replace(`<@${client.user.id}>`, "").trimStart();
        }
        // Get all parts of sed statement and rest of text, make sure escaped slashes are saved
        let message_parts = messageContent.match(/([^,]+)\/([^,]+)\/([^,]+)\/(.*)/);
        if (message_parts.length <= 0 || message_parts.length < 4 || (message_parts[1] != "s" && messageContent.at(1) != "/")) {
            return false;
        }
        // Get first space and get flag of sed statement
        let index_of_first_space = message_parts[4].indexOf(" ");
        let message_without_sed = [message_parts[4].slice(0,index_of_first_space), message_parts[4].slice(index_of_first_space+1)];
        if (message_without_sed.length < 2) {
            return false;
        }
        // Create regexp pattern and sed the content
        let pattern = new RegExp(message_parts[2], message_without_sed[0]);
        let sedContent = message_without_sed[1].replace(pattern, message_parts[3]);
        // Finally reply!
        message.reply(sedContent).catch((e) => {
            console.log("Error encountered");
            console.error(e);
        })
    } else {
        return false;
    }
})

client.login(process.env.TOKEN);