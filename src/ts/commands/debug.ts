import BitMath from "../BitMath.js";
import type {Command} from "../types.js";



export default async function debug(command: Command): Promise<void> {
	const {args, message} = command;

	const powers = BitMath.power2Sum(parseInt(args[0])); 
	const calculatedResult = powers.reduce((acc, n) => acc + 2 ** n, 0)

	message.channel.send(`Powers of two [${powers.join(", ")}] sum together to make ${calculatedResult}`);
}