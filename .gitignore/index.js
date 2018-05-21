const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = ".";
const queue = new Map();
const request = require("request");
const mention = "@";
let prefix = "."
let prefixLog = "[!]"
var client = new Discord.Client();
var site = "http://radiomodern.fr.mu"

var bot = new Discord.Client();

var servers = {};

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
        }

        /*if (parseInt(body) > 8) {
            message.client.users.get("323039726040776705").send("Les bots ont crash...")
        }*/

        bot.user.setActivity(".help | " + body + "" + msgActivity);
        setTimeout(state2, 30000);
    })
}

function state2() {
    bot.user.setActivity(prefix + "help | " + bot.guilds.size + " serveurs, " + bot.users.size + " membres");
    setTimeout(state3, 5000);
}

function state3() {
    bot.user.setActivity(prefix + "help | " + site);
    setTimeout(state4, 5000);
}

function state4() {
    bot.user.setActivity(prefix + "help | Par Ilian ! ^^");
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
                msg.channel.send(":warning: | **Je n'ai pas les permissions suffisantes pour jouer de la musique sur ce canal..**");
                return;
            }
            msg.member.voiceChannel.join();
            msg.channel.send(":loudspeaker: | **Je suis là !**");
            console.log("La commande " + PREFIX +"join a été exécutée par " + message.author.username + " sur le serveur '" + message.guild.name )
            msg.guild.channels.find("name", "logs-radio").sendMessage("**" + msg.author.name + "** a utilisé ``" + prefix + "join`` dans le salon " + msg.channel +" !");
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
                console.log("La commande " + PREFIX +"play a été exécutée par " + message.author.username)
                msg.guild.channels.find("name", "logs-radio").sendMessage("**" + msg.author.name + "** a utilisé ``" + prefix + "play " + suffix + "`` dans le salon " + msg.channel +" !");
                } else {
                    msg.channel.send(":warning:  |  **Erreur**, la commande que vous souhaitez taper est ``.play radio``");
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
                console.log("La commande " + PREFIX +"stop a été exécutée par " + message.author.username)
                msg.guild.channels.find("name", "logs-radio").sendMessage("**" + msg.author.name + "** a utilisé ``" + prefix + "stop`` dans le salon " + msg.channel +" !");
            }


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
            console.log("La commande " + PREFIX +"help a été exécutée par " + message.author.username)
            msg.guild.channels.find("name", "logs-radio").sendMessage("**" + msg.author.name + "** a utilisé ``" + prefix + "help`` dans le salon " + msg.channel +" !");
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
                .setFooter("Par Ilian ! ^^")
            console.log("La commande " + PREFIX +"botinfo a été exécutée par " + message.author.username)
            msg.guild.channels.find("name", "logs-radio").sendMessage("**" + msg.author.name + "** a utilisé ``" + prefix + "botinfo`` dans le salon " + msg.channel +" !");
        }
    },
}

bot.on("message", async function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

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
            var vc_embed = new Discord.RichEmbed()
                .setColor("#04B404")
                .addField(message.author.username + " - Sa publicité : ", suffix)
                .addField("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", "Provenance du message : ``" + message.guild.name + "``", true)
                .setThumbnail(message.guild.iconURL)
                .setFooter("Par Ilian ! ^^")
                .setTimestamp();
                message.delete()
            console.log("La commande " + PREFIX +"send a été exécutée par " + message.author.username)
            message.guild.channels.find("name", "logs-radio").sendMessage("**" + message.author.name + "** a utilisé ``" + PREFIX + "join " + suffix + "`` dans le salon " + message.channel +" !");
            message.client.users.get("323039726040776705").send(vc_embed)
            break;
    }
});

bot.login(process.env.TOKEN);
