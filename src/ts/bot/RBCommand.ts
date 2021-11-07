export default class RBCommand {
	aliases: string[] = [];
	description: string = "Placeholder description";
	friendlyName: string = "Placeholder name";
	name: string = "RBCommand";
	usage: string = "Placeholder usage";

	run(...args: any): any {
		console.log("This is a command!");
	}
}
