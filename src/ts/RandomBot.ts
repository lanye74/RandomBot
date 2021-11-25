import {Client as DiscordClient, ClientEvents, IntentsString, Intents} from "discord.js";
import Logger from "./Logger.js";
import CommandHandler from "./CommandHandler.js";
import FSManager from "./FSManager.js";
import {RandomBotIntentPresets} from "./types/consts.js";

import type {RandomBotConfig, RandomBotInitOptions, RandomBotIntentPreset} from "./types/types.js";



export default class RandomBot {
	client!: DiscordClient;
	config!: RandomBotConfig;
	intents!: Set<IntentsString> | Intents;

	async init(options: RandomBotInitOptions) {
		await this.initConfig(options.configLocation);
		this.configureIntents(options.intents, options.intentsBitField, options.intentsPresets);
	}

	configureIntents(manualIntents?: IntentsString[], bitfield?: number, intentPresets?: RandomBotIntentPreset[]): void | Error {
		if(bitfield) {
			this.intents = new Intents(bitfield);
			return;
		}


		this.intents = new Set<IntentsString>();


		if(manualIntents) {
			for(const intent of manualIntents) {
				this.intents.add(intent);
			}
		}

		if(intentPresets) { // ew code
			for(const preset of intentPresets) {
				if(!RandomBotIntentPresets[preset]) {
					throw new Error("Invalid intent preset.");
				}

				for(const intent of RandomBotIntentPresets[preset]) {
					this.intents.add(intent);
				}
			}
		}


		if(this.intents.size === 0) {
			throw new Error("No intents were provided.");
		}


		if(this.intents instanceof Intents) {
			this.client = new DiscordClient({intents: this.intents});
		} else {
			this.client = new DiscordClient({intents: Array.from(this.intents)})
		}
	}

	async initConfig(configLocation: string): Promise<void | Error> {
		if(!(await FSManager.call("stat", configLocation))) {
			throw new Error("Invalid config file location.");
		}

		this.config = await FSManager.call("readJSON", configLocation, [{encoding: "utf8"}]);
	}

	async start(): Promise<void> {
		this.client.on("ready", () => {
			Logger.log("", "Bold", "Ready.");
		});


		this.client.login(this.config.token);
	}

	addListener<K extends keyof ClientEvents>(what: K, callback: ((...args: ClientEvents[K]) => any)): void {
		this.client.on(what, callback);
	}

	async createCommandListener(where: string): Promise<void> {
		CommandHandler.loadCommands(where);


		this.addListener("messageCreate", message => {
			if(!message.content.startsWith(this.config.prefix) ||
				!message.guild ||
				!message.guild!.available ||
				message.author.bot
			) {
				return;
			}

			CommandHandler.handle(message, this.config.prefix);
		});
	}
}
