import Bot from "../Bot.js";
import CommandHandler from "../CommandHandler.js";
import {MessageEmbed} from "discord.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";



export default class help extends RBCommand {
	static aliases = [];
	static description = "Lists all commands, or shows information about a specific command.";
	static friendlyName = "Help";
	static usage = "help <optional command name>";

	static genericHelpCommand = new MessageEmbed();
	static specificHelpEmbeds: {[name: string]: MessageEmbed} = {};
	static embedInitted = false;

	static run(command: MessageCommand): void {
		const {args, channel} = command;


		if(!this.embedInitted) {
			this.initEmbeds();
			this.embedInitted = true;
		}


		if(!args[0]) { // general help command
			channel.send(this.genericHelpCommand);
		} else {
			const command = CommandHandler.commands[args[0]];

			if(!command) {
				channel.send("The command you're looking for doesn't exist.");
				return;
			}

			channel.send(this.specificHelpEmbeds[args[0]]);
		}
	}

	static initEmbeds(): void {
		// arg-less help command

		this.genericHelpCommand.setColor("#7b42f5");
		this.genericHelpCommand.setTitle("Commands for Lanye's Utilities");

		let masterEmbedDescription = "";

		Object.values(CommandHandler.commands).forEach((command: RBCommand) => {
			masterEmbedDescription += `\`${command.name}\` | ${command.description}\n`;


			this.specificHelpEmbeds[command.name] = new MessageEmbed();
			this.specificHelpEmbeds[command.name].setColor("#7b42f5");
			this.specificHelpEmbeds[command.name].setTitle(command.friendlyName);
			this.specificHelpEmbeds[command.name].setDescription(`${command.description}\n\nUsage: \`${Bot.config.prefix}${command.usage}\``);
		});


		this.genericHelpCommand.setDescription(masterEmbedDescription.trim());
		this.genericHelpCommand.setFooter(`Use "${Bot.config.prefix}help <command>" to see information on a specific command`);
	}
}
