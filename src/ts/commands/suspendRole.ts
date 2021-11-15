import FSManager from "../FSManager.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";



export default class suspendRole extends RBCommand {
	static aliases = ["sr"];
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

		saveData += `${message.createdTimestamp}\n`;

		saveData += `${role.id}\n`;

		// role.members only returns a list of cached members with this role
		// that isn't good enough, so let's check every member for the role because I hate myself lmao

		const members = await guild.members.fetch();
		let membersWithIndex = 0;


		members.forEach(member => {
			if(member.roles.cache.has(role.id)) {
				member.roles.remove(role);
				membersWithIndex++;

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


		const fileWriteID = FSManager.generateProtectiveID();

		const json = await FSManager.call("readFile", "./serverSaves.json", [{encoding: "utf8"}], fileWriteID).then((file: string) => JSON.parse(file));

		if(!json[guild.id]) {
			json[guild.id] = {};
		}

		json[guild.id][saveName] = saveData;

		const newJSON = JSON.stringify(json, null, "\t");
		await FSManager.call("writeFile", "./serverSaves.json", [newJSON], fileWriteID);


		channel.send(`Successfully stored role "${role.name}" from ${membersWithIndex} member${(membersWithIndex > 1) ? "s" : ""} away as the message ID of the command (\`${saveName}\`).`);
	}
}
