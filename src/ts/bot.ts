import type {Message, Client} from "discord.js";
import type {BotConfig, Command} from "./types.js";

import CommandHandler from "./commandHandler.js";
import f from "./util/console.js";
// default exports can be renamed however I want without anything fancy



export default class Bot { // thank god for static methods or this would be a plain object still
	static client: Client;
	static config: BotConfig;


	// logging -

	static error(...args: string[]): void {
		console.log(f("Bold + Red", "[Bot] ", "Reset + White", ...args));
	}

	static log(...args: string[]): void {
		console.log(f("Bold + Green", "[Bot] ", "Reset + White", ...args));
	}


	// actual bot things

	static processCommand(message: Message): void {
		const text = message.content;

		const inputString = text.split(this.config.prefix)[1];
		const commandSegments = inputString.split(" ");


		const command: Command = {
			args: commandSegments.slice(1), // all but first (command type)
			client: this.client,
			message: message,
			name: commandSegments[0],
			sender: message.author
		};


		CommandHandler.run(command);
	}

	static setClient(client: Client): void {
		this.client = client;
	}

	static setConfig(config: BotConfig): void {
		this.config = config;
	}

}
