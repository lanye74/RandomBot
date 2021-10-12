import sleep from "../util/sleep.js";

import type {Command} from "../types.js";



export default async function spamPing(command: Command): Promise<void> {
	const {args, channel, mentions} = command;

	const who = mentions[0];
	const howMany = parseInt(args[1]);
	const text = (args[2]) ? args.slice(2).join(" ") : "";

	if(isNaN(howMany)) {
		channel.send("You didn't specify a valid number of times to ping.");
		return;
	}

	if(howMany < 1 || howMany > 100) {
		channel.send("<amount> should be a value between 1 and 100.");
	}

	// rate limit smh

	for(let i = 0; i < howMany; i++) {
		channel.send(`<@${who.id}> ${text}`);
		
		await sleep(500);
	}
}
