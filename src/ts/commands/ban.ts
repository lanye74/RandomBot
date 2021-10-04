import bot from "../Bot.js";

import type {BanOptions} from "discord.js";
import type {Command} from "../types.js";



export default async function ban(command: Command): Promise<void> {
	const {args, message, guild, sender} = command;
	
	const targetID = args[0].slice(3, -1);
	
	// args.slice(1).join(" ") || undefined
	const banOptions: BanOptions = {
		days: undefined,
		reason: undefined
	};
	

	if(!isNaN(parseInt(args[1]))) { // valid day count
		banOptions.days = parseInt(args[1]);
	} else {
		message.channel.send(`Invalid command syntax; try ${bot.config.prefix}ban {user} {optional days} {optional reason}`);
		return;
	}


	if(args[2]) {
		banOptions.reason = args.slice(2).join(" ");
	}


	// ----

	const [invoker, target] = await Promise.all([ // :)
		guild.members.fetch(sender.id),
		guild.members.fetch(targetID)
	]);


	// preliminary checks to banning

	if(!target.bannable) {
		message.channel.send("I don't have permission to ban this person.");
		return;
	}

	if(invoker.guild.owner === invoker) {
		message.channel.send(`${target.user.tag} was banned${(banOptions) ? `for ${banOptions}.` : "."}`);
		target.ban(banOptions);
		return;
	}

	if(!invoker.permissions.has("BAN_MEMBERS")) {
		message.channel.send("You don't have permission to ban people.");
		return;
	}

	// ----

	// with some quick testing, a non admin can ban an admin if set up poorly
	// target.ban();

	// time to figure out role hierarchy


	const invokerRolesMap = invoker.roles.cache; // is there a better way to write this?
	const targetRolesMap = target.roles.cache;


	// find the highest role granting ban perms of both members, compare which role is higher, determine if they can ban or not


	const invokerRolesArray = Array.from(invokerRolesMap.values());
	const targetRolesArray = Array.from(targetRolesMap.values());
	
	invokerRolesArray.sort((roleA, roleB) => roleB.position - roleA.position); // sort by descending roles
	targetRolesArray.sort((roleA, roleB) => roleB.position - roleA.position);

	
	const highestInvokerBanRole = invokerRolesArray.find(role => role.permissions.has("BAN_MEMBERS")); // find the highest role with ban perms
	const highestTargetBanRole = targetRolesArray.find(role => role.permissions.has("BAN_MEMBERS"));


	// user can be banned
	if(!highestTargetBanRole || // target has no ban perms
		highestInvokerBanRole!.position > highestTargetBanRole!.position
	) {
		message.channel.send(`${target.user.tag} was banned${(banOptions) ? `for ${banOptions}.` : "."}`);
		target.ban(banOptions);
		return;
	}


	// user cannot be banned
	if(highestInvokerBanRole!.position <= highestTargetBanRole!.position) {
		message.channel.send(`You don't have permissions to ban ${target.user.tag}.`);
		return;
	}
}
