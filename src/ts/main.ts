import {RandomBot} from "./RandomBot";



const bot = new RandomBot();
bot.init("./RandomBotConfig.json");

bot.start();


// bot.setListener("messageCreated", (message) => bot.commandHandler.process(message));
