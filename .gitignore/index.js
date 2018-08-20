const Discord = require("discord.js");
//const YTDL = require("ytdl-core");
//const fs = require("fs");
const request = require("request");

var bot = new Discord.Client();

const pubRecently = new Set();

let prefix = "."
let prefixLog = "[!]"

var channel_vcs_name = "vcs-radiom"

var http = "http://"

var website = "radiomodern.fr.mu"
, facebook = "facebook.com/radiomodern1/"
, twitter = "twitter.com/radiomodern_"
, paypal = "paypal.me/RadioModern"
, playtheradio = http + "radiomodern.playtheradio.com/"
, serv_discord = http + "discord.gg/4fDkbPw"
, add_bot = http + "discordapp.com/oauth2/authorize?&client_id=444951082750312468&scope=bot&permissions=37055552"

const servers = "411685426143690772"
, colors = 100

var contributors = "Ilian, Tard0sTV, Zenfix & RisedSky"
var footer = "Par " + contributors + " ! ^^"

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

    bot.user.setActivity("Radio Modern", {
        "type": "LISTENING",
    }),
    
    console.log(separation + "\n" + prefixLog + " Bot prêt\n" + prefixLog + " Merci à " + contributors +  " ! <3\n" + separation);

    setTimeout(state_audit, 5 * 1000);
    setTimeout(music, 1 * 1000);
    setTimeout(auto_radio, 1* 1000);
    //setTimeout(changeColor, 60000);
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

    var channel_radiom = bot.channels.find("id", "432593928416657409");
    var channel_slender = bot.channels.find("id", "434430059621777438");
    var channel_draco = bot.channels.find("id", "472819973220204565");
    var channel_panda = bot.channels.find("id", "444908046590803968");
    var channel_ziria = bot.channels.find("id", "403608851854786562");
    
    setTimeout(auto_radio_leave, 1);

    function auto_radio_join () {
        channel_radiom.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log("-> autojoin\n    + Salon \"" + channel_radiom.name + "\" (" + channel_radiom.guild.name + ")\n" + separation)
        })
        channel_slender.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log("-> autojoin\n    + Salon \"" + channel_slender.name + "\" (" + channel_slender.guild.name + ")\n" + separation)
        })
        /*channel_draco.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log("-> autojoin\n    + Salon \"" + channel_draco.name + "\" (" + channel_draco.guild.name + ")\n" + separation)
        })*/
        channel_panda.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log("-> autojoin\n    + Salon \"" + channel_panda.name + "\" (" + channel_panda.guild.name + ")\n" + separation)
        })
        /*channel_ziria.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
            console.log("-> autojoin\n    + Salon \"" + channel_ziria.name + "\" (" + channel_ziria.guild.name + ")\n" + separation)
        })*/
        setTimeout(auto_radio_leave, 15 * 60 * 1000)
    }

    function auto_radio_leave () {
        channel_radiom.leave();
        channel_slender.leave();
        //channel_draco.leave();
        channel_panda.leave();
        //channel_ziria.leave();
        console.log("-> autojoin\n    - Salon [all]" + "\n" + separation)
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
            .addField("\"" + current_music + "\" écoutée par " + audit, separation)
            .setFooter(footer)
            .setTimestamp();
        bot.channels.findAll("name", "musique-radio-modern").map(channel => channel.send(music_embed));
        setTimeout(music, 20 * 1000);
    }, 20 * 1000);
}

function state_audit() {
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
            "type": "LISTENING",
        }),
        setTimeout(state_music, 10 * 1000);
    })
}

function state_music() {
    request("http://api.radionomy.com/currentsong.cfm?radiouid=5d198d45-3ee5-4dee-8182-4ee0184d41f1&apikey=15355fc0-4344-4ff7-a795-8efa38742083", (error, response, body) => {
        if (error) return console.log(error);

        if (body == "Advert:TargetSpot - Advert:Targetspot ") {
            bot.user.setActivity(prefix + "help | Publicité...", {
                "type": "LISTENING",
            }),
            setTimeout(state_website, 5 * 1000);
        } else {
            bot.user.setActivity(prefix + "help | \"" + body + "\"", {
                "type": "LISTENING",
            }),
            setTimeout(state_website, 10 * 1000);
        }
    })
}

function state_website() {
    bot.user.setActivity(prefix + "help | " + website, {
        "type": "LISTENING",
    }),
    setTimeout(state_audit, 5 * 1000);
}

bot.on("message", async function (message) {
    if(message.author.equals(bot.user)) return;
    if(!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");
    var xoargs = message.content.split(" ").slice(1);
    var args1 = xoargs.join(" ");
    var args2 = xoargs.slice(1).join(" ");
    var args3 = xoargs.slice(2).join(" ");
    if(message.guild.id === "411685426143690772" || message.guild.id === "449608267048681502" || message.guild.id === "449480119732666370" || message.guild.id === "337863843281764372" || message.guild.id === "370613023120818197" || message.guild.id === "417286290220777503" || message.guild.id === "447503386313621504" || message.guild.id === "403526817107148801" || message.guild.id === "381410501290098688" || message.guild.id === "319471323845885952" || message.guild.id === "374986045458087951" || message.guild.id === "418420380722528256" || message.guild.id === "432532720158244866") {
    //                      Radio Modern                                 Tard0sTV (test)                              Ilian's Community                           La Slendarmy                                 NotaServ                                     DracoBot                                     Allah Uakbar                                 ZIRIA                                        EdenCompany                                   PandaGamers                                  La Boulangerie                               Universus League                           Supers Fanne | Officiel
        switch (args[0].toLowerCase()) {

            case "pub":
            
            var no_args = "Vous n'avez pas écrit de nom de publicité. "
            var liste_pub_intro = "Voici la liste de vos publicités disponibles : ";

            var liste_pub_draco = "`Dev_Help_Center`, `DracoBot`"
            var liste_pub_eden = "`EdeN_Company`, `Ziria`"
            var liste_pub_lambr = "`PandaGamers`"
            var liste_pub_nota = "`NotaServ`"
            var liste_pub_slender = "`Slendarmy`"

            var pub_devhelpcenter = "Bonjour aujourd'hui je vais te présenter un beau projet :grin:  Je suis Draco1544, le fondateur de **Dev Help Center** que je vais te présenter :\n\n```css\n🔸une communauté sympa de 50 membres qui s'agrandit avec votre venue 😃\n🔹un staff sérieux, compétent et respectueux de tous, mais aussi sympa 👍\n🔸des bot utiles et par comme mee6, koya, dyna, et bien d'autres 👽\n🔹des salons et des rôles bien organisés et diversifiés 🆒\n🔸des salons de développement organisés par langages 💻\n❔ Pour le reste nous comptons tout simplement sur ta curiosité pour venir ❔\n```\n\nAlors si cette courte description :point_up_2: t'as plu pourquoi pas nous rejoindre ? Ce serait bête de manquer ça... :pensive:\nPense à prendre ton ticket :tickets: https://discord.gg/ZA3Qjz7"
            var pub_dracobot = " "
            var pub_edencompany = " "
            var pub_ziria = " "
            var pub_panda = " "
            var pub_nota = " "
            var pub_slender = " "

            if(message.author.id !== "323039726040776705") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
            // à supprimer
            //if(message.channel.id !== "478263755772264459") return message.channel.send("Cette commande est à effectuer seulement dans le salon dans #send-promotion du serveur \"Radio Modern\".")
            if(message.channel.id !== "481120206853505054") return message.channel.send("Cette commande est à effectuer seulement dans le salon dans #send-promotion du serveur \"Radio Modern\".")

            if(!args1) {

                switch(message.author.id) {

                    case "370593040706043905":
                        message.channel.send(message.author.username + " - " + liste_pub_intro + liste_pub_draco);
                    break;

                    case "417795915810603019":
                        message.channel.send(message.author.username + " - " + liste_pub_intro + liste_pub_eden);
                    break;

                    case "319470633593339914":
                        message.channel.send(message.author.username + " - " + liste_pub_intro + liste_pub_lambr);
                    break;
                
                    case "306768941210927104":
                        message.channel.send(message.author.username + " - " + liste_pub_intro + liste_pub_nota);
                    break;
                
                    case "337863324983230474":
                        message.channel.send(message.author.username + " - " + liste_pub_intro + liste_pub_slender);
                    break;

                    default:
                        message.channel.send("Tu n'as pas de publicité de disponible.")
                        if (message.member.roles.has("428556268546818048") || message.member.roles.has("428556458985127941") || message.member.roles.has("428556304097869835")) return message.channel.send("Pour effectuer une demande d'ajout de votre publicité, tapez `" + prefix + "`pub submit <publicité>")
                    break;
                }

            } else if(args1.startsWith("show")) {

                if(args2) {

                    switch(args2) {

                        case "Dev_Help_Center":
                            if(message.author.id !== "370593040706043905") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `Dev_Help_Center` :\n\n" + pub_devhelpcenter)
                        break;

                        case "DracoBot":
                            if(message.author.id !== "370593040706043905") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `DracoBot` :\n\n" + pub_dracobot)
                        break;

                        case "EdeN_Company":
                            if(message.author.id !== "417795915810603019") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `EdeN_Company` :\n\n" + pub_edencompany)
                        break;

                        case "Ziria":
                            if(message.author.id !== "417795915810603019") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `Ziria` :\n\n" + pub_ziria)
                        break;

                        case "PandaGamers":
                            if(message.author.id !== "319470633593339914") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `PandaGamers` :\n\n" + pub_panda)
                        break;

                        case "NotaServ":
                            if(message.author.id !== "306768941210927104") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `NotaServ` :\n\n" + pub_nota)
                        break;

                        case "Slendarmy":
                            if(message.author.id !== "337863324983230474") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici la publicité enregistrée pour le serveur `Slendarmy` :\n\n" + pub_slender)
                        break;
                    }

                } else {

                    switch(message.author.id) {

                        case "370593040706043905":
                            message.channel.send(message.author.username + " - " + no_args + liste_pub_intro + liste_pub_draco);
                        break;
    
                        case "417795915810603019":
                            message.channel.send(message.author.username + " - " + no_args + liste_pub_intro + liste_pub_eden);
                        break;
    
                        case "319470633593339914":
                            message.channel.send(message.author.username + " - " + no_args + liste_pub_intro + liste_pub_lambr);
                        break;
                    
                        case "306768941210927104":
                            message.channel.send(message.author.username + " - " + no_args + liste_pub_intro + liste_pub_nota);
                        break;
                    
                        case "337863324983230474":
                            message.channel.send(message.author.username + " - " + no_args + liste_pub_intro + liste_pub_slender);
                        break;
    
                        default:
                            message.channel.send("Vous n'avez aucune publicité à afficher.")
                            if (message.member.roles.has("428556268546818048") || message.member.roles.has("428556458985127941") || message.member.roles.has("428556304097869835")) return message.channel.send("Pour effectuer une demande d'ajout de votre publicité, tapez `" + prefix + "`pub submit <publicité>")
                        break;
                    }
                }
            } else if(args1.startsWith("send")) {

                if(args2) {

                        if(args3.startsWith("confirm")) {
                            switch(args2) {
                                case "Dev_Help_Center":
                                //if(message.author.id !== "370593040706043905") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if(message.author.id !== "323039726040776705") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                /*if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    //bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    bot.channels.find("id", "481120235307401227").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }*/
                                message.channel.send("Hey");
                                break;
    
                                case "DracoBot":
                                if(message.author.id !== "370593040706043905") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }
    
    
                                break;
    
                                case "EdeN_Company":
                                if(message.author.id !== "417795915810603019") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }
    
    
                                break;
    
                                case "Ziria":
                                if(message.author.id !== "417795915810603019") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }
    
    
                                break;
    
                                case "PandaGamers":
                                if(message.author.id !== "319470633593339914") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }
    
    
                                break;
    
                                case "NotaServ":
                                if(message.author.id !== "306768941210927104") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }
    
    
                                break;
    
                                case "Slendarmy":
                                if(message.author.id !== "337863324983230474") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                                if (pubRecently.has(message.author.id)) {
                                    message.channel.send("Il y a un cooldown de 7 jours entre chaque publicité");
                                } else {
                                    bot.channels.find("id", "478263755772264459").map(c => c.send("__**PUBLICITÉ DE <@" + message.author.id + "> :**__ _(partenariat)_\n\n" + pub_devhelpcenter + "\n\n[<@&433614466685599745>]"));
                                    pubRecently.add(message.author.id);
                                    setTimeout(() => {
                                        pubRecently.delete(message.author.id);
                                    }, 7 * 24 * 60 * 60 * 1000);
                                }
    
    
                                break;
                            }
                    }

                    if(!args3 || args3 !== "confirm") {

                        switch(args2) {

                            case "Dev_Help_Center":
                            if(message.author.id !== "370593040706043905") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_devhelpcenter)
                            break;

                            case "DracoBot":
                            if(message.author.id !== "370593040706043905") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_dracobot)
                            break;

                            case "EdeN_Company":
                            if(message.author.id !== "417795915810603019") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_edencompany)
                            break;

                            case "Ziria":
                            if(message.author.id !== "417795915810603019") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_ziria)
                            break;

                            case "PandaGamers":
                            if(message.author.id !== "319470633593339914") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_panda)
                            break;

                            case "NotaServ":
                            if(message.author.id !== "306768941210927104") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_nota)
                            break;

                            case "Slendarmy":
                            if(message.author.id !== "337863324983230474") return message.channel.send("Tu n'es pas autorisé à effectuer cela")
                            message.channel.send("Voici votre publicité, vérifiez que c'est bien celle-la, si oui, retapez cette commande suivie de `confirm` pour confirmer votre envoi, si non, envoyez un message à Tard0sTV pour corriger les éventuelles erreurs :\n\n" + pub_slender)
                            break;

                            default:
                            message.channel.send("Cette publicité n'existe pas.")
                            if (message.member.roles.has("428556268546818048") || message.member.roles.has("428556458985127941") || message.member.roles.has("428556304097869835")) return message.channel.send("Pour effectuer une demande d'ajout de votre publicité, tapez `" + prefix + "`pub submit <publicité>")
                            break;
                        }
                    }
                }
            }
        break;

        case "vcs-clear":
            let clear = message.content.split(" ").slice(1);
            let vcs_message_to_delete = clear.join(" ")
            message.delete()
            if(message.author.id === "323039726040776705") {
                if(parseInt(vcs_message_to_delete)) {
                    bot.channels.findAll("name", channel_vcs_name).forEach(c => c.bulkDelete(vcs_message_to_delete));
                    console.log("-> " + prefix + "vcs-clear\n" + vcs_message_to_delete + " messages correctement supprimés dans le VCS\n" + separation)
                }
            }  
            break;

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
                .setAuthor(message.author.username + " : Je joue actuellement la radio dans le salon \"" + message.member.voiceChannel.name)
                .setFooter(footer)
                .setTimestamp()
            var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + prefix + "radiomodern``")
                .addField(separation, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter(footer)
                .setColor(embed_color)
                .setTimestamp();
            message.channel.send(play_embed);
            bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
            console.log("-> " + prefix + "radiomodern\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n" + separation);
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
                author_reaction.on("collect", async(reaction) => {
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
                    .addField(message.author.username + " : Notification", "Cette commande est seulement disponible dans le serveur \"Radio Modern\" : " + serv_discord)
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
            let purge = message.content.split(" ").slice(1);
            let purge_message_to_delete = purge.join(" ")
            if(message.author.id === "323039726040776705") {
                if(parseInt(purge_message_to_delete)) {
                    message.channel.bulkDelete(purge_message_to_delete + 1)
                    console.log("-> " + prefix + "purge\n" + purge_message_to_delete + " messages correctement supprimés dans le salon message.channel.name\n" + separation)
                }
            }  
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
                .addField("🎵 Message d'aide | Musique en cours", "En développement...")
            var help_vcs_embed = new Discord.RichEmbed()
                .addField("🗒 Message d'aide | VCS", "En développement...")
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
                .addField(prefix + "vcs {message}", "Envoyer un message VCS (__V__irtual __C__hat __S__erver) dans tout les serveurs où je suis. _(Seulement dans les salons #" + channel_vcs_name + ")_")
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
            author_reaction.on("collect", async(reaction) => {
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
            var channel_vcs = message.guild.channels.find("name", "send-promotion");
            if (message.channel.name !== "send-promotion") return message.reply("Cette commande est à effectuer seulement dans le salon dans #send-promotion du serveur \"Radio Modern\".")
            if (!suffix) return message.reply("Merci de citer la publicité que vous souhaitez poster.")
            if (suffix.length > 255) return message.channel.send("Ton message est trop long")
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

        case "listserv":
            message.channel.send("__**ATTENTION, SPAM POSSIBLE**__\n -> Nombre de serveurs : " + bot.guilds.size + "\n-> Nombre d'utilisateurs : " + bot.users.size + "\n\n__Liste complète des serveurs :__");
            var allservers = bot.guilds.array(); for (var i in allservers) {
                message.channel.send("-> `\"" + allservers[i].name + "\"` (`" + allservers[i].id + "`) : `" + allservers[i].memberCount + "` membres")
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

bot.on("message", async function (message) {
    if(message.channel.name !== channel_vcs_name) return;
    if(message.author.id === bot.user.id) return;
    if(message.author.bot) return;
    if(message.content.startsWith("//")) return;
    if (message.content.length > 255 || message.content.length < 1) return;
    let vcs_color;
    let vcs_role;
    if (message.author.id === "315780474360561664") return;
        //                    X
    if (message.author.id === "323039726040776705" || message.author.id === "182977157314772993") {
        //                    Tard0sTV                                      Volzonas
        vcs_color = fondateur_color
        vcs_role = "Fondateur "
    } else if (message.author.id === "193092758267887616") {
        //                           Ilian
        vcs_color = "#2E64FE"
        vcs_role = "Développeur "
    } else if (message.author.id === "370593040706043905" || message.author.id === "417795915810603019" || message.author.id === "306768941210927104" || message.author.id === "319470633593339914" || message.author.id === "337863324983230474") {
        //                           Draco                                         EdenCompany                                   NotaGam                                       LAMBR                                         Slender
        vcs_color = partenaire_color
        vcs_role = "Partenaire "
    } else if (message.author.id === "306116635264024586") {
        //                           Uro
        vcs_color = "#0080FF"
        vcs_role = "Animateur Discord "
    } else {
        vcs_color = embed_color
        vcs_role = "Auditeur "
    }
    const vcs_embed = new Discord.RichEmbed()
        .setAuthor(vcs_role + message.author.username + " : VCS", message.guild.iconURL)
        .addField(separation, message.content)
        .addField(separation, "Provenance : `\"" + message.guild.name + "\"` (" + message.guild.id + ")")
        .setThumbnail(message.author.avatarURL)
        .setFooter(footer)
        .setColor(vcs_color)
        .setTimestamp()
    message.delete()
    bot.channels.findAll("name", channel_vcs_name).map(channel => channel.send(vcs_embed));
    var log_embed = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .addField(message.author.username + " - Logs : ", "``" + prefix + "vcs``")
        .addField("Contenu : " + message.content, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
        .setFooter(footer)
        .setColor(embed_color)
        .setTimestamp();
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(log_embed));
    console.log("-> " + prefix + "vcs\nAuteur : " + vcs_role + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\nContenu : \n  \"" + message.content + "\"\n" + separation);
})

/*const size = colors;
const rainbow = new Array(size);
let place = 0;

for (var i = 0; i < size; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3);
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3);
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3);
    rainbow[i] = "#"" + red + green + blue;
}

function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? "0" + hex : hex;
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
    setTimeout(changeColor, 5 * 60 * 1000)
}*/

bot.login(process.env.TOKEN);
