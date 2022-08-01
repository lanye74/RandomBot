import f from "./util/console.js";



export default class Logger {
	static log(...args: any[]) {
		console.log(f("Bold + Green", "[Bot] ", "Reset + White", ...args));
	}

	static info(...args: any[]) {
		console.log(f("Bold + Blue", "[Bot] ", "Reset + White", ...args));
	}

	static error(...args: any[]) {
		console.log(f("Bold + Red", "[Bot] ", "Reset + White", ...args));
	}
}
