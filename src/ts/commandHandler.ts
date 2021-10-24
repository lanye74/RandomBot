import Bot from "./Bot.js";
import {URL} from "url";

import * as fs from "fs-extra";
//@ts-ignore
const {readdirSync} = fs.default;

import type {Command} from "./types.js";



export default class CommandHandler {
	static commands: {[name: string]: Function} = {};

	static loadCommands(): Promise<any> {
		const commandLoaders: Function[] = [];
		

		const target = (new URL("./commands/", import.meta.url).pathname).slice(1); // slice removes the prefixed /
		
		const commands: string[] = readdirSync(target)
		.filter((file: string) => file.split(".")[1] === "js"); // only the ones that are js files

		
		Bot.info("Loading commands...");


		commands.forEach(command => {
			commandLoaders.push(() => this.loadCommand(command));
		});



		return Promise.all(commandLoaders.map(loader => loader()));
	}

	static register(input: any | any[]) { // type checking is ridiculous because the type of a module is typeof import(module)
		if(input instanceof Array) {
			input.forEach(command => {
				// Bot.info(`(${number}/${commands.length}) Loaded ${command.default.name}.`);
				this.commands[command.default.name] = command.default;
			});
		} else {
			this.commands[input.default.name] = input.default;
		}
	}
	
	static loadCommand(command: string): Promise<any> {
		return new Promise(resolve => {
			import(`./commands/${command}`)
			.then(module => resolve(module));
		});
	}
	
	static run(command: Command): void {
		const commandFunction: Function | undefined = this.commands[command.name];


		if(!commandFunction) {
			command.channel.send("The command you're trying to use doesn't exist.");
			return;
		} else {
			commandFunction(command);
		}
	}
}
