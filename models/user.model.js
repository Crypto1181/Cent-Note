const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

    firstname:{type:String, require:true},
    lastname:{type:String, require:true},
     email: {type:String, required:true, unique:true},
     password: {type:String, required:true, select:false},
     balance: {type:Number, required:true, default:0},
     profileImage: {type:String, default: ''}


}, {timestamps:true, strict:'throw'})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel