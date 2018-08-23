const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready", () => {
    autoplayradio();    
});

function autoplayradio () {

    var channel_ilian = bot.channels.find("id", "481202105382862848");
    var channel_supers = bot.channels.find("id", "444201909666971648");
    var channel_qz = bot.channels.find("id", "442651081080569867");
    
    autoplayradio_join();

    function autoplayradio_join () {
        channel_ilian.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        channel_supers.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        channel_qz.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res);
            })
        })
        setTimeout(autoplayradio_leave, 15 * 60 * 1000)
    }

    function autoplayradio_leave () {
        channel_ilian.leave();
        channel_supers.leave();
        channel_qz.leave();
        autoplayradio_join();
    }
}

bot.login(process.env.TOKEN);
