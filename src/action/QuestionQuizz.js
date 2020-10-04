//QuestionQuizz.js//
const discord = require("discord.js"); // importing the discord lib
const {Database} = require("../database/Database.js"); // imp^importing the Database class

class QuestionQuizz { // class for the commands
    constructor(message, config, client, language) {
        this.language = language.questions; // load the text
        this.message = message; // constructor od the message collection
        this.args = message.content.slice().split(/ /); // init the var which contain the message/command args
        this.prefix = config.client.prefix; // get the prefix from config.json file
        this.client = client; // get the client instance from index.js
        this.db = new Database(config); // get the database class instance
        this.commands = "post"; // set command to call
        this.channel = "759456204870123580" // channel id where list will be sent
    }
    redirect() { // method to redirect in function of the commands
        if(this.message.author.id !== this.client.user.id) { // check if the message author is not the bot
            //this.notificationInterval();
            //this.leaderboardNews();
            if(this.args[0].toLowerCase() === this.prefix + this.commands) { // check if the message is starting by <PREFIX> <COMMAND>
                if(this.message.channel.type === "dm" && this.args[0] === this.prefix + this.commands) return;
                if(typeof this.args[1] === "undefined") return; // return if array empty
                switch (this.args[1].toLowerCase()) {
                    case "create":
                        this.create();
                        break;
                    case "delete":
                        this.delete();
                        break;
                    case "ban":
                        this.ban();
                        break;
                    case "unban":
                        this.unBan()
                        break;
                    case "help":
                        this.help();
                        break;
                    case "channel":
                        this.Channel();
                        break;
                    case "show":
                        this.show();
                        break;
                    case "news":
                        this.notification();
                        break;
                    default:
                        this.help();
                        break;
                }
            }
        }
    }
    create() {
        this.db.connection().query(`SELECT * FROM listBan WHERE userId = ${this.message.author.id}`, (err, rows) => {
            if(err) throw err;
            if(rows.length >= 1) {
                return this.message.channel.send(this.language.create.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);
            } else {
                const infos = [];
                const timeToWait = 30000
                this.message.author.send(this.embeds(1)).then(async message => {
                    const filter = m => m.author.id === this.message.author.id;
                    const answer = await message.channel.awaitMessages(filter, {
                        maxProcessed: 1,
                        time: timeToWait,
                        errors: ["time", "maxProcessed"]
                    })
                    const ans = answer.first();
                    infos.push(ans.content)
                    if(typeof ans !== "undefined") {
                        this.message.author.send(this.embeds(2)).then(async message => {
                            const filter = m => m.author.id === this.message.author.id;
                            const answer = await message.channel.awaitMessages(filter, {
                                maxProcessed: 1,
                                time: timeToWait,
                                errors: ["time", "maxProcessed"]
                            })
                            const ans = answer.first();
                            infos.push(ans.content)
                            if(typeof ans !== "undefined") {
                                this.message.author.send(this.embeds(3)).then(async message => {
                                    const filter = m => m.author.id === this.message.author.id;
                                    const answer = await message.channel.awaitMessages(filter, {
                                        maxProcessed: 1,
                                        time: timeToWait,
                                        errors: ["time", "maxProcessed"]
                                    })
                                    const ans = answer.first();
                                    infos.push(ans.content)
                                    if(typeof ans !== "undefined") {
                                        this.message.author.send(this.embeds(4)).then(async message => {
                                            const filter = m => m.author.id === this.message.author.id;
                                            const answer = await message.channel.awaitMessages(filter, {
                                                maxProcessed: 1,
                                                time: timeToWait,
                                                errors: ["time", "maxProcessed"]
                                            })
                                            const ans = answer.first();
                                            infos.push(ans.content)
                                            infos.push("0")
                                            if(typeof ans !== "undefined") {
                                                this.message.author.send(this.embeds(5, infos)).then().catch(console.error);
                                                this.message.author.send(this.language.create.embeds.title[1]).then(async message => {
                                                    const filter = m => m.author.id === this.message.author.id;
                                                    const answer = await message.channel.awaitMessages(filter, {
                                                        maxProcessed: 1,
                                                        time: timeToWait,
                                                        errors: ["time", "maxProcessed"]
                                                    })
                                                    const ans = answer.first();
                                                    infos.push(ans.content)
                                                    this.db.connection().query(`CREATE TABLE IF NOT EXISTS serverList (name VARCHAR(255), description VARCHAR(255), gameMode VARCHAR(255), version VARCHAR(255), rank INT, userId VARCHAR(30))`, (err) => {
                                                        if(err) throw err;
                                                    });
                                                    if(ans.content.toLowerCase() === "yes") {
                                                        this.db.connection().query(`INSERT INTO serverList (name, description, gameMode, version, rank, userId) VALUES ("${infos[0]}", "${infos[1]}", "${infos[2]}", "${infos[3]}", 0, "${this.message.author.id}")`, (err) => {
                                                            if(err) throw err;
                                                            this.message.author.send(this.language.create.messageSuccess[0]).then().catch(console.error)
                                                            this.message.channel.send(this.embeds(5, infos)).then(message => {
                                                                message.react("😭").then().catch();
                                                                message.react("⭐").then().catch();
                                                                this.db.connection().query(`CREATE TABLE IF NOT EXISTS rankVoters (userId VARCHAR(30), serverVoted VARCHAR(255))`, (err) => {
                                                                    if(err) throw err;
                                                                })
                                                                this.db.connection().query(`INSERT INTO rankReactMsgId (messageId) VALUES ("${message.id}")`, (err) => {
                                                                    if (err) throw err;
                                                                });
                                                            }).catch(console.error);

                                                            let time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`; // init time variable
                                                            console.log(`[${time}] '${this.message.author.tag}' just added a server in the list.`);
                                                        })
                                                    } else if(ans.content.toLowerCase() === "no") {
                                                        this.message.author.send(this.language.create.messageError[0]).then().catch(console.error)
                                                    }
                                                }).catch(console.error)
                                            }
                                        }).catch(console.error);
                                    }
                                }).catch(console.error);
                            }
                        }).catch(console.error);
                    }
                }).catch(console.error);
            }
        })
    }
    delete() {
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
            if(typeof this.args[2] !== "undefined") {
                this.db.connection().query(`SELECT * FROM serverList WHERE name = "${this.args[2]}"`, (err, rows) => {
                    if(err) throw err;
                    if(rows.length >= 1) {
                        this.db.connection().query(`DELETE FROM serverList WHERE name = "${this.args[2]}"`, (err) => {
                            if(err) throw err;
                            this.message.channel.send(this.language.delete.messageSuccess[0]).then().catch(console.error);
                            let time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`; // init time variable
                            console.log(`[${time}] '${this.message.author.tag}' just deleted a server in a server list.`);
                        })
                    } else {
                        this.message.channel.send(this.language.delete.messageError[1]).then().catch(console.error);
                    }
                })
            }
        } else {
            this.message.delete().then().catch(console.error);
            this.message.channel.send(this.language.delete.messageError[0]).then().catch(console.error);
        }
    }
    ban() {
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
            this.db.connection().query(`CREATE TABLE IF NOT EXISTS listBan (userId VARCHAR(30), banAuthorId VARCHAR(30), reason VARCHAR(255))`, (err) => {if(err) throw err});
            if(typeof this.args[2] !== "undefined") {
                let userId;
                if (this.args[2].charAt(0) === "<") {
                    userId = this.message.mentions.members.first().id;
                } else {
                    userId = this.args[2];
                }
                if(userId.length === 18) {
                    if(typeof this.args[3] !== "undefined") {
                        let reason = ""; //init of the variable which will contain the reason
                        for (let i = 3; this.args.length > i; i++) {
                            reason += this.args[i];
                            reason += " ";
                        }
                        reason.substring(0, reason.length - 1); //return of the reason
                        if (!reason.includes('"')) {
                            this.db.connection().query(`SELECT * FROM listBan WHERE userId = ${userId}`, (err, rows) => {
                                if(err) throw err;
                                if(rows.length < 1) {
                                    this.db.connection().query(`INSERT INTO listBan (userId, banAuthorId, reason) VALUES ("${userId}", "${this.message.author.id}", "${reason}")`, (err) => {
                                        if(err) throw err;
                                        this.message.channel.send(this.language.ban.messageSuccess[0].replace("USER", this.message.guild.member(userId).user)).then().catch(console.error);
                                        this.message.guild.member(userId).send(this.language.ban.messageSuccess[1].replace("REASON", reason)).then().catch(console.error);
                                        let time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`; // init time variable
                                        console.log(`[${time}] '${this.message.guild.member(userId).user.tag}' has been banned by ${this.message.author.tag}`);
                                    });
                                } else { // when the user is already banned
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.ban.messageError[5]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            })
                        } else { // when reason contain "
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.ban.messageError[4] + ' `"` .').then(message => message.delete({timeout: 10000})).catch(console.error);
                        }
                    } else { // when there is no reason
                        this.message.delete().then().catch(console.error);
                        this.message.channel.send(this.language.ban.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error);
                    }
                } else { // when the user id is not valid
                    this.message.delete().then().catch(console.error);
                    this.message.channel.send(this.language.ban.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error);
                }
            } else { // when there is no user specified
                this.message.delete().then().catch(console.error);
                this.message.channel.send(this.language.ban.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);
            }
        } else { // when the user is not admin
            this.message.delete();
            this.message.channel.send(this.language.ban.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
        }
    }
    unBan() {
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
            this.db.connection().query(`CREATE TABLE IF NOT EXISTS listBan (userId VARCHAR(30), banAuthorId VARCHAR(30), reason VARCHAR(255))`, (err) => {
                if (err) throw err
            });
            if (typeof this.args[2] !== "undefined") {
                let userId;
                if (this.args[2].charAt(0) === "<") {
                    userId = this.message.mentions.members.first().id;
                } else {
                    userId = this.args[2];
                }
                if (userId.length === 18) {
                    this.db.connection().query(`SELECT * FROM listBan WHERE userId = ${userId}`,(err, rows) =>  {
                        if(err) throw err;
                        if(rows.length >= 1) {
                            this.db.connection().query(`DELETE FROM listBan WHERE userId = ${userId}`, (err) => {
                                if(err) throw err;
                                this.message.channel.send(this.language.unban.messageSuccess[0].replace("USER", this.message.guild.member(userId).user)).then().catch(console.error);
                                this.message.guild.member(userId).send(this.language.unban.messageSuccess[1].replace("AUTHOR", this.message.author)).then().catch(console.error);
                                let time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`; // init time variable
                                console.log(`[${time}] '${this.message.guild.member(userId).user.tag}' has been unbanned by ${this.message.author.tag}`);
                            })
                        } else { // when the user is not banned.
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.unban.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error);
                        }
                    });
                } else { // when the user id is not valid
                    this.message.delete().then().catch(console.error);
                    this.message.channel.send(this.language.unban.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error);
                }
            } else { // when there is no user specified
                this.message.delete().then().catch(console.error);
                this.message.channel.send(this.language.unban.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);
            }
        } else { // when the user is not admin
            this.message.delete();
            this.message.channel.send(this.language.unban.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
        }
    }
    show() {
        this.db.connection().query(`CREATE TABLE IF NOT EXISTS rankReactMsgId (messageId VARCHAR(30))`, (err) => {
            if(err) throw err;
        });
        this.db.connection().query(`SELECT * FROM listBan WHERE userId = ${this.message.author.id}`, (err, rows) => {
            if (err) throw err;
            if (rows.length >= 1) {
                return this.message.channel.send(this.language.show.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
            } else {
                if (typeof this.args[2] !== "undefined") {
                    if (this.args[2].toLowerCase() === "gamemode") {
                        if (typeof this.args[3] !== "undefined") {
                            let gamemode = "";
                            for (let i = 3; this.args.length > i; i++) {
                                gamemode += this.args[i];
                                gamemode += " ";
                            }
                            gamemode.substring(0, gamemode.length - 1); //return of the reason
                            this.db.connection().query(`SELECT * FROM serverList WHERE gameMode = "${gamemode}"`, (err, rows) => {
                                if (err) throw err;
                                if (rows.length >= 1) {
                                    for (let i = 0; rows.length > i; i++) {
                                        let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version, rows[i].rank]
                                        this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                                    }
                                } else {
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.show.messageError[4]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            });
                        } else {
                            this.message.delete().then(console.error);
                            this.message.channel.send(this.language.show.messageError[2]).then().catch(console.error)
                        }
                    } else if (this.args[2].toLowerCase() === "version") {
                        if (typeof this.args[3] !== "undefined") {
                            this.db.connection().query(`SELECT * FROM serverList WHERE version = '${this.args[3]}'`, (err, rows) => {
                                if (err) throw err;
                                if (rows.length >= 1) {
                                    for (let i = 0; rows.length > i; i++) {
                                        let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version, rows[i].rank]
                                        this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                                    }
                                } else {
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.show.messageError[5]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            });
                        } else {
                            this.message.delete().then(console.error);
                            this.message.channel.send(this.language.show.messageError[3]).then().catch(console.error)
                        }
                    } else if (this.args[2].toLowerCase() === "name") {
                        if (typeof this.args[3] !== "undefined") {
                            this.db.connection().query(`SELECT * FROM serverList WHERE name = '${this.args[3]}'`, (err, rows) => {
                                if (err) throw err;
                                if (rows.length >= 1) {
                                    for (let i = 0; rows.length > i; i++) {
                                        let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version, rows[i].rank]
                                        this.message.channel.send(this.embeds(5, info)).then(message => {
                                            message.react("😭").then().catch();
                                            message.react("⭐").then().catch();
                                            this.db.connection().query(`CREATE TABLE IF NOT EXISTS rankVoters (userId VARCHAR(30), serverVoted VARCHAR(255), voteState VARCHAR(30))`, (err) => {
                                                if(err) throw err;
                                            })
                                            this.db.connection().query(`INSERT INTO rankReactMsgId (messageId) VALUES ("${message.id}")`, (err) => {
                                                if (err) throw err;
                                            });
                                        }).catch(console.error);
                                    }
                                } else {
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.show.messageError[5]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            });
                        } else {
                            this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                                if (err) throw err;
                                if (this.args[2] <= rows.length && this.args[2] > 0) {
                                    for (let i = 0; this.args[2] > i; i++) {
                                        let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version]
                                        this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                                    }
                                } else {
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.show.messageError[1].replace("NUMBER", rows.length)).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            });
                        }
                    } else if(this.args[2].toLowerCase() === "top") {
                        if(typeof this.args[3] !== "undefined") {
                            if(this.args[3].toLowerCase() === "set") {
                                this.db.connection().query(`CREATE TABLE IF NOT EXISTS rankNews (channelId VARCHAR(30))`, (err) => {if(err) throw err;});
                                this.db.connection().query(`SELECT * FROM rankNews WHERE channelId = "${this.message.channel.id}"`, (err, rows) => {
                                    if(err) throw rows;
                                    if(rows.length < 1) {
                                        this.db.connection().query(`INSERT INTO rankNews (channelId) VALUES ("${this.message.channel.id}")`, (err) => {
                                            if(err) throw err;

                                            this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                                                if (err) throw err;
                                                let servers = {};
                                                for (let i = 0; rows.length > i; i++) {
                                                    servers[rows[i].name] = rows[i].rank;
                                                }

                                                let servers_buffer = Object.keys(servers).map((buff) => {
                                                    return [buff, servers[buff]];
                                                });

                                                servers_buffer.sort((key_one, key_two) => {
                                                    return key_two[1] - key_one[1];
                                                });

                                                this.message.channel.send(this.embeds(8, servers_buffer)).then().catch(console.error);
                                            });

                                            this.message.channel.send(`The channel has been set.`).then().catch(console.error);
                                        });
                                    } else {
                                        this.message.channel.send(`The channel has been already set.`).then(message => message.delete({timeout: 10000})).catch(console.error);
                                    }
                                });
                            }
                        } else {
                            this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                                if (err) throw err;
                                let servers = {};
                                for (let i = 0; rows.length > i; i++) {
                                    servers[rows[i].name] = rows[i].rank;
                                }

                                let servers_buffer = Object.keys(servers).map((buff) => {
                                    return [buff, servers[buff]];
                                });

                                servers_buffer.sort((key_one, key_two) => {
                                    return key_two[1] - key_one[1];
                                });

                                this.message.channel.send(this.embeds(8, servers_buffer)).then().catch(console.error);
                            });
                        }
                    }
                } else {
                    this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                        if (err) throw err;
                        for (let i = 0; rows.length > i; i++) {
                            let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version]
                            this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                        }
                    });
                }
            }
        });
    }
    leaderboardNews() {
        this.db.connection().query(`CREATE TABLE IF NOT EXISTS rankNews (channelId VARCHAR(30))`, (err) => {if(err) throw err;});
        this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
            if(err) throw err;
            let serverList = rows;
            this.db.connection().query(`SELECT * FROM rankNews`, (err, rows) => {
                if(err) throw err;
                if(rows.length >= 1) {
                    for(let i = 0; rows.length > i; i++) {
                        setInterval(() => {
                            let servers = {};
                            for (let i = 0; serverList.length > i; i++) {
                                servers[serverList[i].name] = serverList[i].rank;
                            }

                            let servers_buffer = Object.keys(servers).map((buff) => {
                                return [buff, servers[buff]];
                            });

                            servers_buffer.sort((key_one, key_two) => {
                                return key_two[1] - key_one[1];
                            });

                            this.message.channel.send(this.embeds(8, servers_buffer)).then().catch(console.error);
                        }, 86400000);
                    }
                }
            });
        });
    }
    notificationInterval() {
        this.db.connection().query(`CREATE TABLE IF NOT EXISTS news (channelId VARCHAR(30), time VARCHAR(30))`, (err) => {if(err) throw err;});
        this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
            if(err) throw err;
            let serverList = rows;
            this.db.connection().query(`SELECT * FROM news`, (err, rows) => {
                if(err) throw err;
                if(rows.length >= 1) {
                    for(let i = 0; rows.length > i; i++) {
                        setInterval(() => {
                            let channel = this.client.channels.cache.find(channel => channel.id === rows[i].channelId);
                            for(let i2 = 0; serverList.length > i2; i2++) {
                                let info = [serverList[i2].name, serverList[i2].description, serverList[i2].gameMode, serverList[i2].version];
                                channel.send(this.embeds(5, info)).then().catch(console.error);
                            }
                        }, rows[i].time * 60000);
                    }
                }
            });
        });
    }
    notification() {
        this.db.connection().query(`CREATE TABLE IF NOT EXISTS news (channelId VARCHAR(30), time VARCHAR(30))`, (err) => {if(err) throw err;});
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
            if(typeof this.args[2] !== "undefined" && this.args[2] === "set") {
                if(typeof this.args[3] !== "undefined") {
                    if(this.args[3] >= 1) {
                        this.db.connection().query(`SELECT * FROM news WHERE channelId = ${this.message.channel.id}`, (err, rows) => {
                            if(err) throw err;
                            if(rows.length < 1) {
                                this.db.connection().query(`INSERT INTO news (channelId, time) VALUES ("${this.message.channel.id}", "${this.args[3]}")`, (err) => {
                                    if(err) throw err;
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.channel.messageSuccess[0]).then(message => message.delete({timeout: 10000})).catch(console.error)
                                    this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                                        if(err) throw err;
                                        for(let i = 0; rows.length > i; i++) {
                                            let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version]
                                            this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                                        }
                                    });
                                });
                            } else { // the channel has been already set
                                this.message.delete().then().catch(console.error);
                                this.message.channel.send(this.language.channel.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error)
                            }
                        });
                    } else {
                        this.message.channel.send().then().catch(console.error);
                        this.message.channel.send(this.language.channel.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error)
                    }
                } else {
                    this.db.connection().query(`SELECT * FROM news WHERE channelId = ${this.message.channel.id}`, (err, rows) => {
                        if(err) throw err;
                        if(rows.length < 1) {
                            this.db.connection().query(`INSERT INTO news (channelId, time) VALUES ("${this.message.channel.id}", "60")`, (err) => {
                                if(err) throw err;
                                this.message.delete().then().catch(console.error);
                                this.message.channel.send(this.language.channel.messageSuccess[0]).then(message => message.delete({timeout: 10000})).catch(console.error)
                                this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                                    if(err) throw err;
                                    for(let i = 0; rows.length > i; i++) {
                                        let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version]
                                        this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                                    }
                                });
                            });
                        } else { // the channel has been already set
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.channel.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error)
                        }
                    });
                }
            } else if(typeof this.args[2] !== "undefined" && this.args[2] === "remove") {
                this.db.connection().query(`SELECT * FROM news WHERE channelId = "${this.message.channel.id}"`, (err, rows) => {
                    if(err) throw err;
                    if(rows.length >= 1) {
                        this.db.connection().query(`DELETE FROM news WHERE channelId = "${this.message.channel.id}"`, (err) => {
                            if(err) throw err;
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.channel.messageSuccess[1]).then().catch(console.error)
                        });
                    } else { // the channel is not set
                        this.message.delete().then().catch(console.error);
                        this.message.channel.send(this.language.channel.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error)
                    }
                });
            }
        } else { // the user is not administrator
            this.message.delete().then().catch(console.error);
            this.message.channel.send(this.language.channel.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error)
        }
    }
    Channel() {
        this.db.connection().query(`CREATE TABLE IF NOT EXISTS channels (channelId VARCHAR(30))`, (err) => {if(err) throw err;});
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
            if(typeof this.args[2] !== "undefined") {
                if(this.args[2].toLowerCase() === "set") {
                    this.db.connection().query(`SELECT * FROM channels WHERE channelId = "${this.message.channel.id}"`, (err, rows) => {
                        if(err) throw err;
                        if(rows.length < 1) {
                            this.db.connection().query(`INSERT INTO channels (channelId) VALUES ("${this.message.channel.id}")`, (err) => {
                                if(err) throw err;
                                this.message.delete().then().catch(console.error);
                                this.message.channel.send(this.language.channel.messageSuccess[0]).then(message => message.delete({timeout: 10000})).catch(console.error)
                                this.db.connection().query(`SELECT * FROM serverList`, (err, rows) => {
                                    if(err) throw err;
                                    for(let i = 0; rows.length > i; i++) {
                                        let info = [rows[i].name, rows[i].description, rows[i].gameMode, rows[i].version]
                                        this.message.channel.send(this.embeds(5, info)).then().catch(console.error);
                                    }
                                });
                            });
                        } else { // the channel has been already set
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.channel.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error)
                        }
                    });
                } else if(this.args[2].toLowerCase() === "remove") {
                    this.db.connection().query(`SELECT * FROM channels WHERE channelId = ${this.message.channel.id}`, (err, rows) => {
                        if(err) throw err;
                        if(rows.length >= 1) {
                            this.db.connection().query(`DELETE FROM channels WHERE channelId = ${this.message.channel.id}`, (err) => {
                                if(err) throw err;
                                this.message.delete().then().catch(console.error);
                                this.message.channel.send(this.language.channel.messageSuccess[1]).then().catch(console.error)
                            });
                        } else { // the channel is not set
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.channel.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error)
                        }
                    });
                }
            } else {
                this.message.delete().then().catch(console.error);
                this.message.channel.send(this.language.channel.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error)
            }
        } else { // the user is not administrator
            this.message.delete().then().catch(console.error);
            this.message.channel.send(this.language.channel.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error)
        }
    }
    help() {
        this.message.channel.send(this.embeds(6)).then().catch(console.error);
    }
    embeds(Case, info=null) {
        switch(Case) {
            case 1:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .setTitle(this.language.create.embeds.title[0])
                    .setDescription(this.language.create.embeds.description[0])
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
            case 2:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .setTitle(this.language.create.embeds.title[0])
                    .setDescription(this.language.create.embeds.description[1])
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
            case 3:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .setTitle(this.language.create.embeds.title[0])
                    .setDescription(this.language.create.embeds.description[2])
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
            case 4:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .setTitle(this.language.create.embeds.title[0])
                    .setDescription(this.language.create.embeds.description[3])
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
            case 5:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .setTitle(this.language.create.embeds.title[0])
                    .addFields(
                        {name: this.language.create.embeds.fieldNames[0], value: "`" + info[0] + "`", inline: true},
                        {name: '\u200B', value: '\u200B', inline: true},
                        {name: this.language.create.embeds.fieldNames[2], value: "`" + info[2] + "`", inline: true},
                        {name: this.language.create.embeds.fieldNames[3], value: "`" + info[3] + "`", inline: true},
                        {name: this.language.create.embeds.fieldNames[4], value: "`" + info[4] + " Vote" + "`", inline: true},
                        {name: this.language.create.embeds.fieldNames[1], value: "`" + info[1] + "`", inline: false},
                    )
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
            case 6:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .addFields(
                        {name: "`" + `${this.prefix + this.commands} create:` + "`", value: this.language.help.embed.values[0], inline: true},
                        {name: '\u200B', value: '\u200B', inline: true},
                        {name: "`" + `${this.prefix + this.commands} delete:` + "`", value: this.language.help.embed.values[1], inline: true},
                        {name: "`" + `${this.prefix + this.commands} help:` + "`", value: this.language.help.embed.values[2], inline: true},
                        {name: '\u200B', value: '\u200B', inline: true},
                        {name: "`" + `${this.prefix + this.commands} show:` + "`", value: this.language.help.embed.values[3], inline: true},
                        {name: "`" + `${this.prefix + this.commands} show <amount>` + "`", value: this.language.help.embed.values[4], inline: true},
                        {name: '\u200B', value: '\u200B', inline: true},
                        {name: "`" + `${this.prefix + this.commands} show <version/gamemode> <version/gamemode> :` + "`", value: this.language.help.embed.values[5], inline: true},
                        {name: "`" + `${this.prefix + this.commands} news <set/remove> <time/nothing> :` + "`", value: this.language.help.embed.values[5], inline: true},
                    )
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
            case 8:
                let stuff = [];
                for(let i = 0; info.length > i; i++) {
                    stuff.push( "`" + `${info[i][0]}: ${info[i][1]} Vote` + "`")
                }

                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .setTitle("Here is the leaderboard !")
                    .addField(`Leaderboard on ${info.length} servers:`,
                        stuff
                    )
                    .setColor("GREEN")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
        }
    }
}
module.exports = { // export of the class
    QuestionQuizz
}
