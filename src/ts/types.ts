import type {Client, Guild, Message, TextChannel, User} from "discord.js";



export type BotConfig = {
	prefix: string,
	token: string
};



export type FlexiblePromise = {
	promise: Promise<any>,
	resolve: Function,
	reject: Function
};



export type FSTask = {
	promise: FlexiblePromise,
	method: Function,
	path: string,
	protectFile: number,
	data: any[]
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



export type ParsedRoleSave = {
	date: number,
	members: string[]
	roleID: string,
	saveID: string,
};



export type SpamTask = [string, number, TextChannel];