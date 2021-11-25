import Bot from "./Bot.js";
import FSManager from "./FSManager.js";

import type {MessageCommand} from "./types/types.js";
import type RBCommand from "./RBCommand.js";



export default class CommandHandler {
	static commands: {[name: string]: RBCommand} = {};
	static aliases: {[name: string]: RBCommand} = {};
	static allCommands: {[name: string]: RBCommand} = {};

	static async loadCommands(from: string): Promise<any> {
		const commandLoaders: Function[] = [];


		if(!(await FSManager.call("stat", from))) {
			Bot.error("Invalid location to read files from.");
			return;
		}


		const commands: string[] = await FSManager.call("readdir", from)
		.then((files: string[]) => files.filter((file: string) => file.split(".")[1] === "js")); // only js files, not .d.ts


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
			input.map(command => this.setCommand(command));
		} else {
			this.setCommand(input);
		}

		Object.assign(this.allCommands, this.commands, this.aliases);
	}

	static setCommand(input: any): void {
		const command = <RBCommand>input.default;
		const lowerName = command.name.toLowerCase();

		this.commands[lowerName] = command;

		command.aliases.forEach((alias: string) => {
			this.aliases[alias.toLowerCase()] = this.commands[lowerName];
		});
	}

	static handle(command: MessageCommand): void {
		const commandFunction: RBCommand | undefined = this.allCommands[command.name.toLowerCase()];

		commandFunction?.run(command);
	}
}
