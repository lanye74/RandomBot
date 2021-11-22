import RBCommand from "../RBCommand.js";

import bot_class from "../Bot.js"; // for use in the eval command if needed
import command_handler_class from "../CommandHandler.js";
import fsmanager_class from "../FSManager.js";

import type {MessageCommand} from "../types/types.js";



export default class evaluate extends RBCommand {
	static aliases = ["eval"];
	static description = "Evaluates a command locally. Extremely dangerous.";
	static friendlyName = "Evaluate";
	static usage = "evaluate <command>";

	static run(command: MessageCommand): void {
		if(command.sender.id !== "393898580177321985") {
			command.channel.send("You don't have permission to use this.");
			return;
		}

		const Bot = bot_class;
		const CommandHandler = command_handler_class;
		const FSManager = fsmanager_class;


		if(command.args[0] === "ls" && command.args[1]) {
			try {
				command.args.shift();

				const result = eval(command.args.join(" "));

				if(!result || !result.length || result.length > 2000) {
					command.channel.send(`Message data ${result.length - 2000} characters too long. Sending in console instead.`);
					Bot.info(result);

					return;
				}

				command.channel.send(result);
			} catch(error: any) {
				command.channel.send(`${error.name}: ${error.message}`);
			}
		} else {
			try {
				eval(command.args.join(" "));
			} catch(error: any) {
				command.channel.send(`${error.name}: ${error.message}`);
			}
		}
	}
}
