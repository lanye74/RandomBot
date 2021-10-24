export default class RBCommand {
	static description: string = "Placeholder description";
	static friendlyName: string = "Base Command";

	static run(...args: any): any {
		console.log("This is a command!");
	}
}
