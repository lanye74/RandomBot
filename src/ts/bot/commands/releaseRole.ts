import Bot from "../Bot.js";
import * as fs_bad from "fs-extra";
import RBCommand from "../RBCommand.js";
// @ts-ignore
const fs = fs_bad.default;

import type {MessageCommand} from "../types.js";
import FSManager from "../FSManager.js";



export default class releaseRole extends RBCommand {
	static description = "Returns a previously stored role to the members who had it.";
	static friendlyName = "Release Role";
	static usage = "releaseRole <message ID that suspendRole was invoked in>";

	static async run(command: MessageCommand): Promise<void> {
		const {args, channel, sender, guild} = command;


		// make sure the sender is allowed to manage roles
		const senderGuildMember = await guild.members.fetch(sender.id);

		if(!senderGuildMember.permissions.has("MANAGE_ROLES")) {
			channel.send("You don't have the necessary perms to do that.")
			return;
		}



		if(!fs.existsSync("./db.json")) {
			channel.send(`Please run \`${Bot.config.prefix}suspendRole\` at least once to initialize the database.`);
			return;
		}


		const fileWriteID = FSManager.generateProtectiveID();
		const json = await FSManager.read("./db.json", [{encoding: "utf8"}], fileWriteID).then((file: string) => JSON.parse(file));

		if(!json.servers[guild.id]) {
			channel.send("This server has no saves.");
		}

		const saveLookup = args[0];


		const saveDataCompressed = json.servers[guild.id].roleSaves[saveLookup];

		if(!saveDataCompressed) {
			channel.send("There is no save under this ID.");
			FSManager.release("./db.json", fileWriteID);
			return;
		}


		delete json.servers[guild.id].roleSaves[saveLookup];


		const newJSON = JSON.stringify(json, null, "\t");
		await FSManager.write("./db.json", [newJSON], fileWriteID);


		const saveData = saveDataCompressed.split("\n");
		saveData.pop(); // remove trailing \n


		const [roleID, ...memberIDs] = [...saveData];

		const role = await guild.roles.fetch(roleID);

		if(!role) {
			channel.send("The role you're trying to release no longer exists.");
			FSManager.release("./db.json", fileWriteID);
			return;
		}


		const members = await guild.members.fetch({user: [...memberIDs]});

		members.forEach(member => {
			member.roles.add(role);
		});


		channel.send("Successfully returned the role.");
	}
}
