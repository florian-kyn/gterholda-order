//Database.js//
const mysql = require("mysql2");

class Database {
    constructor(token) {
        this.dbUsername = token.database.username;
        this.dbDatabase = token.database.database;
        this.dbPassword = token.database.password;
        this.dbServer = token.database.server;
        this.dbPort = token.database.port;
        this.time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`
    }
    connection() {
        return mysql.createConnection({
            user: this.dbUsername,
            database: this.dbDatabase,
            password: this.dbPassword,
            host: this.dbServer,
            port: this.dbPort
        })
    }
    tryConnection() {
        this.connection().query(`CREATE TABLE IF NOT EXISTS test (test VARCHAR(30))`, (err) => {
            if(err) throw err;
            let time = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`
            console.log(`[${time}] The connection between the client and the db has been successfully established.`)
        });
    }

}
module.exports = {
    Database
}
