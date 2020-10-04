//Ranking.js//
const discord = require("discord.js"); // importing the discord lib
const {Database} = require("../../database/Database.js"); // imp^importing the Database class

class Ranking { // class for the commands
    constructor(reaction, user, config, client, language) {
        this.language = language.rank; // load the text
        this.user = user;
        this.reaction = reaction; // constructor od the message collection
        this.message = reaction.message
        this.prefix = config.client.prefix; // get the prefix from config.json file
        this.client = client; // get the client instance from index.js
        this.db = new Database(config); // get the database class instance
        this.commands = "post"; // set command to call
        this.channel = "743803409521573928" // channel id where list will be sent
    }
    react() {
        if(this.user.id !== this.client.user.id) {
            switch (this.reaction.emoji.name) {
                case "⭐":
                    try {
                        this.db.connection().query(`SELECT * FROM rankReactMsgId WHERE messageId = "${this.reaction.message.id}"`, (err, rows) => {
                            if(err) throw err;
                            if(rows.length >= 1) {
                                if(this.reaction.message.id === rows[0].messageId) {
                                    let serverName = this.reaction.message.embeds[0].fields[0].value.replace("`", '"').replace("`", '"');
                                    this.db.connection().query(`SELECT * FROM rankVoters WHERE serverVoted = ${serverName} AND userId = "${this.user.id}"`, (err, rows) => {
                                        if(err) throw err;
                                        if(rows.length >= 1) {
                                            if(rows[0].voteState === "0") {
                                                this.db.connection().query(`SELECT * FROM serverList WHERE name = ${serverName}`, (err, rows) => {
                                                    if(err) throw err;
                                                    if(rows.length >= 1) {
                                                        this.db.connection().query(`UPDATE serverList SET rank = ${rows[0].rank + 1} WHERE name = ${serverName}`, (err) => {
                                                            if(err) throw err;
                                                            this.db.connection().query(`UPDATE rankVoters SET voteState = 1 WHERE serverVoted = ${serverName} AND userId = "${this.user.id}"`, (err) => {
                                                                if(err) throw err;
                                                            });
                                                            this.user.send(this.language.messages[1].replace("SERVER", serverName)).then().catch(console.error);
                                                        })
                                                    }
                                                })
                                            } else {
                                                this.user.send(this.language.messages[0]).then().catch(console.error);
                                            }
                                        } else {
                                            this.db.connection().query(`SELECT * FROM serverList WHERE name = ${serverName}`, (err, rows) => {
                                                if(err) throw err;
                                                if(rows.length >= 1) {
                                                    this.db.connection().query(`UPDATE serverList SET rank = ${rows[0].rank + 1} WHERE name = ${serverName}`, (err) => {
                                                        if(err) throw err;
                                                        this.db.connection().query(`INSERT INTO rankVoters (userId, serverVoted, voteState) VALUES ("${this.user.id}", ${serverName}, ${1})`, (err) => {
                                                            if(err) throw err;
                                                        });
                                                    })
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        });
                    } catch(e) {

                    }
                    break;
                case "😭":



                    try {
                        this.db.connection().query(`SELECT * FROM rankReactMsgId WHERE messageId = "${this.reaction.message.id}"`, (err, rows) => {
                            if(err) throw err;
                            if(rows.length >= 1) {
                                if(this.reaction.message.id === rows[0].messageId) {
                                    let serverName = this.reaction.message.embeds[0].fields[0].value.replace("`", '"').replace("`", '"');
                                    this.db.connection().query(`SELECT * FROM rankVoters WHERE serverVoted = ${serverName} AND userId = "${this.user.id}"`, (err, rows) => {
                                        if(err) throw err;
                                        if(rows.length >= 1) {
                                            if(rows[0].voteState === "1") {
                                                let info = [];
                                                this.db.connection().query(`SELECT * FROM serverList WHERE name = ${serverName}`, (err, rows) => {
                                                    if(err) throw err;
                                                    let serverList = rows;
                                                    if(rows.length >= 1) {
                                                        this.db.connection().query(`UPDATE serverList SET rank = ${rows[0].rank - 1} WHERE name = ${serverName}`, (err) => {
                                                            if(err) throw err;
                                                            this.db.connection().query(`UPDATE rankVoters SET voteState = 0 WHERE serverVoted = ${serverName} AND userId = "${this.user.id}"`, (err) => {
                                                                if(err) throw err;
                                                            });
                                                            this.user.send(this.language.messages[2].replace("SERVER", serverName)).then(async message => {
                                                                const filter = m => m.author.id === this.user.id;
                                                                const answer = await message.channel.awaitMessages(filter, {
                                                                    maxProcessed: 1,
                                                                    time: 30000,
                                                                    errors: ["time", "maxProcessed"]
                                                                })
                                                                const ans = answer.first();
                                                                info.push(ans.content)
                                                                if(typeof ans.content !== "undefined") {
                                                                    this.client.users.cache.find(user => user.id === serverList[0].userId).send(this.embeds(1, info)).then().catch(console.error)
                                                                }
                                                            }).catch(console.error);

                                                            //
                                                        })
                                                    }
                                                })
                                            } else {
                                                this.user.send(this.language.messages[0]).then().catch(console.error);
                                            }
                                        } else {
                                            let info = [];
                                            this.db.connection().query(`SELECT * FROM serverList WHERE name = ${serverName}`, (err, rows) => {
                                                if(err) throw err;
                                                let serverList = rows;
                                                if(rows.length >= 1) {
                                                    this.db.connection().query(`UPDATE serverList SET rank = ${rows[0].rank - 1} WHERE name = ${serverName}`, (err) => {
                                                        if(err) throw err;
                                                        this.db.connection().query(`INSERT INTO rankVoters (userId, serverVoted, voteState) VALUES ("${this.user.id}", ${serverName}, ${0})`, (err) => {
                                                            if(err) throw err;
                                                        });
                                                        this.user.send(this.language.messages[2].replace("SERVER", serverName)).then(async message => {
                                                            const filter = m => m.author.id === this.user.id;
                                                            const answer = await message.channel.awaitMessages(filter, {
                                                                maxProcessed: 1,
                                                                time: 30000,
                                                                errors: ["time", "maxProcessed"]
                                                            })
                                                            const ans = answer.first();
                                                            info.push(ans.content)
                                                            if(typeof ans.content !== "undefined") {
                                                                this.client.users.cache.find(user => user.id === serverList[0].userId).send(this.embeds(1, info)).then().catch(console.error)
                                                            }
                                                        }).catch(console.error);
                                                    })
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        });
                    } catch (e) {

                    }
                    break;
            }
        }
    }
    embeds(Case, info=null) {
        switch (Case) {
            case 1:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.client.users.cache.find(user => user.id === this.user.id).avatarURL())
                    .setTitle("Someone had negatively voted for your server, here is he's feedback!")
                    .setDescription(info[0])
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
        }
    }
}
module.exports = {
    Ranking
}
