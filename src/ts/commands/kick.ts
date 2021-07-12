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
	// 		message.reply("I don't have perms to kick this person :(") //  lastMessageID
	// 	}
	// });


	const [invoker/*Perms*/, target/*Perms*/] = await Promise.all([ // :)
		/*(await */message.guild!.members.fetch(message.author.id)/*).permissions.serialize()*/,
		/*(await */message.guild!.members.fetch(targetID)/*).permissions.serialize()(*/
	]);


	console.log({invoker/*Perms*/, target/*Perms*/});
}