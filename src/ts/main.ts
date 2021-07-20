import * as Discord from "discord.js";
import * as fs from "fs-extra";
import bot from "./Bot.js";



bot.setConfig(
	JSON.parse(
		fs.readFileSync("./config.json", {encoding: "utf8"})
	)
);

bot.setClient(new Discord.Client());

bot.client.login(bot.config.token);
// Note: I really don't like how this looks but I don't have much of an option



bot.client.on("ready", () => {
	bot.log("Ready!");

	// setup handler for messages
	bot.client.on("message", handleMessage);
});



function handleMessage(message: Discord.Message) {
	if(!message.content.startsWith(bot.config.prefix) ||
		!message.guild ||
		!message.guild!.available
	) {
		return;
	}

	bot.processCommand(message);
}
