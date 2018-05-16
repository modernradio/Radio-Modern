var Discord = require('discord.js');
var bot = new Discord.Client();
const request = require("request");
let prefix = "."
let prefixLog = "[!]"
 
console.log("------------------------------")
console.log("Démarrage...");
 
var commands = {
    "join": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send(':warning: | **Tu est pas dans un salon vocal.**');
            if(!msg.member.voiceChannel.joinable) {
                msg.channel.send(":warning: | **Je n'ai pas les permissions suffisantes pour jouer de la musique sur ce canal..**");
                return;
            }
            msg.member.voiceChannel.join();
            msg.channel.send(":loudspeaker: | **Je suis là !**");
           
            console.log("La commande 'help' a été exécutée par " + msg.author.username + " sur le serveur " + guild.name)
        }
    },
   
    "play": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send(":warning:  | **Tu n'est pas dans un salon vocal.**");
            if (suffix) {
                if (suffix === "Radio" || suffix === "radio") {
                    msg.channel.send(":musical_note:  |  **Radio Modern**");
                    var radio = "RadioModern";                 
                } else {
                    msg.channel.send(":warning:  |  **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
                    return;
                }
                msg.member.voiceChannel.join().then(connection => {
                    require('http').get("http://streaming.radionomy.com/"+radio, (res) => {
                        connection.playStream(res);
                    })
                })
                .catch(console.error);
            } else {
                msg.channel.send(":warning: | **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
            }
       
        console.log("La commande 'play' a été exécutée par " + msg.author.username + " sur le serveur " + msg.guild.name)
   
        },
 
    },
       
    "stop": {
        process: function (msg, suffix) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel) {
                msg.channel.send(":loudspeaker: | **Je suis plus là !**");
                msg.member.voiceChannel.leave();
            } else {
                msg.channel.send(":warning: | **Je ne suis pas dans un salon vocal.**");
            }
       
        console.log("La commande 'stop' a été exécutée par " + msg.author.username + " sur le serveur " + msg.guild.name)
 
        }
    },
   
    "help": {
        process: function (msg, suffix) {
            var help_embed = new Discord.RichEmbed()
                .addBlankField()
                .addField(".join", "Pour que je rejoigne ton salon vocal.")
                .addBlankField()
                .addField(".play radio", "Pour que je joue la radio dans ton salon vocal.")
                .addBlankField()
                .addField(".stop", "Pour que je quitte ton salon vocal.")
                .addBlankField()
                .addField(".botinfo", "Pour voir mes informations.")
                .addBlankField()
                .setColor("#04B404")
                .setFooter("Par Ilian ! ^^")
                .setAuthor("Message d'aide")
                .setTimestamp()
                msg.channel.sendEmbed(help_embed)
               
        console.log("La commande 'help' a été exécutée par " + msg.author.username + " sur le serveur " + msg.guild.name)
        },
    },
   
    "botinfo": {
        process: function (msg, suffix) {
            var ping_embed = new Discord.RichEmbed()
                .addField(':clock2: Calcul en cours...', "Merci de patienter quelques instants !")
            let startTime = Date.now();
            msg.channel.send(ping_embed).then(msg => msg.edit(pong_embed));
            const fs = require("fs");
            var pong_embed = new Discord.RichEmbed()
                .setColor('#04B404')
                .setTitle('Mes Informations :')
                .addBlankField()
                .addField("Serveurs :", "Je suis sur " + bot.guilds.array().length + " serveurs")
                .addBlankField()
                .addField("Membres :", bot.users.size + " membres m'utilisent")
                .addBlankField()
                .addField('Mon Ping :', ':ping_pong: Pong !')
                .addBlankField()
                .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
                .addBlankField()
                .setTimestamp()
                .setFooter("By Ilian^^ !")
               
        console.log("La commande 'help' a été exécutée par " + msg.author.username + " sur le serveur " + msg.guild.name)
        }
    },
}
 
bot.on('ready', () => {
   
    bot.user.setActivity(prefix + "help | Démarré et prêt !");
    console.log("------------------------------")
    console.log(prefixLog + " Bot créé par Ilian ! <3")
    console.log(prefixLog + " Bot prêt")
    console.log("------------------------------")
   
    setTimeout(state1, 1000);
 
})
   
function state1() {
    request("http://api.radionomy.com/currentaudience.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);
 
        if (body == undefined) {
            bot.user.setActivity("?");
        } else {
            var msgActivity;
        if (parseInt(body) < 2) {
            msgActivity = "auditeur"
        } else {
            msgActivity = "auditeurs"
        }
        bot.user.setActivity(".help | " + body + "" + msgActivity);
        setTimeout(state2, 30000);
        }
    })
}
 
function state2 () {
    bot.user.setActivity(prefix + "help | " + bot.guilds.size + " serveurs, " + bot.users.size + " membres");
    setTimeout(state3, 5000);
}
 
function state3 () {
    bot.user.setActivity(prefix + "help | Par Ilian ! ^^");
    setTimeout(state1, 5000);
}
 
bot.on('message', function (msg) {
    if(msg.content.indexOf(prefix) === 0) {
        var cmdTxt = msg.content.split(" ")[0].substring(prefix.length);
        var cmd = commands[cmdTxt];
        var suffix = msg.content.substring(cmdTxt.length + prefix.length+1);
        if(cmd !== undefined) {
            cmd.process(msg, suffix);
        } else {
            cmdTxt = cmdTxt.replace('`', '');
            if (cmdTxt === ''){
                var cmdTxt = "none";
            }
            msg.channel.send(":warning: | **La commande** `" + cmdTxt + "` **n'existe pas** `" + prefix + "help`");
            console.log(msg.author.username + " a tenté de taper une commande... RT, sur le serveur " + msg.guild.name)
        }
    }
});
 
 
bot.login(process.env.TOKEN);
