import FSManager from "../FSManager.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types";



const botVersion = await FSManager.call("readFile", "./package.json", [{encoding: "utf8"}]);

export default class version extends RBCommand {
	static botVersion = JSON.parse(botVersion).version; // probably should be moved to the Bot class
	static description = "Returns the current bot version.";
	static friendlyName = "Version";
	static usage = "version";

	static run(command: MessageCommand) {
		command.channel.send(`Current bot version: ${this.botVersion}`);
	}
}
