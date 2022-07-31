import type {GatewayIntentsString} from "discord.js";

export const RandomBotIntentPresets = {
	GuildAll: <GatewayIntentsString[]>["Guilds", "GuildBans", "GuildEmojisAndStickers", "GuildIntegrations", "GuildInvites", "GuildMembers", "GuildMessageReactions", "GuildMessageTyping", "GuildMessages", "GuildPresences", "GuildVoiceStates", "GuildWebhooks"],
	GuildBasic: <GatewayIntentsString[]>["Guilds", "GuildBans", "GuildMembers", "GuildMessages"],
	DMs: <GatewayIntentsString[]>["DirectMessages", "DirectMessageReactions", "DirectMessageTyping"],
	Reactions: <GatewayIntentsString[]>["DirectMessageReactions", "GuildMessageReactions"]
} as const;
