enum ConsoleColors {
	Reset = "\x1b[0m",
	Bold = "\x1b[1m",
	Faint = "\x1b[2m",
	Underscore = "\x1b[4m",
	Blink = "\x1b[5m",
	Reverse = "\x1b[7m",
	Hidden = "\x1b[8m",

	Black = "\x1b[30m",
	Red = "\x1b[31m",
	Green = "\x1b[32m",
	Yellow = "\x1b[33m",
	Blue = "\x1b[34m",
	Magenta = "\x1b[35m",
	Cyan = "\x1b[36m",
	White = "\x1b[37m",

	BgBlack = "\x1b[40m",
	BgRed = "\x1b[41m",
	BgGreen = "\x1b[42m",
	BgYellow = "\x1b[43m",
	BgBlue = "\x1b[44m",
	BgMagenta = "\x1b[45m",
	BgCyan = "\x1b[46m",
	BgWhite = "\x1b[47m"
};

type ConsoleColor = keyof typeof ConsoleColors;



// export default function f(color: string, text: string): string {
	// return `${ConsoleColors[<ConsoleColor>color]}${text}${ConsoleColors.Reset}`;
// }



export default function f(...args: string[]): string {
	const inputtedFormats = args.filter((_val, index) => index % 2 === 0);
	const inputtedStrings = args.filter((_val, index) => index % 2 === 1);
	
	let stringBuilder = "";


	for(let i = 0; i < inputtedFormats.length; i++) {
		const [currentFormat, currentText] = [inputtedFormats[i], inputtedStrings[i]];
		
		let inbetweenFormats: string[] = [];
		// this is so ugly

		if(currentFormat.includes("+")) {
			for(const inbetween of currentFormat.split("+")) {
				inbetweenFormats.push(inbetween.trim()); // I hate this with every fiber in my being
			}
		}

		if(inbetweenFormats.length) { // it does contain items
			for(const format of inbetweenFormats) {
				stringBuilder += ConsoleColors[<ConsoleColor>format];
			}
		} else {
			stringBuilder += ConsoleColors[<ConsoleColor>currentFormat]; // this is awful, how to simplify?
		}

		// I hate this code, please rename everything soon

		stringBuilder += currentText;
	}


	return (stringBuilder + ConsoleColors.Reset);
}

// this is the second worst function I've ever had the displeasure of writing