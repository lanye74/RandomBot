# RandomBot

Eventually going to be some kind of generic do-it-all discord bot. For now I'm just messing around though



yes i know this is hot garbage
im trying ok

todo:
- server specific prefixes
- refactor into singular bot class to interact with (`const bot = new RandomBot();`)
- add default "timed" method to RBCommand, i.e. an implementation of what kill has
- make RBCommand an interface so that having the class there makes logical sense
- electron

commands:
- info command
	- changelog in db (make sure to read once like in version command)
- add a deleteRoleSave command
- make general help command use pages w/ fields, or completely reformat idk
- let spamPing spam images
- make help command embed title generic (`Bot.config.name`?)





if for whatever god awful reason you want to run this yourself you need a config.json file
```json
{
	"prefix": "--",

	"token": "YOUR-TOKEN-HERE"
}
```
