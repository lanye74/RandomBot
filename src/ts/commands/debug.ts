// import CommandHandler from "../CommandHandler.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types/types.js";



export default class debug extends RBCommand {
	static aliases = [];
	static description = "Lets Layne debug things.";
	static friendlyName = "Debug";
	static usage = "debug {...args}";

	static run(command: MessageCommand): void {
		// CommandHandler.run({
		// 	args: [""],
		// 	channel: command.channel,
		// 	client: command.client,
		// 	guild: command.guild,
		// 	message: command.message,
		// 	name: "",
		// 	sender: command.sender
		// });
	}
}
