# RandomBot

A generic discord.js bot framework for myself. please do not use this it's complete ass



```ts
import {RandomBot} from "random-bot";



const bot = new RandomBot();

await bot.init({
	intentsPresets: ["PRESET_GUILD_BASIC"],
	configLocation: "./config.json"
});

await bot.createCommandListener("./src/js/commands/");


await bot.start();
```
