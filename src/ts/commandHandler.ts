import type {Command} from "./types.js";

import ping from "./commands/ping.js";
import kick from "./commands/kick.js";
import debug from "./commands/debug.js";
import suspendRole from "./commands/suspendRole.js";
import releaseRole from "./commands/releaseRole.js";
import spamPing from "./commands/spamPing.js";
import help from "./commands/help.js";

// import bot from "./Bot.js";



export default class CommandHandler {
	static commands: {[name: string]: Function} = { // make this use dynamic imports via reading the command folder
		ping,
		kick,
		debug,
		suspendRole,
		releaseRole,
		spamPing,
		help
	};
	
	static run(command: Command): void {
		try {
			this.commands[command.name](command);
		} catch {
			command.channel.send("The command you're trying to use doesn't exist.");
			// bot.error(
			// 	`User ${command.sender.tag} tried to use non-existent command "${command.name}". Link: `,
			// 	"Underline",
			// 	`https://canary.discord.com/channels/${command.guild!.id}/${command.channel.id}/${command.message.id}`
			// );
		}
	}
}
