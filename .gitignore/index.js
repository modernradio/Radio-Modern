const Discord = require("discord.js");

var bot = new Discord.Client();

var separation = "><><><><><><><><><><><";

bot.on("ready", () => {
    autoplayradio();    
});

function autoplayradio () {

    var channels_autoplayradio = ["482530580123222044", "480886933115895809"]
    //                           BAR                     Imaginarium

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
            console.log("-> autojoin\n    - Salon \"" + channels_autoplayradio[i].name + "\" (" + channels_autoplayradio[i].guild.name + ")\n" + separation)    
        }
        setTimeout(autoplayradio_leave, 15 * 60 * 1000)
    }

    function autoplayradio_leave () {
        var i;
        for (i = 0; i < channels_autoplayradio.length; i++) {
            var channels_autoplayradio_find = bot.channels.findAll("id", channels_autoplayradio[i]);
            channels_autoplayradio_find.leave();
            console.log("-> autojoin\n    + Salon \"" + channels_autoplayradio[i].name + "\" (" + channels_autoplayradio[i].guild.name + ")\n" + separation)
        }
        autoplayradio_join();
    }
}

bot.login(process.env.TOKEN);
