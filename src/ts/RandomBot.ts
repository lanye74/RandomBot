import {Client as DiscordClient, ClientEvents} from "discord.js";
import Bot from "./Bot.js";
import FSManager from "./FSManager.js";
import {RandomBotIntentPresets} from "./types/consts.js";

import type {RandomBotConfig, RandomBotInitOptions} from "./types/types.js";



export class RandomBot {
	client: DiscordClient;
	config!: RandomBotConfig;

	constructor(options: RandomBotInitOptions) {
		// add preset configs for intents

		if(typeof options.intents === "string") {
			if(!RandomBotIntentPresets[options.intents]) {
				throw new Error("Invalid intent preset.");
			}

			this.client = new DiscordClient({intents: RandomBotIntentPresets[options.intents]});
		} else if(typeof options.intents === "object" || typeof options.intents === "number") {
			this.client = new DiscordClient({intents: options.intents});
		} else {
			throw new Error("Bot intents is not a preset, intent array, or bitfield.");
		}
	}

	async init(configLocation: string): Promise<void | Error> {
		if(!(await FSManager.call("exists", configLocation))) {
			return new Error("Invalid config file location.");
		}

		this.config = await FSManager.call("read", configLocation, [{encoding: "utf8"}]).then(data => JSON.parse(data));
	}

	start(): void {
		this.client.login(this.config.token);

		this.client.on("ready", () => {
			Bot.log("", "Bold", "Ready.");
		});
	}

	setListener(what: keyof ClientEvents, callback: Function): void {
		this.client.on(what, <any>callback);
	}
}
