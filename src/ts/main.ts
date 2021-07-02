import * as Discord from "discord.js";
import * as fs from "fs-extra";
import Bot from "./Bot.js";
import BitMath from "./BitMath.js";

const client = new Discord.Client();


const config = JSON.parse(fs.readFileSync("./config.json", {encoding: "utf8", flag: "r"}));

var b = BitMath

client.on("ready", () => { // move client into Bot class?
	console.log("ready");

	
	ready();
});



function ready() {
	client.on("message", handleMessage);

	Bot.setConfig(config);
}



function handleMessage(messageObject: Discord.Message) {
	if(!messageObject.content.startsWith(Bot.config.prefix) || !messageObject.guild) {
		return;
	}

	if(!messageObject.guild!.available) {
		return;
	}

	Bot.processCommand(messageObject, client);

	// console.log(messageObject);
}



client.login(config.token);