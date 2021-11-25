import CommandHandler from "./CommandHandler.js";
import f from "./util/console.js";

import type {BotConfig, MessageCommand} from "./types/types.js";
import type {Client, Message, TextChannel} from "discord.js";



export default class Bot {
	static client: Client;
	static config: BotConfig;


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
