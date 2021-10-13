import Bot from "./Bot.js";
import {URL} from "url";

import * as fs from "fs-extra";
//@ts-ignore
const {readdirSync} = fs.default;

import type {Command} from "./types.js";






export default class CommandHandler {
	static commands: {[name: string]: Function} = {};

	static init(): void {
		console.log("initted")

		const target = (new URL("./commands/", import.meta.url).pathname).slice(1); // slice removes the prefixed /

		const commands: string[] = readdirSync(target)
			.filter((file: string) => file.split(".")[1] === "js") // only the ones that are js files
			.map((file: string) => file = file.slice(0, file.length - 3)); // cut to names without extensions

		
		commands.forEach((command: string, index: number) => {
			import(`./commands/${command}.js`) // this could ofc be await and probably should be but I like the commands appearing in order... could do some funny business with that though (i.e. command number is based on when it appears, not on its index, but too lazy idk lmao)
			.then(module => {
				this.commands[command] = module.default;
			});

			Bot.info(`(${index + 1}/${commands.length}) Loaded command ${command}.`);
		});
	}
	
	static run(command: Command): void {
		try {
			this.commands[command.name](command);
		} catch {
			command.channel.send("The command you're trying to use doesn't exist.");
			return;
		}
	}
}
