import Bot from "./Bot.js";



export default class RBCommand {
	description: string = "Placeholder description";
	friendlyName: string = "Placeholder name";
	usage: string = "Placeholder usage";

	protected static prefix = Bot.config.prefix;

	run(...args: any): any {
		console.log("This is a command!");
	}
}
