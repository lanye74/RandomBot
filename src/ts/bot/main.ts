import Bot from "./Bot.js";
import CommandHandler from "./CommandHandler.js";
import * as Discord from "discord.js";
import FSManager from "./FSManager.js";



Bot.config = JSON.parse(await FSManager.call("readFile", "./config.json", [{encoding: "utf8"}]));

Bot.client = new Discord.Client();


CommandHandler.loadCommands()
.then(commands => CommandHandler.register(commands))
.then(() => Bot.info("Commands loaded successfully."))
.then(() => Bot.client.login(Bot.config.token));


if(!(await FSManager.call("exists", "./db.json"))) {
	await FSManager.call("write", "./db.json", ["{\"servers\": {}"]);
}



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
