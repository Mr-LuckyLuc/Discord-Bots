const {SlashCommandBuilder, MessageFlags} = require('discord.js')

const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reload the personel in here so far'),
        
	async execute(interaction) {

        const client = interaction.client;
        const ranks = client.ranks;
        const rankList = Object.fromEntries(Object.entries(ranks).map(([i, rank])=> {
            return [rank.rank, i]
        }));
        const members = interaction.member.guild.members.cache;

        console.log(rankList);

        const enlisted = {};

        members.forEach(member => {
            console.log(member);
            const roles = member.roles.cache;
            roles.forEach(role => {
                console.log(role.name)
                console.log(role.name in rankList)

                if (role.name in rankList) {
                    Object.entries(ranks).forEach( ([i, rank]) => {
                        if (rank.rank === role.name) {
                            enlisted[member.user.id] = {nickname: member.nickname.slice(rank.name.length+1), rank: i}
                        }
                    })
                }
            });
        }); 

        console.log(enlisted);

        fs.writeFile("./promotionBot/enlisted.txt", JSON.stringify(enlisted), (err) => {
            if(err){
                console.log(err);
            }else{
                console.log('rank changed');
            }
        });

        interaction.reply({content: "Loaded", flags: MessageFlags.Ephemeral})
	}
}