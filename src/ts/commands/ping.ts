import type {Command} from "../types.js";



export default function ping(command: Command): void {
	const {message, channel, client} = command;

	channel.send(`Pong -- The bot latency is ${Date.now() - message.createdTimestamp}ms, and the Discord API latency is ${Math.round(client.ws.ping)}ms.`);
}
