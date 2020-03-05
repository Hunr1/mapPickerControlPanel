const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let Version = new Schema({
        time : { type : Date, default: Date.now, required: false },
        version: { type:Number, required:true, unique:true },
        accessCode:{ type:String, required:true },
        games: [{
            type:Schema.Types.ObjectId,
            ref:'Game'
        }]
});

module.exports = mongoose.model('Version', Version);
Version.plugin(uniqueValidator);