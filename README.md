# RandomBot

Eventually going to be some kind of generic do-it-all discord bot. For now I'm just messing around though



yes i know this is hot garbage
im trying ok

todo:
- electron
- refactor into singular bot class to interact with (`const bot = new RandomBot();`)
- aliases
	- also make command usage case-insensitive
- info command
- make help command not recompute embeds every time
	- utility embed class?
- finish viewRoleSaves
- server specific prefixes
- make help command embed title generic (`Bot.config.name`?)





if for whatever god awful reason you want to run this yourself you need a config.json file
```json
{
	"prefix": "--",

	"token": "YOUR-TOKEN-HERE"
}
```
