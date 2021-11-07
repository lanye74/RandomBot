# RandomBot

Eventually going to be some kind of generic do-it-all discord bot. For now I'm just messing around though



yes i know this is hot garbage
im trying ok

todo:
- electron
- refactor into singular bot class to interact with (`const bot = new RandomBot();`)
- ~~aliases~~
	- ~~also make command usage case-insensitive~~
		- this needs to apply to help command too
- info command
- add a deleteRoleSave command
- server specific prefixes
- add default "timed" method to RBCommand, i.e. an implementation of what kill has
- make help command embed title generic (`Bot.config.name`?)
- make RBCommand an interface so that having the class there makes logical sense





if for whatever god awful reason you want to run this yourself you need a config.json file
```json
{
	"prefix": "--",

	"token": "YOUR-TOKEN-HERE"
}
```
