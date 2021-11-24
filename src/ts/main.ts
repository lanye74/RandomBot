import {RandomBot} from "./RandomBot";



const bot = new RandomBot({
	intentsPresets: ["PRESET_GUILD_ALL"],
	configLocation: "./config.json"
});



bot.start();


// bot.setListener("messageCreated", (message) => bot.commandHandler.process(message));
