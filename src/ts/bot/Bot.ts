import CommandHandler from "./CommandHandler.js";
import f from "./util/console.js";

import type {BotConfig, MessageCommand} from "./types.js";
import type {Client, Message, TextChannel} from "discord.js";



export default class Bot {
	static client: Client;
	static config: BotConfig;

	static processCommand(message: Message): void {
		const text = message.content;

		const inputString = text.split(this.config.prefix)[1];
		const commandSegments = inputString.trim().split(" ");


		const command: MessageCommand = {
			args: commandSegments.slice(1), // all but first (command type)
			channel: <TextChannel>message.channel,
			client: this.client,
			guild: message.guild!,
			mentions: Array.from(message.mentions.users.values()),
			message: message,
			name: commandSegments[0],
			sender: message.author
		};


		CommandHandler.run(command);
	}

	static log(...args: string[]): void {
		console.log(f("Bold + Green", "[Bot] ", "Reset + White", ...args));
	}

	static info(...args: string[]): void {
		console.log(f("Bold + Blue", "[Bot] ", "Reset + White", ...args));
	}

	static error(...args: string[]): void {
		console.log(f("Bold + Red", "[Bot] ", "Reset + White", ...args));
	}
}
