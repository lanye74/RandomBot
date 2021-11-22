import {getObjectReference} from "../util/reference.js";
import FSManager from "../FSManager.js";
import {MessageEmbed} from "discord.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types/types.js";



export default class info extends RBCommand {
	static aliases = [];
	static description = "Gets general information about the bot.";
	static friendlyName = "Info";
	static usage = "info";

	static infoEmbed = new MessageEmbed();
	static embedGenerated = false;

	static async run(command: MessageCommand): Promise<void> {
		const {channel} = command;


		if(!this.embedGenerated) {
			await this.generateEmbed();
			this.embedGenerated = true;
		}


		// channel.send(this.infoEmbed);
	}

	static async generateEmbed(): Promise<void> {
		const embed = getObjectReference(this.infoEmbed);

		const botVersion = await FSManager.call("readFile", "./package.json", [{encoding: "utf8"}])
		.then(json => JSON.parse(json).version);

		// possibly store bot data in static object too
	}
}
