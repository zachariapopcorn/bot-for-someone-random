// To run the bot, do 'node index.js'
const Discord = require('discord.js'); // In the console, do 'npm install discord.js'
const roblox = require('noblox.js'); // In the console, do 'npm install noblox.js'
const client = new Discord.Client();
const token = 'TOKEN HERE'; // Change to your Discord bot token
const prefix = 'PREFIX HERE'; // Change to whatever you would like
const cookie = 'COOKIE HERE'; // Change to your Roblox bot account cookie
const groupid = 0 // Change to your group id
const maximumRank = 0; // Change to the rank id that the bot is ranked at
const whitelistedRole = "Ranking Permissions" // Change to whatever you want the whitelisted role to be
const rankingCommand = "rank" // Change to whatever you want the name of the command to be, this must be lowercase!
const rolesCommand = "getroles" // Change to whatever you want the name of the command to be, this must be lowercase!

client.on("ready", async => {
    try {
        await roblox.cookieLogin(cookie);
    } catch {
        console.log("The cookie suplied is invalid!");
    }
    console.log("Ready to rank people!");
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === rankingCommand) {
        if(!message.member.roles.cache.some(role =>[whitelistedRole].includes(role.name))) {
            return message.channel.send("I'm sorry, but you need the " + whitelistedRole + " role to use this command!");
        }
        let username = args[0];
        let rankid = args[0];
        let id
        try {
            id = await roblox.getIdFromUsername(username)
        } catch {
            return message.channel.send("This user isn't in the Roblox database!");
        }
        if(rankid >= maximumRank) {
            return message.channel.send("I can't rank this high!");
        }
        if(await roblox.getRankInGroup(groupid, id) == 0) {
            return message.channel.send("This user isn't in the group!");
        }
        if(await roblox.getRankInGroup(groupid, id) >= maximumRank) {
            return message.channel.send("I can't manage the rank of this user!");
        }
        let oldRankId = await roblox.getRankInGroup(groupid, id);
        let oldRankName = await roblox.getRankNameInGroup(groupid, id);
        let response
        try {
            response = await roblox.setRank(groupid, id, rankid);
        } catch (err) {
            return message.channel.send("There was an error while ranking this user:" + err);
        }
        return message.channel.send(`Success! You have ranked ${username} from ${oldRankName} that has the rank id of ${oldRankId} to ${response.name} which has the rank id of ${response.rank}!`);
    }
    if(command === rolesCommand) {
        let roles = await roblox.getRoles(groupid);
        let returnMessage = [];
        for(var i = 0; i < role.length; i++) {
            let msg = "Rank name: " + roles[i].name + " Rank id: " + roles[i].id;
            returnMessage.push(msg);
        }
        return message.channel.send(returnMessage);
    }
});

client.login(token);
