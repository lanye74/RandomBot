import {RandomBotIntentPresets} from "./consts.js";

import type {Client, Guild, IntentsString, Message, TextChannel, User} from "discord.js";



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
	data: any[]
	operation: string,
	path: string,
	promise: FlexiblePromise,
	protectFile: number,
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



export type RandomBotConfig = {
	token: string;
	prefix: string;
};



export type RandomBotInitOptions = {
	configLocation: string;
	intents?: IntentsString[];
	intentsBitField?: number;
	intentsPresets?: RandomBotIntentPreset[];
};



export type RandomBotIntentPreset = keyof typeof RandomBotIntentPresets;



export type SpamTask = [string, number, TextChannel];
