import type {Command} from "../types.js";



export default async function kick(command: Command): Promise<void> {
	const {args, message} = command;
	
	const targetID = args[0].slice(3, -1);
	
	// message.guild!.members.fetch(memberID)
	// .then(member => {
	// 	console.log(member)
	// 	if(member.kickable) {
	// 		(args[1]) ? member.kick(args[1]) : member.kick();

			
	// 	} else {
	// 		message.reply("I don't have perms to ban this person :(") //  lastMessageID
	// 	}
	// });


	const [invoker, target] = await Promise.all([ // :)
		message.guild!.members.fetch(message.author.id),
		message.guild!.members.fetch(targetID)
	]);


	console.log(invoker, target);
}