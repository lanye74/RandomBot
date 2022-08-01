import {Client as DiscordClient, ClientEvents, GatewayIntentsString, IntentsBitField} from "discord.js";
import Logger from "./Logger.js";
import CommandHandler from "./CommandHandler.js";
import FSManager from "./FSManager.js";
import {RandomBotIntentPresets} from "./types/consts.js";

import type {RandomBotConfig, RandomBotInitOptions, RandomBotIntentPreset} from "./types/types.js";



export default class RandomBot {
	client!: DiscordClient;
	config!: RandomBotConfig;
	intents!: Set<GatewayIntentsString> | IntentsBitField;

	async init({fileManagerBasePath, configLocation, intents, intentsBitField, intentsPresets}: RandomBotInitOptions) { // why is the with keyword deprecated :(
		FSManager.setExternalBasePath(fileManagerBasePath);

		await this.initConfig(configLocation);
		this.configureIntents(intents, intentsBitField, intentsPresets);
	}

	configureIntents(manualIntents?: GatewayIntentsString[], bitfield?: number, intentPresets?: RandomBotIntentPreset[]): void | Error {
		if(bitfield) {
			this.intents = new IntentsBitField(bitfield);
			return;
		}


		this.intents = new Set<GatewayIntentsString>();


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


		if(this.intents instanceof IntentsBitField) {
			this.client = new DiscordClient({intents: this.intents});
		} else {
			this.client = new DiscordClient({intents: Array.from(this.intents)})
		}
	}

	async initConfig(configLocation: string): Promise<void | Error> {
		if(!(await FSManager.call({method: "stat", path: configLocation}))) {
			throw new Error("Invalid config file location.");
		}

		// no internal, read from caller location
		// :)
		this.config = await FSManager.call({method: "readJSON", path: configLocation, data: [{encoding: "utf8"}]});
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
		await CommandHandler.loadCommands(where);

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
