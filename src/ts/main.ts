import * as Discord from "discord.js";
import botCommands from "./botCommands.js";



const client = new Discord.Client();



client.on("ready", () => {
	console.log("ready");

	ready();
});



function ready() {
	client.on("message", handleMessage);
}



function handleMessage(messageObject: Discord.Message) {
	const rawMessageContent = messageObject.content;


	if(!rawMessageContent.startsWith("--")) {
		return;
	}

	const command = rawMessageContent.split("--")[1];



	if(command === "ping") {
		botCommands.ping(messageObject, client);
	}
}



client.login("ODU5OTE1Mjk1MjA3NzE4OTIy.YNzohg.kCyunFs_uI2LpLGn82maZevDzWE");