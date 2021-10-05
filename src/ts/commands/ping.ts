import type {Command} from "../types.js";



export default function ping(command: Command): void {
	const {message, channel, client} = command;

	channel.send(`pong -- bot latency ${Date.now() - message.createdTimestamp}ms, api latency ${Math.round(client.ws.ping)}ms`);
}
