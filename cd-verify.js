const { Client, GatewayIntentBits, Events, IntentsBitField, SlashCommandBuilder, MessageFlags, REST, Routes } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers], autoReconnect: true });
require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file

const actualCode = "codercool";
const roleName = "Coach";

const command =  {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verify to get the coach role.')
		.addStringOption((option) => option
			.setName('code')
			.setDescription('The code to become a coach (same as the eventbrite code).')
            .setRequired(true)
		),
        
	async execute(interaction) {

		const sentCode = interaction.options.getString('code');
        const role = interaction.guild.roles.cache.find((role) => role.name == roleName);
        if (sentCode.toLowerCase() == actualCode.toLowerCase()) {
            interaction.member.roles.add(role);
            interaction.reply({ content: "You are now a coach", flags: MessageFlags.Ephemeral });
            console.log(`Made ${interaction.member.nickname} a coach.`)
            return;
        }
        interaction.reply({ content: "Not a valid code", flags: MessageFlags.Ephemeral });
            console.log(`${interaction.member.nickname} failed with code ${sentCode}.`)

	}
}

const rest = new REST().setToken(process.env.TOKEN);

console.log("Starting")

client.login(process.env.TOKEN).then(async () => {
    
    const data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), //for individual guild
            { body: [command.data.toJSON()] },
        );
});

client.on('ready', () => {
    console.log("Ready")
});

client.on(Events.InteractionCreate, (interaction) => {
    
    if (interaction.isChatInputCommand() && interaction.commandName == "verify") {
        command.execute(interaction);
    }
});