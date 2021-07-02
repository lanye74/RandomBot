import {performance} from "perf_hooks";
import BitMath from "../BitMath.js";
import type {Command} from "../types.js";



export default function debug(command: Command): void {
	const {args, message} = command;

	const timeStart = performance.now();
	const powers = BitMath.power2Sum(parseInt(args[0])); 
	const timeEnd = performance.now();
	const timeTaken = timeEnd - timeStart;

	const calculatedResult = powers.reduce((acc, n) => acc + 2 ** n, 0)

	message.channel.send(`original - powers of two [${powers.join(", ")}] sum together to make ${calculatedResult}, time taken ${timeTaken.toFixed(2)}ms`);
}