import {RandomBot} from "./RandomBot.js";



const bot = new RandomBot();



await bot.init({
	intentsPresets: ["PRESET_GUILD_BASIC"],
	commandsLocation: "./commands/",
	configLocation: "./config.json"
});


bot.start();


// bot.addListener("messageCreate", (message) => bot.commandHandler.process(message));
