const mongoose = require("mongoose");


const userSchema=mongoose.Schema({
    email:{
        type:String,
        required: [true, "please enter a value"]
    },
    password:{
        type:String,
        required: [true, "please enter a value"]
    }
});


module.exports = mongoose.model("user", userSchema);