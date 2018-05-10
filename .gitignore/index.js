var Discord = require('discord.js');
var bot = new Discord.Client();
var config = require('./config.json');
console.log("Démarrage...");

var commands = {
    "join": {
        process: function (msg, suffix) {
			if (msg.member.hasPermission("MANAGE_GUILD") == false) {
				msg.channel.send(":warning:  |  **Tu n'a pas accès a cette commande.**");
				return
			}
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
			if (msg.member.hasPermission("MANAGE_GUILD") == false) {
				msg.channel.send(":warning:  |  **Tu n'a pas accès a cette commande.**");
				return
			}
			const channel = msg.member.voiceChannel;
			if (!channel) return msg.channel.send(':warning:  |  **Tu nes pas dans un salon vocale.**');
			if (suffix) {
				if (suffix === "rmoerd" || suffix === "rmoerd") {
					msg.channel.send(":musical_note:  |  **En avant la** `musique !`");
					var radio = "RadioModern";
				} else {
					msg.channel.send(":warning:  |  **Erreur**");
					return;
				}
				msg.member.voiceChannel.join().then(connection => {
					require('http').get("http://streaming.radionomy.com/"+radio, (res) => {
						connection.playStream(res);
					})
				})
				.catch(console.error);
			} else {
				msg.channel.send(":warning:  |  **Erreur**");
			}
        }
    },
/*	"search": {
		process: function (msg, suffix) {
			const channel = msg.member.voiceChannel;
			if (!channel) return msg.channel.send(':warning:  |  **You are not on a voice channel.**');
			if (!suffix) {
				msg.channel.send(":warning:  |  **Insert a tag to search**");
				return;
			}
			msg.member.voiceChannel.join().then(connection => {
				require('http').get("http://streaming.radionomy.com/"+suffix, (res) => {
					connection.playStream(res);
				})
			})
			msg.channel.send(":musical_note:  |  **Searching and reproducing...**");
		}
	},*/
	"stop": {
		process: function (msg, suffix) {
			if (msg.member.hasPermission("MANAGE_GUILD") == false) {
				msg.channel.send(":warning:  |  **Tu n'a pas accès a cette commande.**");
				return
			}
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel) {
				msg.channel.send(":loudspeaker:  |  **Je suis plus la!**");
                msg.member.voiceChannel.leave();
            } else {
                msg.channel.send(":warning:  |  **Je ne suis pas dans un salon vocal.**");
            }
		}
	},

	"radiohelp": {
        process: function (msg, suffix) {
			if (msg.member.hasPermission("MANAGE_GUILD") == false) {
				msg.channel.send(":warning:  |  **Tu n'a pas accès a cette commande.**");
				return
			}
            var embed = new Discord.RichEmbed()
                 .addField(".join", "Pour que je rejoins le salon vocal !") 
                 .addField(".play rmoerd", "Pour commencer la Radio")
                 .addField(".stop", "Pour que je parte")          
                .setColor("#00ffcc")
                .setFooter("By Ilian !")
                .setAuthor("Pannel des Traduction")
                .setTimestamp()
                msg.channel.sendEmbed(embed)
        }
	},
	
	"help": {
        process: function (msg, suffix) {
            var embed = new Discord.RichEmbed()
                 .addField(".invite", "Pour que je rejoins le salon vocal !")           
                .setColor("#00ffcc")
                .setFooter("By Ilian !")
                .setAuthor("Pannel des Traduction")
                .setTimestamp()
                msg.channel.sendEmbed(embed)
        }
	},

	"invite": {
		process: function (msg, suffix) {
			msg.channel.send(":tickets:  |  **Liens d'invitation:** `https://discordapp.com/oauth2/authorize?client_id=444152913762451486&scope=bot&permissions=2146958591`");
		}
	}
};

bot.on("ready", function () {
	console.log("Logged in " + bot.guilds.array().length + " servers");
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
