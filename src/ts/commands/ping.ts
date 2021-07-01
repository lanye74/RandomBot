import type {Command} from "../types.js";



export default function ping(command: Command): void {
	const {message, client} = command;
	message.channel.send(`pong -- latency ${Date.now() - message.createdTimestamp}ms, api latency ${Math.round(client.ws.ping)}ms`);
}