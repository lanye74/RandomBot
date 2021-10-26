import RBCommand from "../RBCommand.js";
import sleep from "../util/sleep.js";

import type {MessageCommand} from "../types.js";
import type {TextChannel} from "discord.js";



export default class kill extends RBCommand {
	static description = "Kills the bot. Don't touch.";
	static friendlyName = "Kill";
	static usage = "kill";

	private static confirmCounter: number = 0;

	static async run(command: MessageCommand): Promise<void> {
		const {channel} = command;

		if(command.sender.id !== "393898580177321985") {
			command.channel.send("You don't have permission to use this.");
			return;
		}

		if(++this.confirmCounter === 2) {
			await channel.send("Shutting down."); // ensure that message is sent before shutting off

			process.exit();
		}


		if(this.confirmCounter === 1) {
			channel.send("Are you sure you want to do this? :(");

			this.initiateTimeout(channel);
		}
	}

	static async initiateTimeout(channel: TextChannel): Promise<void> {
		await sleep(10000);

		channel.send("Request timed out.");

		this.confirmCounter = 0;
	}
}
