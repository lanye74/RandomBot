import * as Discord from "discord.js";
import * as fs from "fs-extra";
import botCommands from "./botCommands.js";

const client = new Discord.Client();


const config = JSON.parse(fs.readFileSync("./config.json", {encoding: "utf8", flag: "r"}));



client.on("ready", () => {
	console.log("ready");

	ready();
});



function ready() {
	client.on("message", handleMessage);
}



function handleMessage(messageObject: Discord.Message) {
	const rawMessageContent = messageObject.content;

	console.log(rawMessageContent);

	if(!rawMessageContent.startsWith(config.prefix)) {
		return;
	}

	const command = rawMessageContent.split(config.prefix)[1];
	

	console.log(botCommands["kick"], command);

	botCommands[command](messageObject, client);
}



client.login(config.token);