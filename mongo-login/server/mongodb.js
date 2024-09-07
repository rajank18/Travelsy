const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/login-tut")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect")
})
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }//mongodb://localhost:27017
})
const User = new mongoose.model("User",userSchema)

module.exports = User

