import RBCommand from "../RBCommand.js";

import type {MessageCommand} from "../types.js";



export default class ping extends RBCommand {
	static description = `Get information about the bot's connection.\n\nUsage: \`${this.prefix}ping\``;
	static friendlyName = "Ping";

	static run(command: MessageCommand): void {
		const {message, channel, client} = command;

		channel.send(`Pong -- The bot latency is ${Date.now() - message.createdTimestamp}ms, and the Discord API latency is ${Math.round(client.ws.ping)}ms.`);
	}
}
