import * as Discord from "discord.js";
import * as fs from "fs-extra";
import Bot from "./bot.js";

const client = new Discord.Client();


const config = JSON.parse(fs.readFileSync("./config.json", {encoding: "utf8", flag: "r"}));



client.on("ready", () => {
	console.log("ready");

	ready();
});



function ready() {
	client.on("message", handleMessage);

	Bot.setConfig(config);
}



function handleMessage(messageObject: Discord.Message) {
	if(!messageObject.content.startsWith(config.prefix) || !messageObject.guild) {
		return;
	}

	if(!messageObject.guild!.available) {
		return;
	}

	Bot.processCommand(messageObject, client);
}



client.login(config.token);