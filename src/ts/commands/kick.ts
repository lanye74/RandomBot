import type {Message, Client} from "discord.js";



export default function kick(message: Message, client: Client): void {
	const rawId = message.content.split(" ")[1];
	const trimmedId = rawId.slice(3, rawId.length - 2);

	console.log(trimmedId);
}