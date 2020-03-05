const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let GameFormat = new Schema({
    gameName:{ type:String, required:true, unique:false },
    formatName:{ type:String, required:true, unique:false },
    winsRequired:{ type:Number, required:true, unique:false}
});

module.exports = mongoose.model('GameFormat', GameFormat);
GameFormat.plugin(uniqueValidator);