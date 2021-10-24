import RBCommand from "../RBCommand.js";
import sleep from "../util/sleep.js";

import type {MessageCommand} from "../types.js";
import type {TextChannel} from "discord.js";



export default class spamPing extends RBCommand {
	static description = `Spam ping a user.\n\nUsage:\`${this.prefix}spamPing [mention user] <how many times> <optional text>\``;
	static friendlyName = "Spam Ping";

	private static queue: [string, number][] = [];

	static async run(command: MessageCommand): Promise<void> {
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
			return;
		}


		if(this.queue.length === 0) {
			this.spamPing(`<@${who.id}> ${text}`, howMany, channel);
		} else {
			this.queue.push([`<@${who.id}> ${text}`, howMany]);
		}
	}

	private static async spamPing(spamString: string, howMany: number, channel: TextChannel): Promise<void> {
		for(let i = 0; i < howMany; i++) {
			channel.send(spamString);

			await sleep(1500);
		}


		if(this.queue.length === 0) {
			return;
		}

		const toSpam = this.queue.shift()!;

		this.spamPing(toSpam[0], toSpam[1], channel);
	}
}
