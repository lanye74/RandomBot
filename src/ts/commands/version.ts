import RBCommand from "../RBCommand.js";
import * as fs from "fs-extra";
//@ts-ignore
const {readFileSync} = fs.default;

import type {MessageCommand} from "../types";



export default class version extends RBCommand {
	static botVersion = JSON.parse(readFileSync("./package.json")).version; // probably should be moved to the Bot class
	static description = `Returns the current bot version.\n\nUsage: \`${this.prefix}version\``;
	static friendlyName = "Version";

	static run(command: MessageCommand) {
		command.channel.send(`Current bot version: ${this.botVersion}`);
	}
}
