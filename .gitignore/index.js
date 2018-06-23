const Discord = require("discord.js");
//const YTDL = require("ytdl-core");
//const fs = require("fs");
const request = require("request");

var bot = new Discord.Client();

let prefix = "."
let prefixLog = "[!]"

var http = "http://"

var website = "radiomodern.fr.mu"
, facebook = "facebook.com/radiomodern1/"
, twitter = "twitter.com/radiomodern_"
, paypal = "paypal.me/RadioModern"
, playtheradio = http + "radiomodern.playtheradio.com/"
, serv_discord = http + "discord.gg/4fDkbPw"
, twitch = http + "twitch.tv/radiomodern"
, add_bot = http + "discordapp.com/oauth2/authorize?&client_id=444951082750312468&scope=bot&permissions=37055552"

const servers = "411685426143690772"
, colors = 100

var footer = "Par Ilian, Zenfix, RisedSky et Tard0sTV ! ^^"

var partenaire_color = "#088A08"
, fondateur_color = "#FF0000"
, embed_color = "#04B404"

var separation = "><><><><><><><><><><><"

bot.on("ready", () => {

    var connection_embed = new Discord.RichEmbed()
        .setTitle("Je suis connecté")
        .setTimestamp()
        .setColor(embed_color)
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(connection_embed));

    bot.user.setActivity(prefix + "help | Démarré et prêt !");
    console.log(separation + "\n" + prefixLog + " Bot prêt\n" + prefixLog + " Merci à Ilian et RisedSky ! <3\n" + separation)

    setTimeout(state1, 5000);
    setTimeout(music, 1000);
    setTimeout(auto_radio, 1000);
    setInterval(changeColor, 600000);
})

bot.on("guildMemberAdd", member => {
    if(member.guild.id === "411685426143690772") {
        var notif_annonces_discord = member.guild.roles.find("name", "📢 | Notification : Annonces Discord")
        var notif_annonces_radio = member.guild.roles.find("name", "📢 | Notification : Annonces Radio")
        var notif_event = member.guild.roles.find("name", "📢 |  Notification : Event")
        var notif_promotion = member.guild.roles.find("name", "📢 |  Notification : Promotion")
        var notif_sondages = member.guild.roles.find("name", "📢 |  Notification : Sondages")
        member.addRole(notif_annonces_discord);
        member.addRole(notif_annonces_radio);
        member.addRole(notif_event);
        member.addRole(notif_promotion);
        member.addRole(notif_sondages);
    }
})

function auto_radio () {

    var channel_test = bot.channels.find("id", "456536141898973204");
    var channel_radiom = bot.channels.find("id", "432593928416657409");
    var channel_allah = bot.channels.find("id", "447711275481563137");
    var channel_slender = bot.channels.find("id", "434430059621777438");
    var channel_nota = bot.channels.find("id", "433305195925995520");
    var channel_draco = bot.channels.find("id", "447857184571916322");
    var channel_ilian = bot.channels.find("id", "449866282691592202");

    setTimeout(auto_radio_leave, 1);

    function auto_radio_join () {
        /*channel_test.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_test.name + '" (' + channel_test.guild.name + ')\n' + separation)
        })*/
        channel_radiom.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_radiom.name + '" (' + channel_radiom.guild.name + ')\n' + separation)
        })
        /*channel_allah.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_allah.name + '" (' + channel_allah.guild.name + ')\n' + separation)
        })*/
        channel_slender.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_slender.name + '" (' + channel_slender.guild.name + ')\n' + separation)
        })
        /*channel_nota.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_nota.name + '" (' + channel_nota.guild.name + ')\n' + separation)
        })*/
        channel_draco.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_draco.name + '" (' + channel_draco.guild.name + ')\n' + separation)
        })
        /*channel_ilian.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log('-> autojoin\n    + Salon "' + channel_ilian.name + '" (' + channel_ilian.guild.name + ')\n' + separation)
        })*/
        setTimeout(auto_radio_leave, 30 * 60 * 1000)
    }

    function auto_radio_leave () {
        channel_test.leave();
        channel_radiom.leave();
        channel_allah.leave();
        channel_slender.leave();
        channel_nota.leave();
        channel_draco.leave();
        //channel_ilian.leave();
        console.log('-> autojoin\n    - Salon [all]' + '\n' + separation)
        setTimeout(auto_radio_join, 1)
    }
}

function music() {

    let audit;
    
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
        audit = body + msgActivity;
    })

    var current_music;

    request("http://api.radionomy.com/currentsong.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);

        if (body == "Advert:TargetSpot - Advert:Targetspot ") {
            current_music = "Publicité"
        } else {
            current_music = body
        }
    })

    setTimeout(() => {
        bot.channels.findAll("name", "musique-radio-modern").forEach(c => c.bulkDelete(100));
        var music_embed = new Discord.RichEmbed()
            .setColor(embed_color)
            .addField('"' + current_music + '" écoutée par ' + audit, separation)
            .setFooter(footer)
            .setTimestamp();
        bot.channels.findAll("name", "musique-radio-modern").map(channel => channel.send(music_embed));
        setTimeout(music, 30 * 1000);
    }, 30 * 1000);
}

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
        bot.user.setActivity(prefix + "help | " + body + "" + msgActivity, {
            'type': 'STREAMING',
            'url': twitch
        }),
            bot.channels.findAll("name", "logs-activity").map(channel => channel.send(body + "" + msgActivity));
        setTimeout(state2, 5000);
    })
}

function state2() {
    request("http://api.radionomy.com/currentsong.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);

        if (body == "Advert:TargetSpot - Advert:Targetspot ") {
            bot.user.setActivity(prefix + "help | Publicité...", {
                'type': 'STREAMING',
                'url': twitch
            }),
                bot.channels.findAll("name", "logs-activity").map(channel => channel.send("Publicité..."));
            setTimeout(state4, 4000);
        } else {
            bot.user.setActivity(prefix + 'help | "' + body + '"', {
                'type': 'STREAMING',
                'url': twitch
            }),
                bot.channels.findAll("name", "logs-activity").map(channel => channel.send('"' + body + '"'));
            setTimeout(state3, 3000);
        }
    })
}

function state3() {
    bot.user.setActivity(prefix + "help | " + website, {
        'type': 'STREAMING',
        'url': twitch
    }),
        bot.channels.findAll("name", "logs-activity").map(channel => channel.send(website));
    setTimeout(state4, 3000);
}

function state4() {
    bot.user.setActivity(prefix + "help | " + footer, {
        'type': 'STREAMING',
        'url': twitch
    }),
        bot.channels.findAll("name", "logs-activity").map(channel => channel.send(footer));
    setTimeout(state1, 3000);
}

bot.on("message", async function (message) {
    if(message.author.equals(bot.user)) return;
    if(!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");
    var args2 = message.content.split(" ").slice(1);
    var suffix = args2.join(" ");
    if(message.guild.id === "411685426143690772" || message.guild.id === "449608267048681502" || message.guild.id === "449480119732666370" || message.guild.id === "337863843281764372" || message.guild.id === "370613023120818197" || message.guild.id === "417286290220777503" || message.guild.id === "447503386313621504" || message.guild.id === "403526817107148801" || message.guild.id === "381410501290098688") {
    //                      Radio Modern                                 Tard0sTV (test)                              Ilian's Community                           La Slendarmy                                 NotaServ                                     DracoBot                                     Allah Uakbar                                 ZIRIA                                        EdenCompany
        switch (args[0].toLowerCase()) {

        case "auto-radio":
            if(!message.author.id === "323039726040776705") return;
            message.delete();
            console.log("-> " + prefix + "auto-radio\n" + separation)
            setTimeout(auto_radio, 1);
        break;

        case "join":
            var channel = message.member.voiceChannel;
            if (!channel) return message.channel.send(":warning: | **Tu est pas dans un salon vocal.**");
            if (!message.member.voiceChannel.joinable) {
                message.channel.send(":warning: | **Je n'ai pas les permissions suffisantes pour diffuser la radio dans ce salon...**");
                return;
            }
            message.member.voiceChannel.join();
            message.channel.send(":loudspeaker: | **Je suis là !**");
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "join``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor(embed_color)
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "join\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            break;

        case "radiomodern": 
            var channel = message.member.voiceChannel;
            if (!channel) return message.channel.send(":warning: | **Tu n'est pas dans un salon vocal.**");
            message.member.voiceChannel.join().then(connection => {
                require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                    connection.playStream(res);
                })
            })
            var play_embed = new Discord.RichEmbed()
                .setColor(embed_color)
                .setAuthor(message.author.username + ' : Je joue actuellement la radio dans le salon "' + message.member.voiceChannel.name)
                .setFooter(footer)
                .setTimestamp()
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "play radio``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor(embed_color)
                .setTimestamp();
            message.channel.send(play_embed);
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "play\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            break;
    
        case "stop":
            var voiceChannel = message.member.voiceChannel;
            if (voiceChannel) {
                message.channel.send(":loudspeaker: | **Je suis plus là !**");
                message.member.voiceChannel.leave();
            } else {
                message.channel.send(":warning: | **Je ne suis pas dans un salon vocal.**");
                var log_embed = new Discord.RichEmbed()
                    .setThumbnail(message.author.displayAvatarURL)
                    .addField(message.author.username + " - Logs : ", "``" + prefix + "stop``")
                    .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
                    .setTimestamp();
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                console.log("-> " + prefix + "stop\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            }
            break;

        case "notif":
            var member = message.member;
            var notif_annonces_discord = member.guild.roles.find("name", "📢 | Notification : Annonces Discord")
            var notif_annonces_radio = member.guild.roles.find("name", "📢 | Notification : Annonces Radio")
            var notif_event = member.guild.roles.find("name", "📢 |  Notification : Event")
            var notif_promotion = member.guild.roles.find("name", "📢 |  Notification : Promotion")
            var notif_sondages = member.guild.roles.find("name", "📢 |  Notification : Sondages")
            let role_name;
            let role_status;
            message.delete()

            if (message.guild.id === "411685426143690772") {
                var notif_choix_embed = new Discord.RichEmbed()
                .setTitle("📢 " + message.author.username + " | Notifications")
                .addField(separation, "Cliquez sur les réactions correspondantes pour vous ajouter les rôles de notifications. Ils permettent de rester informé de l'actualité concernant la radio.")
                .addField(separation, "📢 : Annonces Discord\n🎵 : Annonces Radio\n🎉 : Event\n🔗 : Promotion\n❓ : Sondages")
                .setColor(embed_color)
                .setFooter(footer)
                .setTimestamp()
                const notif_choix = await message.channel.send(notif_choix_embed);
                await notif_choix.react("📢");
                await notif_choix.react("🎵");
                await notif_choix.react("🎉");
                await notif_choix.react("🔗");
                await notif_choix.react("❓");   
                let author_reaction = notif_choix.createReactionCollector((reaction, user) => user.id === message.author.id);
                author_reaction.on('collect', async(reaction) => {
                    if(reaction.emoji.name === "📢") {
                        if (message.member.roles.has("433614532691230721")) {
                            role_status = "retiré";
                            member.removeRole(notif_annonces_discord);
                        } else {
                            role_status = "ajouté";
                            member.addRole(notif_annonces_discord)
                        }
                        role_name = "Annonces Discord"
                    }
                    if(reaction.emoji.name === "🎵") {
                        if (message.member.roles.has("433614611376242688")) {
                            role_status = "retiré";
                            member.removeRole(notif_annonces_radio)
                        } else {
                            role_status = "ajouté";
                            member.addRole(notif_annonces_radio)
                        }
                        role_name = "Annonces Radio"
                    }
                    if(reaction.emoji.name === "🎉") {
                        if (message.member.roles.has("433614335512936448")) {
                            role_status = "retiré";
                            member.removeRole(notif_event)
                        } else {
                            role_status = "ajouté";
                            member.addRole(notif_event)
                        }
                        role_name = "Event"
                    }
                    if(reaction.emoji.name === "🔗") {
                        if (message.member.roles.has("433614466685599745")) {
                            role_status = "retiré";
                            member.removeRole(notif_promotion)
                        } else {
                            role_status = "ajouté";
                            member.addRole(notif_promotion)
                        }
                        role_name = "Promotion"
                    }
                    if(reaction.emoji.name === "❓") {
                        if (message.member.roles.has("433614254537572353")) {
                            role_status = "retiré";
                            member.removeRole(notif_sondages)
                        } else {
                            role_status = "ajouté";
                            member.addRole(notif_sondages)
                        }
                        role_name = "Sondages"
                    }
                    await reaction.remove(message.author.id);
                    let notif_message = "Rôle " + role_name + " " + role_status + " !"
                    const notif_embed = new Discord.RichEmbed()
                        .setColor(embed_color)
                        .addField(message.author.username + " : Notification", notif_message)
                        .setFooter(footer)
                        .setTimestamp()
                    message.author.send(notif_embed);
                    console.log("-> " + prefix + "notif " + role_name + " (" + role_status + ")\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
                    var log_embed = new Discord.RichEmbed()
                        .setThumbnail(message.author.displayAvatarURL)
                        .addField(message.author.username + " - Logs : ", "``" + prefix + "notif " + role_name + " (" + role_status + ")``")
                        .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                        .setFooter(footer)
                        .setColor(embed_color)
                        .setTimestamp();
                    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                })
            } else {
                const notif_serveur_incorrect_embed = new Discord.RichEmbed()
                    .setColor(embed_color)
                    .addField(message.author.username + " : Notification", 'Cette commande est seulement disponible dans le serveur "Radio Modern" : ' + serv_discord)
                    .setFooter(footer)
                    .setTimestamp()
                message.channel.send(notif_serveur_incorrect_embed);
            }
            break;
        
        case "botinfo": 
            var ping_embed = new Discord.RichEmbed()
                .addField(":clock2: Calcul en cours...", "Merci de patienter quelques instants !")
            let startTime = Date.now();
            var info_embed = new Discord.RichEmbed()
                .setColor(embed_color)
                .setTitle("Informations")
                .addField("Je suis sur", bot.guilds.array().length + " serveurs", true)
                .addField("Avec", bot.users.size + " membres", true)
            var pong_embed = new Discord.RichEmbed()
                .setColor(embed_color)
                .setTitle("Ping")
                .addField(":clock2: Ping :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "botinfo``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor(embed_color)
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            message.channel.send(info_embed);
            message.channel.send(ping_embed).then(m => m.edit(pong_embed));
            console.log("-> " + prefix + "botinfo\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            break;
        
        case "purge": 
            var messages_to_delete = 100
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.bulkDelete(messages_to_delete)
            } else {
                var miss_permission = new Discord.RichEmbed()
                    .setColor(embed_color)
                    .addField('Il te manque la permission "MANAGE_MESSAGES" pour pouvoir effectuer cette action.', separation)
                    .setFooter(footer)
                    .setTimestamp();
                message.channel.send(miss_permission);
            }
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "purge``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor(embed_color)
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            break;

        case "help":
            var help_musique_embed = new Discord.RichEmbed()
                .addField("🔊 Message d'aide | Musique", separation)
                .addField(prefix + "join", "Rejoindre ton salon vocal")
                .addField(prefix + "radiomodern", "Jouer la Radio Modern dans ton salon vocal")
                .addField(prefix + "stop", "Quitter ton salon vocal")
                .setColor("#00BFFF")
                .setFooter(footer)
                .setTimestamp()
            var help_currentmusic_embed = new Discord.RichEmbed()
                .addField("🎵", ".")
            var help_vcs_embed = new Discord.RichEmbed()
                .addField("🗒", ".")
            var help_notif_embed = new Discord.RichEmbed()
                .addField("📢 Message d'aide | Notifications", separation)
                .addField(prefix + "notif", "Permet d'ajouter les rôles de notifications qui permettent d'être informé des différentes informations concernant la radio. _(fonction disponible uniquement sur le serveur Radio Modern : " + serv_discord + ")_")
                .setColor("#DF0101")
                .setFooter(footer)
                .setTimestamp()
            var help_reseaux_embed = new Discord.RichEmbed()
                .setColor(embed_color)
                .addField("🔗 Message d'aide | Liens utiles", separation)
                .addField("🎵 Radio", "[-> Écouter](" + playtheradio + ")", true)
                .addField("<:discord:458984960095944704> Serveur Discord", "[-> Rejoindre](" + serv_discord + ")", true)
                .addField("🤖 Bot", "[-> Ajouter](" + add_bot + ")", true)
                .addField("<:facebook:432513421507035136> Facebook ", "[@radiomodern1](" + http + facebook + ")", true)
                .addField("<:twitter:432513453899382794> Twitter", "[@radiomodern_](" + http + twitter + ")", true)
                .addField(":money_with_wings: Paypal", "[-> Don](" + http + paypal + ")", true)
                .setTimestamp()
                .setFooter(footer)
            var help_other_embed = new Discord.RichEmbed()
                .addField("⚙ Message d'aide | Autre", separation)
                .addField(prefix + "botinfo", "Afficher les informations en rapport avec le bot et la Radio")
                .addField(prefix + "vcs {message}", "Envoyer un message VCS (__V__irtual __C__hat __S__erver) dans tout les serveurs où je suis. _(Seulement dans les salons #vcs-radiom)_")                
                .addField(prefix + "suggest {message}", "Envoyer une suggestion à faire part aux fondateurs/développeurs.")
                .setColor("#848484")
                .setFooter(footer)
                .setTimestamp()
            var help_sommaire_embed = new Discord.RichEmbed()
                .addField(":grey_question: Message d'aide | Sommaire", separation)
                .addField("🔊 **__Musique :__**", "-> Permet d'afficher toutes les commandes relatives à la radio")
                .addField("🎵 **__Musique en cours :__**", "-> Permet d'afficher comment utiliser le salon #musique-radio-modern")
                .addField("🗒 **__VCS :__**", "-> Permet d'afficher comment utiliser le VCS du bot")
                .addField("📢 **__Notifications :__**", "-> Permet d'afficher toutes les commandes relatives aux rôles notifications")
                .addField("🔗 **__Liens utiles :__**", "-> Permet d'afficher tous les liens relatifs à la radio")
                .addField("⚙ **__Autres :__**", "-> Permet d'afficher toutes les commandes diverses et variées")
                .setColor(embed_color)
                .setFooter(footer)
                .setTimestamp()
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "help``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor(embed_color)
    
            const help_sommaire = await message.channel.send(help_sommaire_embed);
            await help_sommaire.react("🔊");
            await help_sommaire.react("🎵");
            await help_sommaire.react("🗒");
            await help_sommaire.react("📢");
            await help_sommaire.react("🔗");
            await help_sommaire.react("⚙");

            let author_reaction = help_sommaire.createReactionCollector((reaction, user) => user.id === message.author.id);
            author_reaction.on('collect', async(reaction) => {
                if(reaction.emoji.name === "🔊") {
                    help_sommaire.edit(help_musique_embed);
                }
                if(reaction.emoji.name === "🎵") {
                    help_sommaire.edit(help_currentmusic_embed);
                }
                if(reaction.emoji.name === "🗒") {
                    help_sommaire.edit(help_vcs_embed);
                }
                if(reaction.emoji.name === "📢") {
                    help_sommaire.edit(help_notif_embed);
                }
                if(reaction.emoji.name === "🔗") {
                    help_sommaire.edit(help_reseaux_embed)
                }
                if(reaction.emoji.name === "⚙") {
                    help_sommaire.edit(help_other_embed)
                }
                await reaction.remove(message.author.id);
            })
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "help\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
        break;
            
        case "send":
            let xoargs = message.content.split(" ").slice(1);
            let suffix = xoargs.join(" ")
            var xo02 = message.guild.channels.find("name", "send-promotion");
            if (message.channel.name !== "send-promotion") return message.reply("Cette commande est à effectuer seulement dans le salon dans #send-promotion du serveur 'Radio Modern'.")
            if (!suffix) return message.reply("Merci de citer la publicité que vous souhaitez poster.")
            if (suffix.length > 255) return;
            var send_embed = new Discord.RichEmbed()
                .setColor(embed_color)
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
                .setColor(embed_color)
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            message.client.users.get("323039726040776705").send(send_embed)
            console.log("-> " + prefix + "suggest\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            break;

        case "suggest":
            let suggest = message.content.split(" ").slice(1);
            let suggestfix = suggest.join(" ")
            var xo02 = message.guild.channels.find("name", "suggestion-idees");
            if (!xo02) return message.reply("Le channel ``#suggestion-idees`` est introuvable !")
            if (message.channel.name !== "suggestion-idees") return message.reply("Cette commande est à effectuer seulement dans le salon dans ``#suggestion-idees``.")
            if (!sugestfix) return message.reply("Merci d'écrire votre suggestions.")
            if (suggestfix.length > 255) return;

            var suggest_embed = new Discord.RichEmbed()
                .setColor(embed_color)
                .addField(message.author.username + " - Suggestions : ", "``" + sugestfix + "``")
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
                .setColor(embed_color)
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "suggest\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            break;

        case "vcs":
            let vcsmog = message.content.split(" ").slice(1);
            let msgvcs = vcsmog.join(" ")
            var xo02 = message.guild.channels.find("name", "vcs-radiom");
            if (!xo02) return message.reply("Le channel #vcs-radiom est introuvable !")
            if (message.channel.name !== "vcs-radiom") return message.reply("Cette commande est à effectuer seulement dans le salon dans #vcs-radiom de n'importe quel serveur.")
            if (!msgvcs) return message.channel.send("Merci d'écrire un message à envoyer dans le VCS.")
            if (msgvcs.length > 255) return;
            if (message.author.id === "323039726040776705" || message.author.id === "182977157314772993") {
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
                    .addField("Contenu : " + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
                    .setTimestamp();
                message.delete()
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(fondateur_embed));
                console.log("-> " + prefix + "vcs\nAuteur : Fondateur " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
            } else if (message.author.id === "193092758267887616") {
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
                    .addField("Contenu : " + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
                    .setTimestamp();
                message.delete()
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(dev_embed));
                console.log("-> " + prefix + "vcs\nAuteur : Développeur " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
            } else if (message.author.id === "306768941210927104" || message.author.id === "417795915810603019" || message.author.id === "269916752564060170" || message.author.id === "140819107556753417" || message.author.id === "274240989944610827" || message.author.id === "370593040706043905") {
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
                    .addField("Contenu : " + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
                    .setTimestamp();
                message.delete()
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(partenaire_embed));
                console.log("-> " + prefix + "vcs\nAuteur : Partenaire " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
            } else if (message.author.id === "337863324983230474") {
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
                    .addField("Contenu : " + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
                    .setTimestamp();
                message.delete()
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(slender_embed));
                console.log("-> " + prefix + "vcs\nAuteur : Partenaire " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
            } else if (message.author.id === "306116635264024586") {
                const animateur_embed = new Discord.RichEmbed()
                    .setColor("#0080FF")
                    .addField("Animateur Discord " + message.author.username + " : VCS", separation)
                    .addField(msgvcs, separation)
                    .setThumbnail(message.author.avatarURL)
                    .setFooter('Provenance : "' + message.guild.name + '" | ' + footer)
                    .setTimestamp()
                var log_embed = new Discord.RichEmbed()
                    .setThumbnail(message.author.displayAvatarURL)
                    .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
                    .addField("Contenu : " + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
                    .setTimestamp();
                message.delete()
                bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
                bot.channels.findAll("name", "vcs-radiom").map(channel => channel.send(animateur_embed));
                console.log("-> " + prefix + "vcs\nAuteur : Animateur Discord " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  '" + msgvcs + "'\n" + separation);
            } else {
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
                    .addField("Contenu : " + msgvcs, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                    .setFooter(footer)
                    .setColor(embed_color)
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
                .setColor(embed_color)
                .setTimestamp();
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "listserv\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
            break;
        }
    } else {
    message.delete()
    message.channel.send(":arrow_right_hook: Ce serveur n'est pas autorisé à exécuter des commandes. Contactez Tard0sTV#8871 pour effectuer une demande d'ajout.")
    }
});


const size = colors;
const rainbow = new Array(size);
let place = 0;

for (var i = 0; i < size; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3);
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3);
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3);
    rainbow[i] = '#' + red + green + blue;
}

function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
}

function changeColor() {
    for (let index = 0; index < servers.length; ++index) {
        bot.guilds.get(servers).roles.find("name", "🎧 | Auditeurs").setColor(rainbow[place])

        if (place == (size - 1)) {
            place = 0;
        } else {
            place++;
        }
    }
}

bot.login(process.env.TOKEN);
