var Discord = require('discord.js');
var bot = new Discord.Client();
var config = require('./config.json');
const request = require("request");
console.log("Démarrage...");

var commands = {
    "join": {
        process: function (msg, suffix) {
			const channel = msg.member.voiceChannel;
			if (!channel) return msg.channel.send(':warning:  |  **Tu est pas dans un salon vocale.**');
			if(!msg.member.voiceChannel.joinable) {
				msg.channel.send(":warning:  |  **Je suis incapable de jouer de la musique sur ce canal..**");
				return;
			}
			msg.member.voiceChannel.join();
			msg.channel.send(":loudspeaker:  |  **Je suis là!**");
        }
	},
	
	"play": {
        process: function (msg, suffix) {
			const channel = msg.member.voiceChannel;
			if (!channel) return msg.channel.send(":warning:  |  **Tu n'est pas dans un salon vocal.**");
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
				msg.channel.send(":warning:  |  **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
			}
		}
	},
	
	"stop": {
		process: function (msg, suffix) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel) {
				msg.channel.send(":loudspeaker:  |  **Je suis plus la!**");
                msg.member.voiceChannel.leave();
            } else {
                msg.channel.send(":warning:  |  **Je ne suis pas dans un salon vocal.**");
            }
		}
	},
	
	"help": {
        process: function (msg, suffix) {
            var embed = new Discord.RichEmbed()
                 .addField(".join", "Pour que je rejoigne ton salon vocal.") 
                 .addField(".play radio", "Pour que je joue la radio dans ton salon vocal.")
                 .addField(".stop", "Pour que je quitte ton salon vocal.")
                 .addField(".botinfo", "Pour voir mes informations.")
                .setColor("#04B404")
                .setFooter("By Ilian !")
                .setAuthor("Radio Help")
                .setTimestamp()
                msg.channel.sendEmbed(embed)
        }
    },
    
    "botinfo": {
        process: function (msg, suffix) {
            var embed = new Discord.RichEmbed()
                .addField("Serveurs :", "Je suis sur " + bot.guilds.array().length + " serveurs")
                .addField("Membres :", "Je voit ``" + bot.users.size + " membres`` au total.")
                .setColor("#04B404")
                .setAuthor("Mes Information")
                msg.channel.sendEmbed(embed)
                var ping_embed = new Discord.RichEmbed()
                .addField(':clock2: Calcul en cours...', "Merci de patienter quelques instants !")
            let startTime = Date.now();
            msg.channel.send(ping_embed).then(msg => msg.edit(pong_embed));
            const fs = require("fs");
            var pong_embed = new Discord.RichEmbed()
                .setColor('#04B404')
                .setTitle('Mon Ping :')
                .setDescription(':ping_pong: Pong !')
                .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
                .setTimestamp()
                .setFooter("By Ilian^^ !")
        }
	}
};

bot.on('ready', () => {
   
    setTimeout(audience, 60000);
    setInterval(() => {
        audience()
    }, 60 * 1000);
    
    function audience() {
        request("http://api.radionomy.com/currentaudience.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
            if (error) return console.log(error);
    
            console.log("body: => " + body);
            console.log("response: => " + response);
    
            if (body == undefined) {
                bot.user.setActivity("? /shrug");
            } else {
                var msgActivity;
            if (parseInt(body) < 2) {
                msgActivity = "auditeur"
            } else {
                msgActivity = "auditeurs"
            }
            bot.user.setActivity(".help | " + body + " " + msgActivity);
            
            }
        });
    }
})

bot.on('message', function (msg) {
    if(msg.content.indexOf(config.prefix) === 0) {
		var cmdTxt = msg.content.split(" ")[0].substring(config.prefix.length);
		var cmd = commands[cmdTxt];
        var suffix = msg.content.substring(cmdTxt.length + config.prefix.length+1);
        if(cmd !== undefined) {
            cmd.process(msg, suffix);
        } else {
			cmdTxt = cmdTxt.replace('`', '');
			if (cmdTxt === ''){
				var cmdTxt = "none";
			}
            msg.channel.send(":warning:  |  **Cette commande** `" + cmdTxt + "` **n'existe pas** `" + config.prefix + "help`");
        }
    }
});


bot.login(process.env.TOKEN);
