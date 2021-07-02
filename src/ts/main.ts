import * as Discord from "discord.js";
import * as fs from "fs-extra";
import bot from "./Bot.js";
// default exports can be renamed however I want without anything fancy



bot.setConfig(JSON.parse(fs.readFileSync("./config.json", {encoding: "utf8", flag: "r"})));
bot.setClient(new Discord.Client());

bot.client.login(bot.config.token);


// Note: I really don't like how this looks but I don't have much of an option



bot.client.on("ready", () => {
	console.log("ready");

	ready();
});



function ready() {
	bot.client.on("message", handleMessage);
}



function handleMessage(messageObject: Discord.Message) {
	if(!messageObject.content.startsWith(bot.config.prefix) || !messageObject.guild) {
		return;
	}

	if(!messageObject.guild!.available) {
		return;
	}

	bot.processCommand(messageObject);
}