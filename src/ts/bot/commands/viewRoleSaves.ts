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
		return this.hash.update(what).digest("base64");
		// benchmarking led me to discover that sha-1 hex is fastest
		// digest type makes little difference in the testing; however base64 is more efficient at encoding data
		// leaderboard:

		// md5-hex x 72,128 ops/sec ±1.20% (88 runs sampled)
		// md5-base64 x 72,478 ops/sec ±1.69% (90 runs sampled)
		// sha1-hex x 139,350 ops/sec ±2.90% (89 runs sampled)
		// sha1-base64 x 139,769 ops/sec ±3.25% (88 runs sampled)
		// sha256-hex x 135,440 ops/sec ±3.87% (85 runs sampled)
		// sha256-base64 x 133,716 ops/sec ±4.37% (89 runs sampled)
	}
}



export default class viewRoleSaves extends RBCommand {
	static description = "Views roles saved via suspendRole.";
	static friendlyName = "View Role Saves";
	static usage = "viewRoleSaves <optional id>";
	static cachedServers: Map<string, [string, ParsedRoleSave[]]> = new Map();
	//                        id       hash    data

	static async run(command: MessageCommand) {
		const {args, channel, guild} = command;

		const embed = new MessageEmbed();
		embed.setColor("#7b42f5");


		const json = await FSManager.call("readFile", "./db.json", [{encoding: "utf8"}]).then((file: string) => JSON.parse(file));


		if(!json.servers[guild.id]) {
			channel.send("This server has no saves.");
			return;
		}


		const serverSaves = <Object>json.servers[guild.id].roleSaves;

		let parsedSaves: ParsedRoleSave[] = [];


		const cachedHash = sha1.toHash(JSON.stringify(serverSaves));

		if(this.cachedServers.has(guild.id) && this.cachedServers.get(guild.id)![0] === cachedHash) {
			parsedSaves = this.cachedServers.get(guild.id)![1];
		} else { // if there either is no cache or it's been updated, recompute
			parsedSaves = this.cacheServer(serverSaves, guild.id);
		}

		// if message is --viewRoleSaves, send most recent 10
		// if message is --viewRoleSaves page [x], return parsedSaves.slice(10 * (page - 1), 10 * page)
		// if message is --viewRoleSaves id [id], return [Role name + first 10 members]
	}

	static cacheServer(raw: Object, guildID: string) {
		const out: ParsedRoleSave[] = [];

		for(const [saveID, data] of Object.entries(raw)) {
			const members = data.split("\n");
			members.pop(); // trailing \n

			const date = members.shift();
			const roleID = members.shift();

			out.push({saveID, date: parseInt(date), roleID, members});
		}


		out.sort((a, b) => { // sort by most recent
			if(a.date > b.date) {
				return 1;
			} else if(b.date > a.date) {
				return -1;
			}

			return 0;
		});

		const recomputedHash = sha1.toHash(JSON.stringify(out));
		this.cachedServers.set(guildID, [recomputedHash, out]);

		return out;
	}
}
