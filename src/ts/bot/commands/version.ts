import * as fs_bad from "fs-extra";
import RBCommand from "../RBCommand.js";
// @ts-ignore
const fs = fs_bad.default;

import type {MessageCommand} from "../types";



export default class version extends RBCommand {
	static botVersion = JSON.parse(fs.readFileSync("./package.json")).version; // probably should be moved to the Bot class
	static description = "Returns the current bot version.";
	static friendlyName = "Version";
	static usage = "version";

	static run(command: MessageCommand) {
		command.channel.send(`Current bot version: ${this.botVersion}`);
	}
}
