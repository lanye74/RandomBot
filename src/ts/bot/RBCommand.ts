export default class RBCommand {
	description: string = "Placeholder description";
	friendlyName: string = "Placeholder name";
	usage: string = "Placeholder usage";

	run(...args: any): any {
		console.log("This is a command!");
	}
}
