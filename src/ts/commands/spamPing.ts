import type {Command} from "../types.js";



export default function spamPing(command: Command): void {
	const {args, channel, mentions} = command;

	const who = mentions[0];
	const howMany = args[1];

	if(isNaN(parseInt(howMany))) {
		channel.send("You didn't specify a valid number of times to ping.");
	}

	// fix this later mmm
}
