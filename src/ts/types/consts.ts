import type {GatewayIntentsString} from "discord.js";

export const RandomBotIntentPresets = {
	GuildAll: <GatewayIntentsString[]>["Guilds", "GuildBans", "GuildEmojisAndStickers", "GuildIntegrations", "GuildInvites", "GuildMembers", "GuildMessageReactions", "GuildMessageTyping", "GuildMessages", "GuildPresences", "GuildVoiceStates", "GuildWebhooks", "MessageContent"],
	GuildBasic: <GatewayIntentsString[]>["Guilds", "GuildBans", "GuildMembers", "GuildMessages", "MessageContent"],
	DMs: <GatewayIntentsString[]>["DirectMessages", "DirectMessageReactions", "DirectMessageTyping", "MessageContent"],
	Reactions: <GatewayIntentsString[]>["DirectMessageReactions", "GuildMessageReactions"]
} as const;
