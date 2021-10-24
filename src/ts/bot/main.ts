import Bot from "./Bot.js";
import CommandHandler from "./CommandHandler.js";
import * as Discord from "discord.js";
import * as fs from "fs-extra";
// @ts-ignore
const {readFileSync} = fs.default;



Bot.config = JSON.parse(readFileSync("./config.json", {encoding: "utf8"}));

Bot.client = new Discord.Client();


CommandHandler.loadCommands()
.then(commands => CommandHandler.register(commands))
.then(() => Bot.info("Commands loaded successfully."))
.then(() => Bot.client.login(Bot.config.token));



Bot.client.on("ready", () => {
	Bot.log("", "Bold", "Ready.");

	Bot.client.user!.setActivity(`${Bot.config.prefix}help`, {type: "LISTENING"});

	// setup handler for messages
	Bot.client.on("message", handleMessage);
});



function handleMessage(message: Discord.Message) {
	if(!message.content.startsWith(Bot.config.prefix) ||
		!message.guild ||
		!message.guild!.available ||
		message.author.bot
	) {
		return;
	}

	Bot.processCommand(message);
}
