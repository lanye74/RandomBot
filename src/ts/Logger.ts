import f from "./util/console.js";



export default class Logger {
	static log(...args: string[]): void {
		console.log(f("Bold + Green", "[Bot] ", "Reset + White", ...args));
	}

	static info(...args: string[]): void {
		console.log(f("Bold + Blue", "[Bot] ", "Reset + White", ...args));
	}

	static error(...args: string[]): void {
		console.log(f("Bold + Red", "[Bot] ", "Reset + White", ...args));
	}
}
