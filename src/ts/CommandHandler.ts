import Logger from "./Logger.js";
import FSManager from "./FSManager.js";

import type {Message, TextChannel} from "discord.js";
import type {MessageCommand} from "./types/types.js";
import type RBCommand from "./RBCommand.js";




export default class CommandHandler {
	static commands: {[name: string]: RBCommand} = {};
	static aliases: {[name: string]: RBCommand} = {};
	static allCommands: {[name: string]: RBCommand} = {};

	static async loadCommands(from: string): Promise<any> {
		const commandLoaders: Function[] = [];


		if(!(await FSManager.call({method: "stat", path: from, internal: true}))) {
			throw new Error("Commands directory does not exist.");
		}


		const commands: string[] = await FSManager.call({method: "readdir", path: from, internal: true})
		.then((files: string[]) => files.filter((file: string) => file.split(".")[1] === "js")); // only js files, not .d.ts


		Logger.info("Loading commands...");


		commands.forEach(command => {
			commandLoaders.push(() => this.loadCommand(command));
		});


		const loadedCommands = await Promise.all(commandLoaders.map(loader => loader()));

		this.register(loadedCommands);
		Logger.info("Commands loaded successfully.");
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

	static handle(message: Message, prefix: string): void {
		const text = message.content;


		const inputString = text.split(prefix)[1];
		const commandSegments = inputString.trim().split(" ");


		const command: MessageCommand = {
			args: commandSegments.slice(1), // all but first (command type)
			channel: <TextChannel>message.channel,
			client: message.client,
			guild: message.guild!,
			mentions: Array.from(message.mentions.users.values()),
			message: message,
			name: commandSegments[0],
			prefix,
			sender: message.author
		};


		const commandFunction = this.allCommands[command.name.toLowerCase()];

		commandFunction?.run(command);
	}
}
