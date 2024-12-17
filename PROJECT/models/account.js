const db = require("../db");
//for models

const accountSchema = new db.Schema({
    username: String,
    password: String,
    frequency: Number,
    data: [{
        timestamp: { type: Date, required: true },
        spo: Number,
        heartrate: Number
    }],
    devices: [{
        name: String,
        id: String,
    }]
}); //account schema 

const Account = db.model("Account", accountSchema);

module.exports = Account;


