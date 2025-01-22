const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, Guild } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent, IntentsBitField.Flags.GuildIntegrations], partials: [Partials.GuildMember, Partials.User, Partials.Channel], autoReconnect: true });

export function isCommand(prefix, string) {
    let rest;
    if(string.startsWith(prefix)){
        command = string.slice(4);
        return true;
    }
}