import * as fs from "fs-extra";
import RBCommand from "../RBCommand.js";
// @ts-ignore
const {createFile, existsSync, readFile, writeFile} = fs.default;

import type {MessageCommand} from "../types.js";



export default class suspendRole extends RBCommand {
	static description = "Removes the inputted role from all users and stores it to be later returned.";
	static friendlyName = "Suspend Role";
	static usage = "suspendRole <role ID>";

	static async run(command: MessageCommand): Promise<void> {
		const {args, channel, message, sender, guild} = command;
		let saveData = "";


		// first, not just anyone can do it
		const senderGuildMember = await guild.members.fetch(sender.id);

		if(!senderGuildMember.permissions.has("MANAGE_ROLES")) {
			channel.send("You don't have the necessary perms to do that.")
			return;
		}


		const role = await guild.roles.fetch(args[0]);

		if(!role) {
			channel.send("There is no role with this ID.");
			return;
		}

		saveData += `${role.id}\n`;

		// role.members only returns a list of cached members with this role
		// that isn't good enough, so let's check every member for the role because I hate myself lmao

		const members = await guild.members.fetch();


		members.forEach(member => {
			if(member.roles.cache.has(role.id)) {
				member.roles.remove(role);

				saveData += `${member.id}\n`;
			}
		});


		// now we have a list in the format of
		// role id
		// member 1 id
		// member 2 id
		// etc

		// let's store that in a snapshot based off of the user's save request

		const saveName = message.id;


		if(!existsSync("./db.json")) {
			await createFile("./db.json");
			await writeFile("./db.json", "{\"servers\": {}}");
		}


		const json = await readFile("./db.json", {encoding: "utf8"}).then((file: string) => {return JSON.parse(file)});

		if(!json.servers[guild.id]) {
			json.servers[guild.id] = {roleSaves: {}};
		}

		json.servers[guild.id].roleSaves[saveName] = saveData;

		const newJSON = JSON.stringify(json, null, "\t");

		await writeFile("./db.json", newJSON);


		channel.send(`Successfully stored roles away as the message ID of the command (\`${saveName}\`).`);
	}
}
