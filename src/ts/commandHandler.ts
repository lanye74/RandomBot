import type {Command} from "./types.js";

import ping from "./commands/ping.js";
import kick from "./commands/kick.js";



export default class CommandHandler {
	static commands: {[name: string]: Function} = { // enum...???
		ping: ping,
		kick: kick
	}
	
	static run(command: Command) {
		this.commands[command.name](command);
	}
}