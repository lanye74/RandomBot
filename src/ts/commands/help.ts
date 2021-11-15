import Bot from "../Bot.js";
import CommandHandler from "../CommandHandler.js";
import {getObjectReference, getPropertyReference} from "../util/reference.js";
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
	static embedsGenerated = false;

	static run(command: MessageCommand): void {
		const {args, channel} = command;


		if(!this.embedsGenerated) {
			this.generateEmbeds();
			this.embedsGenerated = true;
		}


		if(!args[0]) { // general help command
			channel.send({embeds: [this.genericHelpCommand]});
		} else {
			const commandEmbed = this.specificHelpEmbeds[args[0].toLowerCase()];

			if(!commandEmbed) {
				channel.send("The command you're looking for doesn't exist.");
				return;
			}

			channel.send({embeds: [commandEmbed]});
		}
	}

	private static generateEmbeds(): void {
		// arg-less help command
		const masterEmbed = getObjectReference(this.genericHelpCommand);


		masterEmbed.setColor("#7b42f5");
		masterEmbed.setTitle("Commands for Lanye's Utilities");

		let masterEmbedDescription = "";

		Object.values(CommandHandler.commands).forEach((command: RBCommand) => {
			masterEmbedDescription += `\`${command.name}\` | ${command.description}\n`;


			// --help [command name]
			this.specificHelpEmbeds[command.name] = new MessageEmbed();
			const commandEmbed = getPropertyReference(this.specificHelpEmbeds, command.name);

			commandEmbed.setColor("#7b42f5");
			commandEmbed.setTitle(`${command.friendlyName} Command`);

			commandEmbed.addFields(
				{name: "Description", value: command.description},
				{name: "Usage", value: `\`${Bot.config.prefix}${command.usage}\``},
				{name: "Aliases", value: command.aliases.join(", ") || "None"}
			);


			command.aliases.forEach(alias => {
				this.specificHelpEmbeds[alias] = commandEmbed;
			});
		});


		masterEmbed.setDescription(masterEmbedDescription.trim());
		masterEmbed.setFooter(`Use "${Bot.config.prefix}help <command>" to see information on a specific command`);
	}
}
