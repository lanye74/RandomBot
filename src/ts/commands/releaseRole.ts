import FSManager from "../FSManager.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types/types.js";



export default class releaseRole extends RBCommand {
	static aliases = ["rr"];
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


		const fileWriteID = FSManager.generateProtectiveID();
		const json = await FSManager.call("readFile", "./serverSaves.json", [{encoding: "utf8"}], fileWriteID).then((file: string) => JSON.parse(file));


		if(!json[guild.id]) {
			channel.send("This server has no saves.");
			FSManager.release("./serverSaves.json", fileWriteID);
			return;
		}

		const saveLookup = args[0];


		const saveDataCompressed = json[guild.id][saveLookup];

		if(!saveDataCompressed) {
			channel.send("There is no save under this ID.");
			FSManager.release("./serverSaves.json", fileWriteID);
			return;
		}


		delete json[guild.id][saveLookup];


		const newJSON = JSON.stringify(json, null, "\t");
		await FSManager.call("writeFile", "./serverSaves.json", [newJSON], fileWriteID);


		const saveData = saveDataCompressed.split("\n");
		saveData.pop(); // remove trailing \n


		const [_timestamp, roleID, ...memberIDs] = [...saveData];

		const role = await guild.roles.fetch(roleID);

		if(!role) {
			channel.send("The role you're trying to release no longer exists.");
			FSManager.release("./serverSaves.json", fileWriteID);
			return;
		}


		const members = await guild.members.fetch({user: [...memberIDs]});

		members.forEach(member => {
			member.roles.add(role);
		});


		channel.send("Successfully returned the role.");
	}
}
