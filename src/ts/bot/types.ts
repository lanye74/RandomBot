import type {Client, Guild, Message, TextChannel, User} from "discord.js";



export type BotConfig = {
	prefix: string,
	token: string
};



export type MessageCommand = {
	args: string[],
	channel: TextChannel,
	client: Client,
	guild: Guild,
	mentions: User[],
	message: Message,
	name: string,
	sender: User
};
