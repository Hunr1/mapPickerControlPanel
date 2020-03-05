const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let Map = new Schema({
    gameName:{ type:String, required:true, unique:false },
    mapName:{ type:String, required:true, unique:true },
    mapImage:{ type:String, required:false, unique:true }
});

module.exports=mongoose.model('Map',Map);
Map.plugin(uniqueValidator);