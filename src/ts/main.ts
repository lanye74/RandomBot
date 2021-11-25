import {RandomBot} from "./RandomBot.js";



const bot = new RandomBot();

await bot.init({
	intentsPresets: ["PRESET_GUILD_BASIC"],
	configLocation: "./config.json"
});

await bot.createCommandListener("./src/js/commands/");


await bot.start();
