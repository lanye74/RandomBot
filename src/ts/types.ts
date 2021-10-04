import type {Client, Guild, Message, User} from "discord.js";



export type BotConfig = {
	prefix: string,
	token: string
};



export type Command = {
	args: string[],
	client: Client,
	guild: Guild,
	message: Message,
	name: string,
	sender: User
};
