import Bot from "./Bot";



export default class RBCommand {
	static description: string = "Placeholder description";
	static friendlyName: string = "Base Command";
	protected static prefix = Bot.config.prefix;

	static run(...args: any): any {
		console.log("This is a command!");
	}
}
