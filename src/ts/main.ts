import * as Discord from "discord.js";
import * as fs from "fs-extra";
import bot from "./Bot.js";
import f from "./util/console.js";
// default exports can be renamed however I want without anything fancy



bot.setConfig(
	JSON.parse(
		fs.readFileSync("./config.json", {encoding: "utf8", flag: "r"})
	)
);

bot.setClient(new Discord.Client());

bot.client.login(bot.config.token);
// Note: I really don't like how this looks but I don't have much of an option




bot.client.on("ready", () => {
	console.log(f("Bold + Green", "[Bot]", "Reset + White", " Ready!"));

	ready();
});



function ready() {
	bot.client.on("message", handleMessage);
}



function handleMessage(message: Discord.Message) {
	if(!message.content.startsWith(bot.config.prefix) || !message.guild) {
		return;
	}

	if(!message.guild!.available) {
		return;
	}

	bot.processCommand(message);
}