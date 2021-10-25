import Bot from "./Bot.js";
import * as fs_bad from "fs-extra";
import {URL} from "url";
// @ts-ignore
const fs = fs_bad.default;

import type {MessageCommand} from "./types.js";
import type RBCommand from "./RBCommand.js";



export default class CommandHandler {
	static commands: {[name: string]: RBCommand} = {};

	static loadCommands(): Promise<any> {
		const commandLoaders: Function[] = [];


		const target = (new URL("./commands/", import.meta.url).pathname).slice(1); // slice removes the prefixed /

		const commands: string[] = fs.readdirSync(target)
		.filter((file: string) => file.split(".")[1] === "js"); // only the ones that are js files


		Bot.info("Loading commands...");


		commands.forEach(command => {
			commandLoaders.push(() => this.loadCommand(command));
		});



		return Promise.all(commandLoaders.map(loader => loader()));
	}

	static loadCommand(command: string): Promise<any> {
		return new Promise(resolve => {
			import(`./commands/${command}`)
			.then(module => resolve(module));
		});
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

	static run(command: MessageCommand): void {
		const commandFunction: RBCommand | undefined = this.commands[command.name];


		if(!commandFunction) {
			command.channel.send("The command you're trying to use doesn't exist.");
			return;
		} else {
			commandFunction.run(command);
		}
	}
}
