import {Client} from "discord.js";
import FSManager from "./FSManager.js";



type RandomBotConfig = {
	token: string;

};



export class RandomBot {
	config!: RandomBotConfig;
	client: Client;

	constructor() {
		// add preset configs for intents
		// new RandomBot({intentPresets: ["guild", "dms"]}) || {intents: ["GUILDS", "GUILD_MEMBERS", ...]}
		this.client = new Client({intents: ["GUILDS", "GUILD_BANS", "GUILD_MEMBERS", "GUILD_MESSAGES"]});
	}

	async init(configLocation: string): Promise<void | Error> {
		if(!(await FSManager.call("exists", configLocation))) {
			return new Error("Invalid config file location.");
		}

		this.config = await FSManager.call("read", configLocation, [{encoding: "utf8"}]).then(data => JSON.parse(data));
	}

	start() {} // login
}
