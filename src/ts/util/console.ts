enum ConsoleColors {
	RESET = "\x1b[0m",
	BOLD = "\x1b[1m",
	FAINT = "\x1b[2m",
	UNDERLINE = "\x1b[4m",
	UNDERSCORE = "\x1b[4m",
	BLINK = "\x1b[5m",
	INVERSE = "\x1b[7m",
	HIDDEN = "\x1b[8m",

	BLACK = "\x1b[30m",
	RED = "\x1b[31m",
	GREEN = "\x1b[32m",
	YELLOW = "\x1b[33m",
	BLUE = "\x1b[34m",
	MAGENTA = "\x1b[35m",
	CYAN = "\x1b[36m",
	WHITE = "\x1b[37m",

	BGBLACK = "\x1b[40m",
	BG_BLACK = "\x1b[40m",
	BGRED = "\x1b[41m",
	BG_RED = "\x1b[41m",
	BGGREEN = "\x1b[42m",
	BG_GREEN = "\x1b[42m",
	BGYELLOW = "\x1b[43m",
	BG_YELLOW = "\x1b[43m",
	BGBLUE = "\x1b[44m",
	BG_BLUE = "\x1b[44m",
	BGMAGENTA = "\x1b[45m",
	BG_MAGENTA = "\x1b[45m",
	BGCYAN = "\x1b[46m",
	BG_CYAN = "\x1b[46m",
	BGWHITE = "\x1b[47m",
	BG_WHITE = "\x1b[47m"
};

type ConsoleColor = keyof typeof ConsoleColors;



function GetCC(key: string): string {
	return ConsoleColors[<ConsoleColor>key.toUpperCase()];
}



export default function format(...args: any[]): string {
	const argumentPairs: string[][] = [];
	let stringBuilder = "";

	args.reduce((result, _value, index, array) => { // split the args into format/text pairs
		if(index % 2 === 0) {
			argumentPairs.push(array.slice(index, index + 2));
		}

		return result;
	}, []);



	for(const currentPair of argumentPairs) {
		const [formatString, text] = currentPair;
		const formats = formatString.split("+").map(format => format.trim());


		for(const format of formats) {
			stringBuilder += GetCC(format); // convert to appropriate console color
		}

		stringBuilder += text;
	}

	return stringBuilder + GetCC("Reset");
}
