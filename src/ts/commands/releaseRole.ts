import * as fs from "fs-extra";
import Bot from "../Bot.js";
import RBCommand from "../RBCommand.js";
// @ts-ignore
const {existsSync, readFile, writeFile} = fs.default;

import type {MessageCommand} from "../types.js";



export default class releaseRole extends RBCommand {
	static description = `Returns a previously stored role to the members who had it.\n\nUsage: \`${this.prefix}releaseRole <message ID that suspendRole was invoked in>\``;
	static friendlyName = "Release Role";

	static async run(command: MessageCommand): Promise<void> {
		const {args, channel, sender, guild} = command;


		// make sure the sender is allowed to manage roles
		const senderGuildMember = await guild.members.fetch(sender.id);

		if(!senderGuildMember.permissions.has("MANAGE_ROLES")) {
			channel.send("You don't have the necessary perms to do that.")
			return;
		}



		if(!existsSync("./db.json")) {
			channel.send(`Please run \`${Bot.config.prefix}suspendRole\` at least once to initialize the database.`);
			return;
		}


		const json = await readFile("./db.json", {encoding: "utf8"}).then((file: string) => {return JSON.parse(file)});

		if(!json.servers[guild.id]) {
			channel.send("This server has no saves.")
		}

		const saveLookup = args[0];


		const saveDataCompressed = json.servers[guild.id].roleSaves[saveLookup];

		if(!saveDataCompressed) {
			channel.send("There is no save under this ID.");
			return;
		}


		delete json.servers[guild.id].roleSaves[saveLookup];


		const newJSON = JSON.stringify(json, null, "\t");
		await writeFile("./db.json", newJSON);


		const saveData = saveDataCompressed.split("\n");
		saveData.pop(); // remove trailing \n


		const [roleID, ...memberIDs] = [...saveData];

		const role = await guild.roles.fetch(roleID);

		if(!role) {
			channel.send("The role you're trying to release no longer exists.");
			return;
		}


		const members = await guild.members.fetch({user: [...memberIDs]});

		members.forEach(member => {
			member.roles.add(role);
		});


		channel.send("Successfully returned the role.");
	}
}
