import {MessageEmbed} from "discord.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";

export default class viewRoleSaves extends RBCommand {
	static description = "Views roles saved via suspendRole.";
	static friendlyName = "View Role Saves";
	static usage = "viewRoleSaves <optional id>";

	static async run(command: MessageCommand) {
		const {args, channel} = command;

		const embed = new MessageEmbed();
		embed.setColor("#7b42f5");

		
	}
}
