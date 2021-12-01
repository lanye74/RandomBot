// instantiated option:



// export default interface RBCommand {
// 	static readonly name?: string;
// }

// export default abstract class RBCommand {
// 	abstract aliases: string[];
// 	abstract description: string;
// 	abstract friendlyName: string;
// 	abstract usage: string;

// 	abstract run(...args: any): any;
// }





// static option:



declare class RBCommandInterface {
	static readonly aliases: string[];
	static readonly description: string;
	static readonly friendlyName: string;
	static readonly usage: string;
	static readonly name: string; // .name is a property of classes and just has to be restated because weird ts

	static run(...args: any): any;
}



type RBCommand = typeof RBCommandInterface;

export default RBCommand;
