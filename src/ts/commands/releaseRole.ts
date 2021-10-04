import * as fs from "fs-extra";
// @ts-ignore
const {existsSync, readFileSync, writeFileSync} = fs.default;

import type {Command} from "../types.js";



export default async function releaseRole(command: Command): Promise<void> {
	const {args, message, sender, guild} = command;


	// make sure the sender is allowed to manage roles
	const senderGuildMember = await guild.members.fetch(sender.id);

	if(!senderGuildMember.permissions.has("MANAGE_ROLES")) {
		message.channel.send("You don't have the necessary perms to do that.")
		return;
	}



	if(!existsSync("./db.json")) {
		message.channel.send("Please run `suspendRole` at least once to initialize the database.");
		return;
	}

	const json = JSON.parse(readFileSync("./db.json", {encoding: "utf8"}));
	
	if(!json.servers[guild.id]) {
		message.channel.send("This server has no saves.")
	}

	const saveLookup = args[0];


	const saveDataCompressed = json.servers[guild.id].roleSaves[saveLookup];
	// delete json.servers[guild.id].rolesSaves[saveLookup];
	// this doesn't work, fix

	const newJSON = JSON.stringify(json, null, "\t");
	writeFileSync("./db.json", newJSON);


	const saveData = saveDataCompressed.split("\n");
	saveData.pop(); // remove trailing \n


	const [roleID, ...memberIDs] = [...saveData];

	const role = await guild.roles.fetch(roleID);

	if(!role) {
		message.channel.send("The role you're trying to release no longer exists.");
		return;
	}


	const members = await guild.members.fetch({user: [...memberIDs]});

	members.forEach(member => {
		member.roles.add(role);
	});

	
	message.channel.send("Successfully returned all roles.");
}