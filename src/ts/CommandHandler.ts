import Logger from "./Logger.js";
import FSManager from "./FSManager.js";

import type {Message, TextChannel} from "discord.js";
import type {MessageCommand} from "./types/types.js";
import type RBCommand from "./RBCommand.js";



export default class CommandHandler {
	static commands: {[name: string]: RBCommand} = {};
	static aliases: {[name: string]: RBCommand} = {};
	static allCommands: {[name: string]: RBCommand} = {};

	static async loadCommands(from: string) {
		const commandLoaders: Function[] = [];


		if(!(await FSManager.call({method: "stat", path: from}))) { // not internal, called from user perspective
			throw new Error("Commands directory does not exist.");
		}


		const absoluteDir = FSManager.normalizePath(from);


		const commands: string[] = await FSManager.call({method: "readdir", path: absoluteDir})
		.then((files: string[]) => files.filter((file: string) => file.split(".")[1] === "js")); // only js files


		Logger.info("Loading commands...");


		commands.forEach(command => {
			commandLoaders.push(() => this.loadCommand(command, absoluteDir));
		});


		const loadedCommands = await Promise.all(commandLoaders.map(loader => loader()));

		this.register(loadedCommands);
		Logger.info("Commands loaded successfully.");
	}

	static loadCommand(command: string, rootDir: string) {
		return new Promise(resolve => {
			import(`file:///${rootDir}${command}`)
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

	static setCommand(input: any) {
		const command = <RBCommand>input.default;
		const lowerName = command.name.toLowerCase();

		this.commands[lowerName] = command;

		command.aliases.forEach((alias: string) => {
			this.aliases[alias.toLowerCase()] = this.commands[lowerName];
		});
	}

	static handle(message: Message, prefix: string) {
		const text = message.content;

		const inputString = text.split(prefix)[1];
		const commandSegments = inputString.trim().split(" ");


		const command: MessageCommand = {
			attachments: message.attachments.toJSON(),
			args: commandSegments.slice(1), // all but first (command type)
			channel: <TextChannel>message.channel,
			client: message.client,
			guild: message.guild!,
			mentions: Array.from(message.mentions.users.values()),
			message,
			name: commandSegments[0],
			prefix,
			sender: message.author
		};


		const commandFunction = this.allCommands[command.name.toLowerCase()];
		if(!commandFunction) {
			Logger.error(`Command not found: ${command.name}`);
			return;
		}

		commandFunction.run(command);
	}
}
