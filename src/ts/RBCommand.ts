import Bot from "./Bot.js";



export default class RBCommand {
	description: string = "Placeholder description";
	friendlyName: string = "Base Command";

	protected static prefix = Bot.config.prefix;

	run(...args: any): any {
		console.log("This is a command!");
	}
}
