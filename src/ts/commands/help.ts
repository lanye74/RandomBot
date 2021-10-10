import {MessageEmbed} from "discord.js";
import Bot from "../Bot.js";

import type {Command} from "../types.js";



export default function help(command: Command): void {
	const embed = new MessageEmbed();
	const {prefix} = Bot.config;

	embed.setColor("#7b42f5");
	
	embed.setTitle("help commands for lanye's utilities");

	embed.setDescription(`${prefix}help | this command
	${prefix}ping | get the latency of the bot and the discord API

	${prefix}kick [mention user] <reason> | kicks a user
	${prefix}ban [mention user] <days> <reason> | bans a user
	
	${prefix}suspendRole [role ID] | removes the inputted role from all users and stores it; e.g. if you input a member role, it will remove the member role from all users with it and then that role can be later returned
	${prefix}releaseRole [message ID] | used to return a role that was revoked using \`suspendRole\` -- use it by inputting the message ID in which you invoked \`suspendRole\`
	`);

	command.channel.send(embed);
}