import type {Client, Message} from "discord.js";



export type BotConfig = {
	prefix: string,
	token: string
};



export type Command = {
	args: string[],
	client: Client,
	message: Message,
	name: string
};