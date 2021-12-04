# RandomBot

A generic discord.js bot framework for myself. please do not use this it's complete ass



todo:
- fix rbcommand implementantion (`...} as RBCommand`)?
- server specific prefixes
- add default "timed" method to RBCommand, i.e. an implementation of what kill in lanyes-utilities has
- make some commands defaults, e.g. help command, ping

- electron

- generalize embed colors to a property on `RandomBot` (embed util?)
- and `bot.name`



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
