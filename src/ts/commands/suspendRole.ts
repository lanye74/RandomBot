import * as fs from "fs-extra";
// @ts-ignore
const {existsSync, createFileSync, readFileSync, writeFileSync} = fs.default;

import type {MessageCommand} from "../types.js";



export default async function suspendRole(command: MessageCommand): Promise<void> {
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
	
	if(members.size === 0) {
		channel.send("No one has this role.");
		return;
	}


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
		createFileSync("./db.json");
		writeFileSync("./db.json", `{"servers": {}}`);
	}


	const json = JSON.parse(readFileSync("./db.json", {encoding: "utf8"}));

	if(!json.servers[guild.id]) {
		json.servers[guild.id] = {roleSaves: {}};
	}

	json.servers[guild.id].roleSaves[saveName] = saveData;

	const newJSON = JSON.stringify(json, null, "\t");

	writeFileSync("./db.json", newJSON);


	channel.send(`Successfully stored roles away as the message ID of the command (\`${saveName}\`).`);
}