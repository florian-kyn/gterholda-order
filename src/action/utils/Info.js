//Info.js//
const discord = require("discord.js");

class Info {
    constructor(message, config, client, language) {
        this.language = language.info; // load the text
        this.message = message; // constructor od the message collection
        this.args = message.content.slice().split(/ /); // init the var which contain the message/command args
        this.prefix = config.client.prefix; // get the prefix from config.json file
        this.client = client; // get the client instance from index.js
        this.commands = "info";
    }
    command() {
        if(this.message.author.id !== this.client.user.id) {
            if(this.args[0].toLowerCase() === this.prefix + this.commands) {
                this.message.delete().then().catch(console.error);
                this.message.channel.send(this.embed(1)).then().catch(console.error);
            }
        }
    }
    embed(Case) {
        switch (Case) {
            case 1:
                let members = 0;
                let servers = 0;
                let roles = 0;
                this.message.channel.guild.members.cache.map(member => member.user.bot ? false : members++);
                this.client.guilds.cache.map(server => this.message.guild.id === server.id ? servers++ : servers++);
                this.message.channel.guild.roles.cache.map(roles => roles.name !== "@everyone" ? roles++ : roles++);
                return new discord.MessageEmbed()
                    .setAuthor(this.client.user.username, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .addFields(
                        {name: this.language.embed.name[0], value: "`" + "Online" + "`", inline: true},
                        {name: this.language.embed.name[1], value: "`" + "Discord.js V.12" + "`", inline: true},
                        {name: this.language.embed.name[2], value: "`" + `${members} ${this.language.embed.value[0]}` + "`", inline: true},
                        {name: this.language.embed.name[3], value: "`" + `${servers} ${this.language.embed.value[1]}` + "`", inline: true},
                        {name: this.language.embed.name[4], value: "`" + `${servers} ${this.language.embed.value[2]}` + "`", inline: true},
                        {name: this.language.embed.name[5], value: "[Florian Lepage](https://discord.gg/sUJSvSG)", inline: true},
                    )
                    .setImage(this.client.user.avatarURL())
                    .setColor("BLUE")
                    .setFooter(`@florian_kyn`, "https://i.imgur.com/2XRrIuv.png")
                    .setTimestamp();
        }
    }
}
module.exports = {
    Info
}
