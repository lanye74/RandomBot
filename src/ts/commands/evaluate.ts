import RBCommand from "../RBCommand.js";

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

		const CommandHandler = command_handler_class;
		const FSManager = fsmanager_class;
		const {client} = command;


		try {
			eval(command.args.join(" "));
		} catch(error: any) {
			command.channel.send(`${error.name}: ${error.message}`);
		}
	}
}
