const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
}

module.exports = connectToDB;