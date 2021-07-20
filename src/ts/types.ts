import type {Client, Message, User} from "discord.js";



export type BotConfig = {
	prefix: string,
	token: string
};



export type Command = {
	args: string[],
	client: Client,
	message: Message,
	name: string,
	sender: User
};
