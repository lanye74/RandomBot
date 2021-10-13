import * as Discord from "discord.js";
import * as fs from "fs-extra";
// @ts-ignore
const {readFileSync} = fs.default;

import Bot from "./Bot.js";
import CommandHandler from "./CommandHandler.js";



Bot.setConfig(
	JSON.parse(
		readFileSync("./config.json", {encoding: "utf8"})
	)
);

Bot.setClient(new Discord.Client());
Bot.client.login(Bot.config.token);


CommandHandler.init();



Bot.client.on("ready", () => {
	Bot.log("Ready!");

	Bot.client.user!.setActivity(`${Bot.config.prefix}help`, {type: "LISTENING"});

	// setup handler for messages
	Bot.client.on("message", handleMessage);
});



function handleMessage(message: Discord.Message) {
	if(!message.content.startsWith(Bot.config.prefix) ||
		!message.guild ||
		!message.guild!.available
	) {
		return;
	}

	Bot.processCommand(message);
}
