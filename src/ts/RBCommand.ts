import {type MessageCommand} from "./types/types";



type RBCommand = {
	readonly aliases: string[];
	readonly description: string;
	readonly friendlyName: string;
	readonly usage: string;
	readonly name: string;

	run: ((command: MessageCommand) => void);
}

export default RBCommand;
