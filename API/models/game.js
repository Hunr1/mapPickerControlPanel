const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let Game = new Schema({
    gameName: { type:String, required:true, unique:true},
    logo : { type:String, required:false },
    creator : { type:String, required:false },
    maps:[{
        type:Schema.Types.ObjectId,
        ref:'Map'
    }],
    mapPools:[{
        type:Schema.Types.ObjectId,
        ref:'MapPool'
    }],
    gameFormat:[{
        type:Schema.Types.ObjectId,
        ref:'GameFormat'
    }]
});

module.exports = mongoose.model('Game', Game);
Game.plugin(uniqueValidator);