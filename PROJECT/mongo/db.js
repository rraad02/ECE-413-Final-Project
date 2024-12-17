// to use mongoDB
const mongoose = require("mongoose"); // to use mongoose
mongoose.set('strictQuery', true); 
mongoose.connect("mongodb://127.0.0.1/mydb", { useNewUrlParser: true, useUnifiedTopology:true }); //connect locally
 
module.exports = mongoose;