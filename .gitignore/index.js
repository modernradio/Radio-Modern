const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready", () => {
    autoplayradio();    
});

function autoplayradio () {

    var channel_bar = bot.channels.find("id", "482530580123222044");
    var channel_imagi = bot.channels.find("id", "480886933115895809");
    //var channel_arcadia = bot.channels.find("id", "450189683398279168");
    
    autoplayradio_join();

    function autoplayradio_join () {
        channel_bar.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        channel_imagi.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        /*channel_arcadia.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })*/
        setTimeout(autoplayradio_leave, 15 * 60 * 1000)
    }

    function autoplayradio_leave () {
        channel_bar.leave();
        channel_imagi.leave();
        //channel_arcadia.leave();
        autoplayradio_join();
    }
}

bot.login(process.env.TOKEN);
