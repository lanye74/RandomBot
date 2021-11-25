import FSManager from "../FSManager.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types/types";



const {version: ver} = await FSManager.call("readJSON", "./package.json", [{encoding: "utf8"}]);

export default class version extends RBCommand {
	static botVersion = ver; // probably should be moved to the Bot class

	static aliases = ["ver"];
	static description = "Returns the current bot version.";
	static friendlyName = "Version";
	static usage = "version";

	static run(command: MessageCommand): void {
		command.channel.send(`Current bot version: ${this.botVersion}`);
	}
}
