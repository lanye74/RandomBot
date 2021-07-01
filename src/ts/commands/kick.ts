import type {Command} from "../types.js";



export default function kick(command: Command): void {
	const {args, message} = command;
	
	const memberID = args[0].slice(3, -2);
	
	message.guild!.members.fetch(memberID)
	.then(member => {
		console.log(member)
		if(member.kickable) {
			member.kick();
		} else {
			message.reply("I don't have perms to ban this person :(")
		}
	});
}