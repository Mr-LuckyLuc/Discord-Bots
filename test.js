require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file
const { channel } = require("diagnostics_channel");
const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, ChannelType, PermissionFlagsBits, messageLink, Message, User, InteractionCollector } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent,], Partials: [], autoReconnect: true})
const fs = require('fs');

client.login(process.env.TOKEN);

client.once("ready", () => {
    console.log("BOT IS ONLINE.");
});

client.on("messageCreate", (msg) =>{
    if(msg.content === "test"){
        let o = true;
        while(o){
            client.on("messageCreate", (msg) => {
                    o = false;
                    msg.channel.send("jas")
            })
        }
        msg.channel.send("done");
    }
})