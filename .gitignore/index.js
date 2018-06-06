const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const fs = require("fs");
const request = require("request");
const mention = "@";
let prefix = "."
let prefixLog = "[!]"
var client = new Discord.Client();

var http = "http://"

var website = "radiomodern.fr.mu"
var facebook = "facebook.com/radiomodern1/"
var twitter = "twitter.com/radiomodern_"
var paypal = "paypal.me/RadioModern"
var twitch = "http://twitch.tv/radiomodern"

var footer = "Par Ilian ! ^^"

var partenaire_color = "#088A08"
var fondateur_color = "#FF0000"

var separation = "><><><><><><><><><><><"

var bot = new Discord.Client();

var servers = {};

bot.on("ready", (ready) => {
    var connection_embed = new Discord.RichEmbed()
    .setTitle("Je suis connecté")
    .setTimestamp()
    .setColor("#04B404")
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(connection_embed));


    bot.user.setActivity(prefix + "help | Démarré et prêt !");
    console.log(separation)
    console.log(prefixLog + " Bot créé par Ilian ! <3")
    console.log(prefixLog + " Bot prêt")
    console.log(separation)

    setTimeout(state1, 5000);
})

function state1() {
    request("http://api.radionomy.com/currentaudience.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);

        var msgActivity;

        if (body == undefined) {
            bot.user.setActivity("?");
        } else if (parseInt(body) < 2) {
                msgActivity = "auditeur"
            } else {
                msgActivity = "auditeurs"
            }
        bot.user.setActivity(prefix + "help | " + body + "" + msgActivity, twitch);
        bot.channels.findAll("name", "logs-activity").map(channel => channel.send(body + "" + msgActivity));
        setTimeout(state2, 10000);
    })
}

function state2() {
    request("http://api.radionomy.com/currentsong.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);

        if (body == "Advert:TargetSpot - Advert:Targetspot ") {
            bot.user.setActivity(prefix + "help | Publicité...", twitch)
            bot.channels.findAll("name", "logs-activity").map(channel => channel.send("Publicité..."));
        } else {
            bot.user.setActivity(prefix + 'help "' + body + '"', twitch);
            bot.channels.findAll("name", "logs-activity").map(channel => channel.send('"' + body + '"'));
            setTimeout(state3, 6000);
        }
    })
}

function state3() {
    bot.user.setActivity(prefix + "help | " + website, twitch);
    bot.channels.findAll("name", "logs-activity").map(channel => channel.send(website));
    setTimeout(state4, 4000);
}

function state4() {
    bot.user.setActivity(prefix + "help | Par Ilian ! (& RisedSky) ^^", twitch);
    bot.channels.findAll("name", "logs-activity").map(channel => channel.send("Par Ilian ! (& RisedSky) ^^"));
    setTimeout(state1, 4000);
}

bot.on("message", function (msg) {
    if (msg.content.indexOf(prefix) === 0) {
        var cmdTxt = msg.content.split(" ")[0].substring(prefix.length);
        var cmd = commands[cmdTxt];
        var member = msg.member;
        var suffix = msg.content.substring(cmdTxt.length + prefix.length + 1);
        if (cmd !== undefined) {
            cmd.process(msg, suffix);
        } else {
            cmdTxt = cmdTxt.replace("`", "");
            if (cmdTxt === "") {
                var cmdTxt = "none";
            }
        }
    }
});

var commands = {
    "join": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send(":warning: | **Tu est pas dans un salon vocal.**");
            if (!msg.member.voiceChannel.joinable) {
                msg.channel.send(":warning: | **Je n'ai pas les permissions suffisantes pour diffuser la radio dans ce salon...**");
                return;
            }
            msg.member.voiceChannel.join();
            msg.channel.send(":loudspeaker: | **Je suis là !**");
            var log_embed = new Discord.RichEmbed()
            .setThumbnail(msg.author.displayAvatarURL)
            .addField(msg.author.username + " - Logs : ", "``" + prefix + "join``")
            .addField(separation, "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
        console.log("-> " + prefix + "join\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
        }
    },

    "play": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send(":warning: | **Tu n'est pas dans un salon vocal.**");
            if (suffix) {
                if (suffix === "Radio" || suffix === "radio") {
                    msg.channel.send(":musical_note: | **Radio Modern**");
                    var radio = "RadioModern";
                    var log_embed = new Discord.RichEmbed()
                    .setThumbnail(msg.author.displayAvatarURL)
                    .addField(msg.author.username + " - Logs : ", "``" + prefix + "play radio``")
                    .addField(separation, "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor("#04B404")
                    .setTimestamp();
                    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
                console.log("-> " + prefix + "play\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
                } else {
                    msg.channel.send(":warning: | **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
                    return;
                }
                msg.member.voiceChannel.join().then(connection => {
                    require("http").get("http://streaming.radionomy.com/" + radio, (res) => {
                        connection.playStream(res);
                    })
                })
                    .catch(console.error);
            } else {
                msg.channel.send(":warning: | **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
            }
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
                var log_embed = new Discord.RichEmbed()
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(msg.author.username + " - Logs : ", "``" + prefix + "stop``")
                .addField(separation, "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "stop\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
            }
        }
    },

    "help": {
        process: function (msg, suffix) {
            var help_embed = new Discord.RichEmbed()                
                .setAuthor("Message d'aide")
                .addBlankField()
                .addField(prefix + "join", "Me faire venir dans ton salon vocal")
                .addBlankField()
                .addField(prefix + "play radio", "Me faire jouer la Radio Modern dans ton salon vocal")
                .addBlankField()
                .addField(prefix + "stop", "Me faire quitter ton salon vocal")
                .addBlankField()
                .addField(prefix + "botinfo", "T'afficher les informations en rapport avec le bot et la Radio")
                .addBlankField()
	            .addField(prefix + "vcs {message}", "Envoyer un message VCS (__V__irtual __C__hat __S__erver) dans tout les serveurs où je suis. _(Seulement dans les salons #vcs-radiom)_")
	            .addBlankField()
	            .addField(prefix + "suggest {message}", "Envoyer une suggestion à moi ou à la radio.")
	            .addBlankField()
                .setColor("#04B404")
                .setFooter(footer)
                .setTimestamp()
            msg.channel.send(help_embed)
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(msg.author.username + " - Logs : ", "``" + prefix + "help``")
                .addField(separation, "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "help\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
            },
    },

    "botinfo": {
        process: function (msg, suffix) {
            var ping_embed = new Discord.RichEmbed()
                .addField(":clock2: Calcul en cours...", "Merci de patienter quelques instants !")
            let startTime = Date.now();
            var info_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .setTitle("Informations")
                .addField("Je suis sur", bot.guilds.array().length + " serveurs", true)
                .addField("Avec", bot.users.size + " membres", true)
            var pong_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .setTitle("Ping")
                .addField(":clock2: Ping :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
            var reseaux_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .setTitle("Nos réseaux sociaux")
                .addField("<:facebook:432513421507035136> Facebook ", "[@radiomodern1](" + http + facebook + ")", true) 
                .addField("<:twitter:432513453899382794> Twitter", "[@radiomodern_](" + http + twitter + ")", true)
                .addField(":money_with_wings: Page de don", "[Notre PayPal](" + http + paypal + ")", true)
                .setTimestamp()
                .setFooter(footer)
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(msg.author.username + " - Logs : ", "``" + prefix + "botinfo``")
                .addField(separation, "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            msg.channel.send(info_embed);
            msg.channel.send(ping_embed).then(msg => msg.edit(pong_embed));
            msg.channel.send(reseaux_embed);
            console.log("-> " + prefix + "botinfo\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
        }
    },
    "purge": {
        process: function (msg, suffix) {
            var messages_to_delete = 100
            if(msg.member.hasPermission("MANAGE_MESSAGES")) {
                msg.channel.bulkDelete(messages_to_delete)
                var has_permission = new Discord.RichEmbed()
                    .setColor("#04B404")
                    .addField(messages_to_delete + ' messages ont correctement été supprimés', separation)
                    .setFooter(footer)
                    .setTimestamp();
                msg.channel.send(has_permission);
            } else {
                var miss_permission = new Discord.RichEmbed()
                    .setColor("#04B404")
                    .addField('Il te manque la permission "MANAGE_MESSAGES" pour pouvoir effectuer cette action.', separation)
                    .setFooter(footer)
                    .setTimestamp();
                msg.channel.send(miss_permission);
            }

            var log_embed = new Discord.RichEmbed()
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(msg.author.username + " - Logs : ", "``" + prefix + "purge``")
                .addField(separation, "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));    
        }
    }
}

bot.on("message", async function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");

    var reasontimed = args2.slice(2).join(" ")

    var user = message.mentions.users.first();

    var guild = message.guild;

    var member = message.member;

    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "send":
            let xoargs = message.content.split(" ").slice(1);
            let suffix = xoargs.join(" ")
            var xo02 = message.guild.channels.find("name", "send-promotion");
            if (message.channel.name !== "send-promotion") return message.reply("Cette commande est à effectuer seulement dans le salon dans #send-promotion du serveur 'Radio Modern'.")
            if (!suffix) return message.reply("Merci de citer la publicité que vous souhaitez poster.")
            var send_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .addField(message.author.username + " - Sa publicité : ", "```" + suffix + "```")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``", true)
                .setThumbnail(message.guild.iconURL)
                .setFooter(footer)
                .setTimestamp();
                message.delete()
            message.reply("Publicité envoyée avec succès :white_check_mark:")
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "send``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));    
            message.client.users.get("323039726040776705").send(send_embed)
            console.log("-> " + prefix + "suggest\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
            break;
		    
        case "suggest":
            let suggest = message.content.split(" ").slice(1);
            let sugesstfix = suggest.join(" ")
            var xo02 = message.guild.channels.find("name", "suggestion-idees");
	    if(!xo02) return message.reply("Le channel ``#suggestion-idees`` est introuvable !")		    
            if (message.channel.name !== "suggestion-idees") return message.reply("Cette commande est à effectuer seulement dans le salon dans ``#suggestion-idees``.")
            if (!sugesstfix) return message.reply("Merci d'écrire votre suggestions.")
            var suggest_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .addField(message.author.username + " - Suggestions : ", "``" + sugesstfix + "``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``", true)
                .setThumbnail(message.guild.iconURL)
                .setFooter(footer)
                .setTimestamp();
                message.delete()
            message.reply("Suggestions envoyée avec succès :white_check_mark:")
            message.client.users.get("193092758267887616").sendEmbed(suggest_embed)
            message.client.users.get("323039726040776705").sendEmbed(suggest_embed)			    
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "suggest``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));  
            console.log("-> " + prefix + "suggest\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);  	    
            break;   
    
    case "vcs":
    let vcsmog = message.content.split(" ").slice(1);
    let msgvcs = vcsmog.join(" ")
    var xo02 = message.guild.channels.find("name","vcs-radiom");
    if(!xo02) return message.reply("Le channel #vcs-radiom est introuvable !")
    if(message.channel.name !== "vcs-radiom") return message.reply("Cette commande est à effectuer seulement dans le salon dans #vcs-radiom de n'importe quel serveur.")
    if(!msgvcs) return message.channel.send("Merci d'écrire un message à envoyer dans le VCS.") 
    if(message.author.id === "323039726040776705" || message.author.id === "182977157314772993") {
        const fondateur_embed = new Discord.RichEmbed()
            .setColor(fondateur_color)
            .addField("Fondateur " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
        var log_embed = new Discord.RichEmbed()
            .setThumbnail(message.author.displayAvatarURL)
            .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
            .addField("Contenu : "  + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
    message.delete()
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(fondateur_embed));
    console.log("-> " + prefix + "vcs\nAuteur : Fondateur " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
    }else if(message.author.id === "193092758267887616") {
        const dev_embed = new Discord.RichEmbed()
            .setColor("#2E64FE")
            .addField("Développeur " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
        var log_embed = new Discord.RichEmbed()
            .setThumbnail(message.author.displayAvatarURL)
            .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
            .addField("Contenu : "  + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
    message.delete()
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(dev_embed));
    console.log("-> " + prefix + "vcs\nAuteur : Développeur " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
    }else if(message.author.id === "306768941210927104" || message.author.id === "417795915810603019" || message.author.id === "269916752564060170" || message.author.id === "140819107556753417" || message.author.id === "274240989944610827" || message.author.id === "370593040706043905") {
        const partenaire_embed = new Discord.RichEmbed()
            .setColor(partenaire_color)
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
        var log_embed = new Discord.RichEmbed()
            .setThumbnail(message.author.displayAvatarURL)
            .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
            .addField("Contenu : "  + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
    message.delete()
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(partenaire_embed));
    console.log("-> " + prefix + "vcs\nAuteur : Partenaire " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
    }else if(message.author.id === "337863324983230474") {
        const slender_embed = new Discord.RichEmbed()
            .setColor("#000000")
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
        var log_embed = new Discord.RichEmbed()
            .setThumbnail(message.author.displayAvatarURL)
            .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
            .addField("Contenu : "  + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
    message.delete()
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(slender_embed));
    console.log("-> " + prefix + "vcs\nAuteur : Partenaire " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
    }else if(message.author.id === "306116635264024586") {
        const animateur_embed = new Discord.RichEmbed()
            .setColor("#FF8000")
            .addField("Animateur Discord " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
        var log_embed = new Discord.RichEmbed()
            .setThumbnail(message.author.displayAvatarURL)
            .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
            .addField("Contenu : "  + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
    message.delete()
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(animateur_embed));
    console.log("-> " + prefix + "vcs\nAuteur : Animateur Discord " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
    }else{

    const vcs_embed = new Discord.RichEmbed()
        .setColor("#00FF00")
        .addField("Auditeur " + message.author.username + " : VCS", separation)
        .addField(msgvcs, separation)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
        .setTimestamp()
    message.delete()
    bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(vcs_embed));
    var log_embed = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
        .addField("Contenu : "  + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
        .setFooter(footer)
        .setColor("#04B404")
        .setTimestamp();
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 		
    console.log("-> " + prefix + "vcs\nAuteur : Auditeur " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
    }
    break;
		    
    case "listserv":
    message.channel.send("__**ATTENTION, SPAM POSSIBLE**__\n -> Nombre de serveurs : " + bot.guilds.size + "\n-> Nombre d'utilisateurs : " + bot.users.size + "\n\n__Liste complète des serveurs :__");
    var allservers = bot.guilds.array(); for (var i in allservers) {
    message.channel.send("-> `" + allservers[i].name + "`")
    }
    var log_embed = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .addField(message.author.username + " - Logs : ", "``" + prefix + "listserv``")
        .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
        .setFooter(footer)
        .setColor("#04B404")
        .setTimestamp();
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    console.log("-> " + prefix + "listserv\nAuteur : " + msg.author.username + "\nLocalisation : " + msg.guild.name + ", #" + msg.channel.name + "\n" + separation);
    break;
    }
});

bot.login(process.env.TOKEN);
