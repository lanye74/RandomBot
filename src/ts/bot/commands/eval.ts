import RBCommand from "../RBCommand.js";

import bot_class from "../Bot.js"; // for use in the eval command if needed
import command_handler_class from "../CommandHandler.js";

import type {MessageCommand} from "../types.js";



export default class evaluate extends RBCommand {
	static description = "Evaluates a command locally. Extremely dangerous.";
	static friendlyName = "Evaluate";
	static usage = "evaluate <command>";

	static run(command: MessageCommand) {
		if(command.sender.id !== "393898580177321985") {
			command.channel.send("You don't have permission to use this.");
			return;
		}

		const Bot = bot_class;
		const CommandHandler = command_handler_class;

		try {
			eval(command.args.join(" "));
		} catch(error: any) {
			command.channel.send(`${error.name}: ${error.message}`);
		}
	}
}
