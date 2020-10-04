//Openline developed by Florian Lepage
const discord = require("discord.js"); // load of discord.js
const fs = require("fs"); // load of file system
const client = new discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']}); // add partials to get older messages
// json imports
const config = JSON.parse(fs.readFileSync("./config/config.json")); // load of the config file
const languages = JSON.parse(fs.readFileSync("./languages/en-US.json"));
// class imports
const {Database} = require("./database/Database.js"); // load the database class
const {QuestionQuizz} = require("./action/QuestionQuizz.js"); // load the commands 'post'
const {Info} = require("./action/utils/Info.js"); // info command
const {Ranking} = require("./action/utils/Ranking.js") // rank system
// client events
client.on("ready", () => { // event when the bot's ready
    let time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`; // init time variable
    new Database(config).tryConnection(); // check connection with the database
    console.log(`[${time}] The client '${client.user.username}' has been connected.`);
});
client.on("message",  (message) => {
    new QuestionQuizz(message, config, client, languages).redirect(); // call the method redirect from the class QuestionQuizz
    new Info(message, config, client, languages).command();
});
client.on("messageReactionAdd", (reaction, user) => {
    new Ranking(reaction, user, config, client, languages).react()
});
//
client.login(config.client.token); // Discord api login
