import type {Command} from "./types.js";

import ping from "./commands/ping.js";
import kick from "./commands/kick.js";
import debug from "./commands/debug.js";
import suspendRole from "./commands/suspendRole.js";
import releaseRole from "./commands/releaseRole.js";

import bot from "./Bot.js";



export default class CommandHandler {
	static commands: {[name: string]: Function} = { // enum...???
		ping,
		kick,
		debug,
		suspendRole,
		releaseRole
	};
	
	static run(command: Command): void {
		try {
			this.commands[command.name](command);
		} catch {
			command.message.channel.send("The command you're trying to use doesn't exist.");
			bot.error(
				`User ${command.sender.tag} tried to use non-existent command "${command.name}". Link: `,
				"Underline",
				`https://canary.discord.com/channels/${command.guild!.id}/${command.message.channel.id}/${command.message.id}`
			);
		}
	}
}
