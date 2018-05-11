var Discord = require('discord.js');
var bot = new Discord.Client();
var config = require('./config.json');
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
                 .addField(".join", "Pour que je rejoins le salon vocal !") 
                 .addField(".play radio", "Pour commencer la Radio")
                 .addField(".stop", "Pour que je parte") 
                .setColor("#00ffcc")
                .setFooter("By Ilian !")
                .setAuthor("Radio Help")
                .setTimestamp()
                msg.channel.sendEmbed(embed)
        }
	},

	"serveur": {
        process: function (msg, suffix) {
            var embed = new Discord.RichEmbed()
                .setColor("#00ffcc")
                .setFooter("By Ilian !")
                .setAuthor("Je suis sur  " + bot.guilds.array().length + " serveurs")
                .setTimestamp()
                msg.channel.sendEmbed(embed)
        }
	}
};

bot.on("ready", function () {
	console.log("Logged in " + bot.guilds.array().length + " serveurs");
	bot.user.setGame(config.prefix + "help" | " + bot.guilds.array().length + "); 
});

setInterval(function() {
	bot.user.setGame(config.prefix + "help | " + bot.guilds.array().length + " serveur(s)");
}, 100000)

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


bot.login('NDQ0MTUyOTEzNzYyNDUxNDg2.DdXxMQ.KKk9ljjYK0X0-ZHKeTrRJ9-RcfU');
