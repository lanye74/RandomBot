import type {Client, Guild, Message, TextChannel, User} from "discord.js";



export type BotConfig = {
	prefix: string,
	token: string
};



export type Command = {
	args: string[],
	channel: TextChannel,
	client: Client,
	guild: Guild,
	message: Message,
	name: string,
	sender: User
};
