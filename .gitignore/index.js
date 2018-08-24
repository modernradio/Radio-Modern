const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready", () => {
    autoplayradio();    
});

function autoplayradio () {

    var channel_bar = bot.channels.find("id", "482530580123222044");
    //var channel_libre = bot.channels.find("id", "");
    //var channel_libre = bot.channels.find("id", "");
    
    autoplayradio_join();

    function autoplayradio_join () {
        channel_bar.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        /*channel_libre.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        channel_libre.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })*/
        setTimeout(autoplayradio_leave, 15 * 60 * 1000)
    }

    function autoplayradio_leave () {
        channel_ilian.leave();
        //channel_libre.leave();
        //channel_libre.leave();
        autoplayradio_join();
    }
}

bot.login(process.env.TOKEN);
