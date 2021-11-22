import RBCommand from "../RBCommand.js";

import type {BanOptions} from "discord.js";
import type {MessageCommand} from "../types/types.js";



export default class ban extends RBCommand {
	static aliases = [];
	static description = "Bans a user.";
	static friendlyName = "Ban";
	static usage = "ban [mention user] <optional days of messages to clear> <optional reason>";

	static async run(command: MessageCommand): Promise<void> {
		const {args, channel, guild, mentions, sender} = command;

		const banOptions: BanOptions = {
			days: undefined,
			reason: undefined
		};

		const targetID = mentions[0].id;


		if(args[1]) {
			const days = parseInt(args[1]);

			if(isNaN(days) || days > 7 || days < 0) {
				channel.send("Invalid number of days of messages to clean. It must be a number from 0 to 7.");
				return;
			} else {
				banOptions.days = days;
			}
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
			channel.send("I don't have permission to ban this person.");
			return;
		}

		if(guild.ownerId === invoker.id) {
			channel.send(`${target.user.tag} was banned${(banOptions) ? `for ${banOptions}.` : "."}`);
			target.ban(banOptions);
			return;
		}

		if(!invoker.permissions.has("BAN_MEMBERS")) {
			channel.send("You don't have permission to ban people.");
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
			channel.send(`${target.user.tag} was banned.`);
			target.ban(banOptions);
			return;
		}


		// user cannot be banned
		if(highestInvokerBanRole!.position <= highestTargetBanRole!.position) {
			channel.send(`You don't have permissions to ban ${target.user.tag}.`);
			return;
		}
	}
}
