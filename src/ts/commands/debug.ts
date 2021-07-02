import { performance } from "perf_hooks";
import BitMath from "../BitMath.js";
import type {Command} from "../types.js";



export default async function debug(command: Command): Promise<void> {
	const {args, message} = command;

	const timeStart = performance.now();
	const powers = BitMath.power2Sum(parseInt(args[0])); 
	const timeEnd = performance.now();
	const timeTaken = timeEnd - timeStart;

	const calculatedResult = powers.reduce((acc, n) => acc + 2 ** n, 0)

	message.channel.send(`original - powers of two [${powers.join(", ")}] sum together to make ${calculatedResult}, time taken ${timeTaken.toFixed(2)}ms`);

	const timeStart2 = performance.now();
	const powers2 = BitMath.power2SumNew(parseInt(args[0])); 
	const timeEnd2 = performance.now();
	const timeTaken2 = timeEnd2 - timeStart2;
	const calculatedResult2 = powers2.reduce((acc, n) => acc + 2 ** n, 0);

	message.channel.send(`new - powers of two [${powers2.join(", ")}] sum together to make ${calculatedResult2}, time taken ${timeTaken2.toFixed(2)}ms`);
}