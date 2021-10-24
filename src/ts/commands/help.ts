import Bot from "../Bot.js";
import CommandHandler from "../CommandHandler.js";
import {MessageEmbed} from "discord.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";



export default class help extends RBCommand {
	static description = "Lists all commands, or shows information about a specific command.";
	static friendlyName = "Help";
	static usage = "help <optional command name>";

	static run(command: MessageCommand): void {
		const {args, channel} = command;

		const embed = new MessageEmbed();
		embed.setColor("#7b42f5");

		if(!args[1]) { // general help command
			embed.setTitle("Commands for Lanye's Utilities");

			let text = "";

			Object.values(CommandHandler.commands).forEach((command: RBCommand) => {
				// @ts-ignore -- yes, command.name does exist
				text += `${command.name} | ${command.description}\n`;
			});

			embed.setDescription(text.trim);

			embed.setFooter(`Use \`${Bot.config.prefix}help <command>\` to see information on a specific command`);
		} else {
			const command = CommandHandler.commands[args[1]];

			if(!command) {
				channel.send("The command you're looking for doesn't exist.");
				return;
			}

			embed.setTitle(command.friendlyName);

			embed.setDescription(`${command.description}\n\nUsage: \`${Bot.config.prefix}${command.usage}\``);
		}

		channel.send(embed);
	}
}
