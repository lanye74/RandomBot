import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types/types.js";



export default class kick extends RBCommand {
	static aliases = [];
	static description = "Kicks a user.";
	static friendlyName = "Kick";
	static usage = "kick [mention user] <optional reason>";

	static async run(command: MessageCommand): Promise<void> {
		const {args, channel, guild, mentions, sender} = command;

		const targetID = mentions[0].id;
		const reason = args.slice(1).join(" ") || undefined;


		// ----

		const [invoker, target] = await Promise.all([ // :)
			guild.members.fetch(sender.id),
			guild.members.fetch(targetID)
		]);


		// preliminary checks to kicking

		if(!target.kickable) {
			channel.send("I don't have permission to kick this person.");
			return;
		}

		if(guild.ownerId === invoker.id) {
			channel.send(`${target.user.tag} was kicked${(reason) ? `for ${reason}.` : "."}`);
			target.kick(reason);
			return;
		}

		if(!invoker.permissions.has("KICK_MEMBERS")) {
			channel.send("You don't have permission to kick people.");
			return;
		}

		// ----

		// with some quick testing, a non admin can kick an admin if set up poorly
		// target.kick();

		// time to figure out role hierarchy


		const invokerRolesMap = invoker.roles.cache; // is there a better way to write this?
		const targetRolesMap = target.roles.cache;


		// find the highest role granting kick perms of both members, compare which role is higher, determine if they can kick or not


		const invokerRolesArray = Array.from(invokerRolesMap.values());
		const targetRolesArray = Array.from(targetRolesMap.values());

		invokerRolesArray.sort((roleA, roleB) => roleB.position - roleA.position); // sort by descending roles
		targetRolesArray.sort((roleA, roleB) => roleB.position - roleA.position);


		const highestInvokerKickRole = invokerRolesArray.find(role => role.permissions.has("KICK_MEMBERS")); // find the highest role with kick perms
		const highestTargetKickRole = targetRolesArray.find(role => role.permissions.has("KICK_MEMBERS"));


		// user can be kicked
		if(!highestTargetKickRole || // target has no kick perms
			highestInvokerKickRole!.position > highestTargetKickRole!.position
		) {
			channel.send(`${target.user.tag} was kicked${(reason) ? ` for ${reason}.` : "."}`);
			target.kick(reason);
			return;
		}


		// user cannot be kicked
		if(highestInvokerKickRole!.position <= highestTargetKickRole!.position) {
			channel.send(`You don't have permissions to kick ${target.user.tag}.`);
			return;
		}
	}
}
