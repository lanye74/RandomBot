import CommandHandler from "../CommandHandler.js";
import type {Command} from "../types.js";



export default function debug(command: Command): void {
	CommandHandler.run({
		args: ["894461661174431774"],
		client: command.client,
		guild: command.guild,
		message: command.message,
		name: "releaseRole",
		sender: command.sender
	});
}
