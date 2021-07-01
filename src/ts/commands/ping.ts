import type {Message, Client} from "discord.js";



export default function ping(message: Message, client: Client) {
	message.channel.send(`pong -- latency ${Date.now() - message.createdTimestamp}ms, api latency ${Math.round(client.ws.ping)}ms`);
}