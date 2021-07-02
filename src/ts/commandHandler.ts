import type {Command} from "./types.js";

import ping from "./commands/ping.js";
import kick from "./commands/kick.js";
import debug from "./commands/debug.js";



export default class CommandHandler {
	static commands: {[name: string]: Function} = { // enum...???
		ping,
		kick,
		debug
	};
	
	static run(command: Command) {
		try {
			this.commands[command.name](command);
		} catch {
			command.message.channel.send("The command you're trying to use doesn't exist");
		}
	}
}