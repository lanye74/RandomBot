import {createHash} from "crypto"; // compute hash and cache embeds later (only most recent)
import FSManager from "../FSManager.js";
import {MessageEmbed} from "discord.js";
import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";



type ParsedRoleSave = {
	date: number,
	members: string[]
	roleID: string,
	saveID: string,
};



class sha1 {
	static hash = createHash("sha1");

	static toHash(what: string) {
		return this.hash.update(what).digest("hex");
	}
}



export default class viewRoleSaves extends RBCommand {
	static description = "Views roles saved via suspendRole.";
	static friendlyName = "View Role Saves";
	static usage = "viewRoleSaves <optional id>";
	static cachedServers: Map<string, [string, string]> = new Map();
	//                        id       hash    data (stringified)

	static async run(command: MessageCommand) {
		const {args, channel, guild} = command;

		const embed = new MessageEmbed();
		embed.setColor("#7b42f5");


		const json = await FSManager.call("readFile", "./db.json", [{encoding: "utf8"}]).then((file: string) => JSON.parse(file));


		if(!json.servers[guild.id]) {
			channel.send("This server has no saves.");
			return;
		}


		const saves = <Object>json.servers[guild.id].roleSaves;
		const stringSave = JSON.stringify(saves);

		let parsedSaves: ParsedRoleSave[] = [];


		const cachedHash = sha1.toHash(JSON.stringify(saves));

		if(this.cachedServers.has(guild.id) && this.cachedServers.get(guild.id)![0] === cachedHash) {
			parsedSaves = <ParsedRoleSave[]>JSON.parse(this.cachedServers.get(guild.id)![1]);
		} else { // if there either is no cache or it's been updated, recompute
			for(const [saveID, data] of Object.entries(saves)) {
				const members = data.split("\n");
				members.pop(); // trailing \n

				const date = members.shift();
				const roleID = members.shift();

				parsedSaves.push({saveID, date: parseInt(date), roleID, members});
			}


			parsedSaves.sort((a, b) => { // sort by most recent
				if(a.date > b.date) {
					return 1;
				} else if(b.date > a.date) {
					return -1;
				}

				return 0;
			});

			const recomputedHash = sha1.toHash(JSON.stringify(saves));

			this.cachedServers.set(guild.id, [recomputedHash, JSON.stringify(parsedSaves)]);
		}
	}
}
