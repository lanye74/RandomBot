import Bot from "./Bot.js";
import CommandHandler from "./CommandHandler.js";
import * as Discord from "discord.js";
import FSManager from "./FSManager.js";



Bot.config = JSON.parse(await FSManager.call("readFile", "./config.json", [{encoding: "utf8"}]));

Bot.client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES"],
	presence: {
		activities: [{name: `${Bot.config.prefix}help`, type: "LISTENING"}]
	}
});


CommandHandler.loadCommands()
.then(commands => CommandHandler.register(commands))
.then(() => Bot.info("Commands loaded successfully."))
.then(() => Bot.client.login(Bot.config.token))
.catch((error: any) => Bot.error(`Error while loading: ${error}`));



if(!(await FSManager.call("exists", "./serverSaves.json"))) {
	await FSManager.call("write", "./serverSaves.json", ["{\"servers\": {}"]);
}



Bot.client.on("ready", () => {
	Bot.log("", "Bold", "Ready.");

	// Bot.client.user!.setActivity();

	// setup handler for messages
	Bot.client.on("messageCreate", handleMessage);
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
