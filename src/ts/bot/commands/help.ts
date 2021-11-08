import Bot from "../Bot.js";
import CommandHandler from "../CommandHandler.js";
import {MessageEmbed} from "discord.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";
import { getPropertyReference } from "../util/reference.js";



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
			const commandEmbed = this.specificHelpEmbeds[args[0].toLowerCase()];

			if(!commandEmbed) {
				channel.send("The command you're looking for doesn't exist.");
				return;
			}

			channel.send(commandEmbed);
		}
	}

	static initEmbeds(): void {
		// arg-less help command

		this.genericHelpCommand.setColor("#7b42f5");
		this.genericHelpCommand.setTitle("Commands for Lanye's Utilities");

		let masterEmbedDescription = "";

		Object.values(CommandHandler.commands).forEach((command: RBCommand) => {
			masterEmbedDescription += `\`${command.name}\` | ${command.description}\n`;


			// --help [command name]
			this.specificHelpEmbeds[command.name] = new MessageEmbed();
			const commandEmbed = getPropertyReference<MessageEmbed>(this.specificHelpEmbeds, command.name);

			commandEmbed.setColor("#7b42f5");
			commandEmbed.setTitle(`${command.friendlyName} Command`);

			commandEmbed.addFields(
				{name: "Description", value: command.description},
				{name: "Usage", value: `\`${Bot.config.prefix}${command.usage}\``},
				{name: "Aliases", value: command.aliases.join(", ") || "None"}
			);


			if(command.aliases) {
				command.aliases.forEach(alias => {
					this.specificHelpEmbeds[alias] = commandEmbed;
				});
			}
		});


		this.genericHelpCommand.setDescription(masterEmbedDescription.trim());
		this.genericHelpCommand.setFooter(`Use "${Bot.config.prefix}help <command>" to see information on a specific command`);
	}
}
