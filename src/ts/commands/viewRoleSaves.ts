import FSManager from "../FSManager.js";
import {GuildMember, MessageEmbed} from "discord.js"
import RBCommand from "../RBCommand.js";

import type {EmbedFieldData, Guild} from "discord.js";
import type {MessageCommand, ParsedRoleSave} from "../types/types.js";



export default class viewRoleSaves extends RBCommand {
	static aliases = ["vrs"];
	static description = "Views roles saved via suspendRole.";
	static friendlyName = "View Role Saves";
	static usage = "viewRoleSaves {page | id} {page # | save id}";

	static async run(command: MessageCommand) {
		const {args, channel, guild} = command;

		const embed = new MessageEmbed();
		embed.setColor("#7b42f5");


		const json = await FSManager.call("readJSON", "./serverSaves.json", [{encoding: "utf8"}])


		if(!json[guild.id]) {
			channel.send("This server has no saves.");
			return;
		}


		const serverSaves = <object>json[guild.id];

		let parsedSaves: ParsedRoleSave[] = this.parseSaves(serverSaves);


		if(parsedSaves.length === 0) {
			embed.setDescription("This server has no saves.");
			channel.send({embeds: [embed]});
			return;
		}



		if(args.length === 0) {
			const first10 = parsedSaves.slice(0, 10);

			embed.addFields(...(await this.savesToFields(first10, guild)));

			embed.setTitle(`Server Saves`);
			embed.setFooter(`Page 1/${Math.ceil(parsedSaves.length / 10)}`);

			channel.send({embeds: [embed]});
		} else if(args[0] === "page" || args[0] === "p") {
			const pages = Math.ceil(parsedSaves.length / 10);
			let pageIndex = parseInt(args[1]);

			if(isNaN(pageIndex)) {
				channel.send("Invalid option page number.");
				return;
			}

			if(pageIndex > pages) {
				pageIndex = pages;
			}

			if(pageIndex < 1) {
				pageIndex = 1;
			}


			const saves = parsedSaves.slice(10 * (pageIndex - 1), 10 * pageIndex);

			embed.addFields(await this.savesToFields(saves, guild));

			embed.setTitle(`Page ${pageIndex} of Server Saves`);
			embed.setFooter(`Page ${pageIndex}/${pages}`);

			channel.send({embeds: [embed]});
		} else if(args[0] === "id" || args[0] === "info") {
			const save = parsedSaves.filter(save => save.saveID === args[1])[0];

			if(!save) {
				channel.send("The save you're searching for doesn't exist.");
				return;
			}


			const saveMembers = save.members.slice(0);
			const members = await guild.members.fetch({user: saveMembers});


			const tagsList = members.map((member: GuildMember) => member.user.tag);


			if(tagsList.length > 10) {
				tagsList.splice(9, tagsList.length);
				tagsList.push(`...and ${tagsList.length - 9} other members`);
			}


			embed.setTitle(`Save ${save.saveID}`);
			embed.addFields(
				{name: "Role Name", value: await this.resolveRoleName(save.roleID, guild)},
				{name: "Date Saved", value: (new Date(save.date).toLocaleString("default", {dateStyle: "medium", timeStyle: "long"}))},
				{name: "Members", value: tagsList.join("\n").trim()}
			);


			channel.send({embeds: [embed]});
		} else {
			channel.send("You didn't specify valid a valid first argument.");
			return;
		}
	}

	private static parseSaves(raw: Object) {
		const out: ParsedRoleSave[] = [];


		Object.entries(raw).forEach(([saveID, data]) => {
			const members = data.split("\n");
			members.pop(); // trailing \n

			const date = members.shift();
			const roleID = members.shift();

			out.push({saveID, date: parseInt(date), roleID, members});
		});

		return out;
	}

	private static async savesToFields(saves: ParsedRoleSave[], guild: Guild): Promise<EmbedFieldData[]> {
		const queue: Function[] = [];

		saves.forEach(save => {
			queue.push(() => this.loadRoleField(save, guild));
		});

		return Promise.all(queue.map(field => field()));
	}

	private static async loadRoleField(save: ParsedRoleSave, guild: Guild): Promise<EmbedFieldData> {
		return new Promise(async resolve => {
			const role = await this.resolveRoleName(save.roleID, guild);

			resolve(<EmbedFieldData>{name: `ID: ${save.saveID}`, value: `Role name: ${role}\n${save.members.length} members`});
		});
	}

	private static async resolveRoleName(id: string, guild: Guild): Promise<string> {
		const discordRole = await guild.roles.fetch(id);
		let role = discordRole!.name;

		if(!discordRole) {
			role = "Deleted Role";
		}

		return role;
	}
}
