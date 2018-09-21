const Discord = require("discord.js");

let prefix = ".";

var bot = new Discord.Client();

var separation = "><><><><><><><><><><><";

bot.on("ready", () => {
    var connection_embed = new Discord.RichEmbed()
        .setTitle("Radio-Modern-2 - Je suis connecté")
        .setTimestamp()
        .setColor("#04B404")
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(connection_embed));
    console.log(separation + "\nBot prêt\n" + separation);
    autoplayradio();
});

bot.on("message", async function (message) {
    if (message.author.equals(bot.user)) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.author.id !== "323039726040776705") return;
    var splited = message.content.substring(prefix.length).split(" ");
    var command = splited[0]
    switch (command.toLowerCase()) {
        case "autoradio":
        case "auto-radio":
            console.log("-> " + prefix + "auto-radio\n" + separation)
            autoplayradio();
            break;
    }
});

function autoplayradio () {

    var channels_autoplayradio = ["442651081080569867", "481202105382862848"]
    //                           Le QZ                  Ilian

    autoplayradio_join();

    function autoplayradio_join () {
        var i;
        for (i = 0; i < channels_autoplayradio.length; i++) {
            var channels_autoplayradio_find = bot.channels.find("id", channels_autoplayradio[i]);
            channels_autoplayradio_find.join().then(connection => {
                require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                    connection.playStream(res);
                })
            })
            console.log("-> autojoin\n    - Salon \"" + channels_autoplayradio_find.name + "\" (" + channels_autoplayradio_find.guild.name + ")\n" + separation)    
        }
        setTimeout(autoplayradio_leave, 60 * 60 * 1000)
    }

    function autoplayradio_leave () {
        var i;
        for (i = 0; i < channels_autoplayradio.length; i++) {
            var channels_autoplayradio_find = bot.channels.find("id", channels_autoplayradio[i]);
            channels_autoplayradio_find.leave();
            console.log("-> autojoin\n    + Salon \"" + channels_autoplayradio_find.name + "\" (" + channels_autoplayradio_find.guild.name + ")\n" + separation)
        }
        autoplayradio_join();
    }
}

bot.login(process.env.TOKEN);
