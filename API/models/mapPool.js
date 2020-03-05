const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let MapPool = new Schema({
    gameName:{ type:String, required:true, unique:false},
    poolName:{ type:String, required:true, unique:true},
    maps:[{
        type:Schema.Types.ObjectId,
        ref:'Map'
    }],
});

module.exports = mongoose.model('MapPool', MapPool);
MapPool.plugin(uniqueValidator);