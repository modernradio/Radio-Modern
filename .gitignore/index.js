const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const queue = new Map();
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

var footer = "Par Ilian ! ^^"

var partenaire_color = "#088A08"
var fondateur_color = "#FF0000"

var separation = "><><><><><><><><><><><"
//var vcs_log = 

var bot = new Discord.Client();

var servers = {};

bot.on('ready', (ready) => {
    var connection_embed = new Discord.RichEmbed()
    .setTitle("Je suis connecté")
    .setTimestamp()
    .setColor("#04B404")
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(connection_embed));


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
        }
        bot.user.setActivity(prefix + "help | " + body + "" + msgActivity);
        setTimeout(state2, 15000);
    })
}

function state2() {
    request("http://api.radionomy.com/currentsong.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);

        bot.user.setActivity(prefix + 'help "' + body + '"');
        setTimeout(state3, 5000);
    })
}

function state3() {
    bot.user.setActivity(prefix + "help | " + bot.guilds.size + " serveurs, " + bot.users.size + " membres");
    setTimeout(state4, 2000);
}

function state4() {
    bot.user.setActivity(prefix + "help | " + website);
    setTimeout(state5, 2000);
}

function state5() {
    bot.user.setActivity(prefix + "help | Par Ilian ! (& RisedSky) ^^");
    setTimeout(state1, 2000);
}

bot.on('message', function (msg) {
    if (msg.content.indexOf(prefix) === 0) {
        var cmdTxt = msg.content.split(" ")[0].substring(prefix.length);
        var cmd = commands[cmdTxt];
        var member = msg.member;
        var suffix = msg.content.substring(cmdTxt.length + prefix.length + 1);
        if (cmd !== undefined) {
            cmd.process(msg, suffix);
        } else {
            cmdTxt = cmdTxt.replace('`', '');
            if (cmdTxt === '') {
                var cmdTxt = "none";
            }
        }
    }
});

var commands = {
    "join": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send(':warning: | **Tu est pas dans un salon vocal.**');
            if (!msg.member.voiceChannel.joinable) {
                msg.channel.send(":warning: | **Je n'ai pas les permissions suffisantes pour diffuser la radio dans ce salon...**");
                return;
            }
            msg.member.voiceChannel.join();
            msg.channel.send(":loudspeaker: | **Je suis là !**");
            var log_embed = new Discord.RichEmbed()
            .setThumbnail(msg.author.displayAvatarURL)
            .addField(msg.author.username + " - Logs : ", "``" + prefix + "join``")
            .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
            .setFooter(footer)
            .setColor("#04B404")
            .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
        console.log("-> " + prefix + "join");
        console.log("Auteur : " + msg.author.username);
        console.log("Localisation : " + msg.guild.name + ", #" + msg.channel.name);
        console.log("------------------------------");
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
                    .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor("#04B404")
                    .setTimestamp();
                    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
                console.log("-> " + prefix + "play radio");
                console.log("Auteur : " + msg.author.username);
                console.log("Localisation : " + msg.guild.name + ", #" + msg.channel.name);
                console.log("------------------------------");
                } else {
                    msg.channel.send(":warning: | **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
                    return;
                }
                msg.member.voiceChannel.join().then(connection => {
                    require('http').get("http://streaming.radionomy.com/" + radio, (res) => {
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
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "stop");
            console.log("Auteur : " + msg.author.username);
            console.log("Localisation : " + msg.guild.name + ", #" + msg.channel.name);
            console.log("------------------------------");
            }
        }
    },

    "help": {
        process: function (msg, suffix) {
            var help_embed = new Discord.RichEmbed()
                .addBlankField()
                .addField(prefix + "join", "Pour que je rejoigne ton salon vocal.")
                .addBlankField()
                .addField(prefix + "play radio", "Pour que je joue la radio dans ton salon vocal.")
                .addBlankField()
                .addField(prefix + "stop", "Pour que je quitte ton salon vocal.")
                .addBlankField()
                .addField(prefix + "botinfo", "Pour voir mes informations.")
                .addBlankField()
	            .addField(prefix + "vcs [message]", "Pour envoyer un message VCS (__V__irtual __C__hat __S__erver) dans tout les serveurs où je suis. (Seulement dans les salons #vcs-radiom)")
	            .addBlankField()
	            .addField(prefix + "suggest [message]", "Pour envoyer une suggestions pour moi ou la radio.")
	            .addBlankField()
                .setColor("#04B404")
                .setFooter(footer)
                .setAuthor("Message d'aide")
                .setTimestamp()
                msg.channel.send(help_embed)
                var log_embed = new Discord.RichEmbed()
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(msg.author.username + " - Logs : ", "``" + prefix + "help``")
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "help");
            console.log("Auteur : " + msg.author.username);
            console.log("Localisation : " + msg.guild.name + ", #" + msg.channel.name);
            console.log("------------------------------");
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
            var reseaux_embed = new Discord.RichEmbed()
                .setColor('#04B404')
                .setTitle("Nos réseaux sociaux")
                .addField("<:facebook:432513421507035136> Facebook ", "[@radiomodern1](" + http + facebook + ")") 
                .addField("<:twitter:432513453899382794> Twitter", "[@radiomodern_](" + http + twitter + ")", true)
                .addField(":money_with_wings: Page de don", "[Notre PayPal](" + http + paypal + ")", true)
                .setTimestamp()
                .setFooter(footer)
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(msg.author.displayAvatarURL)
                .addField(msg.author.username + " - Logs : ", "``" + prefix + "botinfo``")
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            msg.channel.send(reseaux_embed);
            console.log("-> " + prefix + "botinfo");
            console.log("Auteur : " + msg.author.username);
            console.log("Localisation : " + msg.guild.name + ", #" + msg.channel.name);
            console.log("------------------------------");
        }
    },
    "purge": {
        process: function (msg, suffix) {
            msg.delete(1000)
            var log_embed = new Discord.RichEmbed()
            .setThumbnail(msg.author.displayAvatarURL)
            .addField(msg.author.username + " - Logs : ", "``" + prefix + "purge``")
            .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + msg.guild.name + "``\nDans le salon ``#" + msg.channel.name + "``", true)
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

    var reasontimed = args2.slice(2).join(' ')

    var user = message.mentions.users.first();

    var guild = message.guild;

    var member = message.member;

    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "send":
            let xoargs = message.content.split(" ").slice(1);
            let suffix = xoargs.join(' ')
            var xo02 = message.guild.channels.find('name', 'send-promotion');
            if (message.channel.name !== 'send-promotion') return message.reply("Cette commande est à effectuer seulement dans le salon dans #send-promotion du serveur 'Radio Modern'.")
            if (!suffix) return message.reply("Merci de citer la publicité que vous souhaitez poster.")
            var send_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .addField(message.author.username + " - Sa publicité : ", "```" + suffix + "```")
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + message.guild.name + "``", true)
                .setThumbnail(message.guild.iconURL)
                .setFooter(footer)
                .setTimestamp();
                message.delete()
            message.reply("Publicité envoyée avec succès :white_check_mark:")
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "send``")
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));    
            message.client.users.get("323039726040776705").send(send_embed)
            break;
		    
        case "suggest":
            let suggest = message.content.split(" ").slice(1);
            let sugesstfix = suggest.join(' ')
            var xo02 = message.guild.channels.find('name', 'suggestion-idees');
	    if(!xo02) return message.reply("Le channel ``#suggestion-idees`` est introuvable !")		    
            if (message.channel.name !== 'suggestion-idees') return message.reply("Cette commande est à effectuer seulement dans le salon dans ``#suggestion-idees``.")
            if (!sugesstfix) return message.reply("Merci d'écrire votre suggestions.")
            var suggest_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .addField(message.author.username + " - Suggestions : ", "``" + sugesstfix + "``")
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + message.guild.name + "``", true)
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
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor("#04B404")
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));    	    
            break;   
    
    case "vcs":
    let vcsmog = message.content.split(" ").slice(1);
    let msgvcs = vcsmog.join(' ')
    var xo02 = message.guild.channels.find('name','vcs-radiom');
    if(!xo02) return message.reply("Le channel #vcs-radiom est introuvable !")
    if(message.channel.name !== 'vcs-radiom') return message.reply("Cette commande est à effectuer seulement dans le salon dans #vcs-radiom de n'importe quel serveur.")
    if(!msgvcs) return message.channel.send("Merci d'écrire un message à envoyer dans le VCS.") 
    if(message.author.id === "323039726040776705" || message.author.id === "182977157314772993") {
    const fondateur1_embed = new Discord.RichEmbed()
        .setColor(fondateur_color)
        .addField("Fondateur " + message.author.username + " : VCS", separation)
        .addField(msgvcs, separation)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(fondateur1_embed));
    console.log("-> " + prefix + "vcs\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  " + msgvcs);/*
    }else if(message.author.id === "182977157314772993") {
    const fondateur2_embed = new Discord.RichEmbed()
    .setColor(fondateur_color)
    .addField("Fondateur " + message.author.username + " : VCS", separation)
    .addField(msgvcs, separation)
    .setThumbnail(message.author.avatarURL)
    .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
    .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(fondateur2_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");*/
    }else if(message.author.id === "193092758267887616") {
    const dev_embed = new Discord.RichEmbed()
        .setColor("#2E64FE")
        .addField("Développeur " + message.author.username + " : VCS", separation)
        .addField(msgvcs, separation)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(dev_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "306768941210927104") {
    const partenaire1_embed = new Discord.RichEmbed()
        .setColor(partenaire_color)
        .addField("Partenaire " + message.author.username + " : VCS", separation)
        .addField(msgvcs, separation)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire1_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "337863324983230474") {
        const partenaire2_embed = new Discord.RichEmbed()
            .setColor("#000000")
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire2_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "417795915810603019") {
        const partenaire3_embed = new Discord.RichEmbed()
            .setColor(partenaire_color)
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire3_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "269916752564060170") {
        const partenaire4_embed = new Discord.RichEmbed()
            .setColor(partenaire_color)
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire4_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "140819107556753417") {
        const partenaire5_embed = new Discord.RichEmbed()
            .setColor(partenaire_color)
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire5_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "274240989944610827") {
        const partenaire6_embed = new Discord.RichEmbed()
            .setColor(partenaire_color)
            .addField("Partenaire " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire6_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "370593040706043905") {
        const partenaire7_embed = new Discord.RichEmbed()
        .setColor(partenaire_color)
        .addField("Partenaire " + message.author.username + " : VCS", separation)
        .addField(msgvcs, separation)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(partenaire7_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else if(message.author.id === "306116635264024586") {
        const animateur_embed = new Discord.RichEmbed()
            .setColor("#FF8000")
            .addField("Animateur Discord " + message.author.username + " : VCS", separation)
            .addField(msgvcs, separation)
            .setThumbnail(message.author.avatarURL)
            .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
            .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-radiom').map(channel => channel.send(animateur_embed));
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
    }else{

    const vcs_embed = new Discord.RichEmbed()
        .setColor("#00FF00")
        .addField("Auditeur " + message.author.username + " : VCS", separation)
        .addField(msgvcs, separation)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', "vcs-radiom").map(channel => channel.send(vcs_embed));
    var log_embed = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
        .addField("_____________________", "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
        .setFooter(footer)
        .setColor("#04B404")
        .setTimestamp();
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 		
    console.log("-> " + prefix + "vcs");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("Contenu : \n          " + msgvcs);
    console.log("------------------------------");
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
        .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
        .setFooter(footer)
        .setColor("#04B404")
        .setTimestamp();
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    console.log("-> " + prefix + "listserv");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("------------------------------");
    break;
		    
    case "servlist":
    message.channel.send("__**ATTENTION, SPAM POSSIBLE**__\n -> Nombre de serveurs : " + bot.guilds.size + "\n-> Nombre d'utilisateurs : " + bot.users.size + "\n\n__Liste complète des serveurs :__");
    var allservers = bot.guilds.array(); for (var i in allservers) {
    message.channel.send("-> " + allservers[i].name)
    }
    var log_embed = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .addField(message.author.username + " - Logs : ", "``" + prefix + "listserv``")
    	.addBlancField()
        .addField("Provenance du message : ``" + message.guild.name + "``", "Dans le salon ``#" + message.channel.name + "``", true)
        .setFooter(footer)
        .setColor("#04B404")
        .setTimestamp();
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed)); 
    console.log("-> " + prefix + "listserv");
    console.log("Auteur : " + message.author.username);
    console.log("Localisation : " + message.guild.name + ", #" + message.channel.name);
    console.log("------------------------------");
    break;		    
    }
});

bot.login(process.env.TOKEN);
