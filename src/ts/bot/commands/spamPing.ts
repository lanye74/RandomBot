import RBCommand from "../RBCommand.js";
import sleep from "../util/sleep.js";

import type {MessageCommand} from "../types.js";
import type {TextChannel} from "discord.js";



export default class spamPing extends RBCommand {
	static description = "Spam ping a user.";
	static friendlyName = "Spam Ping";
	static usage = "spamPing [mention user] <how many times> <optional text>";

	private static queue: [string, number, TextChannel][] = [];
	private static pinging: boolean = false;

	static async run(command: MessageCommand): Promise<void> {
		const {args, channel, mentions} = command;

		const who = mentions[0];
		const howMany = parseInt(args[1]);
		const text = (args[2]) ? args.slice(2).join(" ") : "";


		if(!who) {
			channel.send("You didn't specify a person to ping.");
			return;
		}

		if(isNaN(howMany)) {
			channel.send("You didn't specify a valid number of times to ping.");
			return;
		}

		if(howMany < 1 || howMany > 100) {
			channel.send("<amount> should be a value between 1 and 100.");
			return;
		}


		this.queue.push([`<@${who.id}> ${text}`, howMany, channel]);

		if(this.queue.length === 1 && !this.pinging) {
			this.spamPing();
		}
	}

	private static async spamPing(): Promise<void> {
		this.pinging = true;

		const [spamString, howMany, channel] = this.queue.shift()!;

		for(let i = 0; i < howMany; i++) {
			channel.send(spamString);
			await sleep(1500);
		}

		this.pinging = false;


		if(this.queue.length === 0) return;

		this.spamPing();
	}
}
