import Bot from "./Bot.js";
import {URL} from "url";

import * as fs from "fs-extra";
//@ts-ignore
const {readdirSync} = fs.default;

import type {Command} from "./types.js";



export default class CommandHandler {
	static commands: {[name: string]: Function} = {};

	static init(): void {
		Bot.info("Loading commands...");

		const target = (new URL("./commands/", import.meta.url).pathname).slice(1); // slice removes the prefixed /

		const commands: string[] = readdirSync(target)
			.filter((file: string) => file.split(".")[1] === "js") // only the ones that are js files
			.map((file: string) => file = file.slice(0, file.length - 3)); // cut to names without extensions

		
		let counter = 0;
		
		commands.forEach(async command => {
			const module = await import(`./commands/${command}.js`);
			
			this.commands[command] = module.default;
			
			Bot.info(`(${++counter}/${commands.length}) Loaded command ${command}.`);
		});
	}
	
	static run(command: Command): void {
		const commandFunction: Function | undefined = this.commands[command.name];

		const n = this.commands;
		//@ts-ignore
		console.log({n, commandFunction});

		if(!commandFunction) {
			command.channel.send("The command you're trying to use doesn't exist.");
			return;
		} else {
			commandFunction(command);
		}
	}
}
