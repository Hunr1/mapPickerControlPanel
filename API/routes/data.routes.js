const express = require('express');
const app = express();
const dataRoutes = express.Router();
const mongoose = require('mongoose');

let Version = require('../models/version');
let Game = require('../models/game');
let Map = require('../models/map');
let MapPool = require('../models/mapPool');
let GameFormat = require('../models/gameFormat');

//###################  DATA + VERSION CONTROL  ########################

//------------------------Only used once-----------------------------
//------------------------------add------------------------------------

dataRoutes.route('/add').post(function (req, res) {
    console.log('version ' + req.body.version);

    let version = new Version();
    version.version  = req.body.version;
    version.accessCode = req.body.accessCode;
    console.log(req.body);
    
    version.save(function (err) {
        if(!err){
            console.log( "new version saved" );
            res.status(200).json({'saved': version});
        }
        else{
            res.status(400).send(err); 
        }
    });
});

//----------------------update to new version--------------------------

dataRoutes.route('/version/update').post(function (req, res) {
    console.log("Searching latest version " );
    Version.findOne({}, [], { $orderby : { 'version' : 1 } })
    .exec(function(err, version) {
      if (!version)
        res.status(404).send("Coulnd't find latest version");
      else {
        if(version.accessCode == req.body.accessCode)
            {
            version.version = version.version+1;
            version.save().then(Game => {
                res.json('Update complete to version ' + version.version);
            })
            .catch(err => {
                res.status(400).send("unable to update version to the database");
            });
        }
        else{
            res.status(400).send("Invalid access code");
        }
      }
    });
  });

  //------------------get latest version number--------------------------

dataRoutes.route('/version/get').get(function (req, res) {
    console.log("Searching latest version " );
    Version.findOne({}, [], { $orderby : { 'version' : 1 } })
    .exec(function(err, version) {
      if (!version)
        res.status(404).send("Coulnd't find latest version");
      else {
        res.status(200).json({'version': version.version});
      }
    });
  });


  //------------used on app start if new version avaible----------------
  //--------------------get all current data----------------------------
  dataRoutes.route('/version/getData').get(function (req, res) {
    let returnValue = new Version();
    console.log("Searching latest version " );
    Version.findOne({}, [], { $orderby : { 'version' : 1 } })
    .populate({
        path:'games',
        populate:{
            path:'maps',
            model:'Map', 
        }
    })
    .populate({
        path:'games',
        populate:{
            path:'gameFormat',
            model:'GameFormat',   
        },
    })
    .populate({
        path:'games',
        populate:{
            path:'mapPools',
            model:'MapPool',   
            populate:{
                path:'maps',
                model:'Map'
            }
        },
    })
    .exec(function(err, version) {
      if (!version)
        res.status(404).send("Coulnd't find latest version");
      else {
        res.status(200).json({'allData': version});
      }
    });
  });



//############################  GAME  #################################

//------------------------------get------------------------------------

dataRoutes.route('/game/get').get(function (req, res) {
    console.log("Getting games");
    try{
        Game.find().exec(function(err,games){
            if(!games){
                res.status(400).send( "Couldn't get games" );
            }
            else{
                res.status(200).json({games});
            }  
        })
    } catch(e){
        res.status(400).send( "Unknown error" );
    }
});


//------------------------------add------------------------------------

dataRoutes.route('/game/add').post(function (req, res) {

    let game = new Game({
        _id: new mongoose.Types.ObjectId(),
        gameName : req.body.gameName,
        logo : req.body.logo,
        creator : req.body.creator
    });

    try{
        console.log( "trying to find Version" );
        Version.findOne({}, [], { $orderby : { 'version' : 1 } }, function(err, version) {
            if(!err){
                console.log( "found " + version );
                console.log( "yritetään tallentaa " + game._id );
                    try {
                        version.updateOne(
                        {$push:{games:game._id}},
                        function(err,callback){
                            if(!err){
                                game.save(function (err) {
                                    if(!err){
                                        console.log( "game id saved" );
                                        res.status(200).json({'saved': game});
                                    }
                                    else{
                                        res.status(400).send(err); 
                                    }
                                });   
                            }
                            else{
                                console.log( "game id not saved" );
                                res.status(400).send("couldn't save game id" );
                            }
                        }       
                    )
                    }
                    catch (e) {
                    console.log( "couldn't find latest version of data" );
                    res.status(400).send( "couldn't find latest version of data" );
                }
            }
            else{
                console.log( "error " + err );
                res.status(400).send("Error "  + err);
            }
        })      
    } catch(e){
        res.status(400).send( "Unknown error" );
    }
});

//------------------------------update------------------------------------

dataRoutes.route('/game/update').post(function (req, res) {
    console.log("Searching game with name " + req.body.gameNameOld);
    Game.findOne({gameName:req.body.gameNameOld})
    .exec(function(err, game) {
      if (!game)
        res.status(404).send("Record not found");
      else {
        
        if(!req.body.gameNameNew == ""){
            game.gameName = req.body.gameNameNew;
            console.log("Changing game name")
        }
        game.logo = req.body.logo;
        game.creator = req.body.creator;

        game.save().then(Game => {
            res.json('Update complete');
        })
        .catch(err => {
              res.status(400).send("unable to update the database");
        });
      }
    });
});

//------------------------------delete------------------------------------

dataRoutes.route('/game/delete').delete(function (req, res) {
    
    try{
        var gameID = new mongoose.Types.ObjectId();
        var gameNameIn = req.query.gameName;
        Game.findOne({gameName:req.query.gameName}).exec(function(err,game){
            
            if(!game){
                res.status(400).send("couldn't find game with that name" );
            }
            else{
                gameID=game._id;
                console.log( "trying to find Version" );
                Version.findOne({}, [], { $orderby : { 'version' : 1 } }, function(err, version) {
                    if(!err){
                        console.log( "found " + version );
                        console.log( "yritetään poistaa " + gameID );
                            try {
                                version.updateOne(
                                {$pull:{games:gameID}},
                                function(err,callback){
                                    if(!err){
                                        Game.remove({gameName:req.query.gameName}).exec(function(err,game){
                                            res.status(200).json({'removed': game});
                                            console.log( "removed " + game );
                                        });
                                        
                                        Map.remove({gameName:req.query.gameName}).exec(function(err,map){
                                            console.log( "removed " + map );
                                        });     
                                        MapPool.remove({gameName:req.query.gameName}).exec(function(err,mapPool){
                                            console.log( "removed " + mapPool );
                                        });                                 
                                        GameFormat.remove({gameName:req.body.gameName}).exec(function(err,gameFormat){
                                            console.log( "removed " + gameFormat );
                                        });
                                    }
                                    else{
                                        console.log( "game id not removed" );
                                        res.status(400).send("couldn't remove game id" );
                                    }
                                }       
                            )
                            }
                            catch (e) {
                            console.log( "couldn't find latest version of data" );
                            res.status(400).send( "couldn't find latest version of data" );
                        }
                    }
                    else{
                        console.log( "error " + err );
                        res.status(400).send("Error "  + err);
                    }
                })      
            }
        });
    } catch(e){
        res.status(400).send( "Unknown error" );
    }
});



//############################  MAP  ##################################

//------------------------------get------------------------------------
dataRoutes.route('/map/get').get(function (req, res) {
    console.log("Getting maps");
    try{
        Map.find({gameName:req.query.gameName}).exec(function(err,maps){
            if(!maps){
                res.status(400).send( "Couldn't get maps" );
            }
            else{
                res.status(200).json({maps});
            }  
        })
    } catch(e){
        res.status(400).send( "Unknown error" );
    }
});

//------------------------------add------------------------------------

dataRoutes.route('/map/add').post(function (req, res) {
    
    
    let map = new Map({
        _id: new mongoose.Types.ObjectId(),
        gameName:req.body.gameName,
        mapName : req.body.mapName,
        mapImage: req.body.mapImage
    });

    try{
        console.log( "trying to find data" );
        Game.findOne({gameName:req.body.gameName}, [], {}, function(err, game) {
            if(!err){
                console.log( "found " + game );
                console.log( "Trying to save new map" + map._id );
                    try {
                        game.updateOne(
                        {$push:{maps:map._id}},
                        function(err,callback){
                            if(!err){
                                map.save(function (err) {
                                    if(!err){
                                        console.log( "mapsaved" );
                                        res.status(200).json({'saved': map});
                                    }
                                    else{
                                        res.status(400).send(err); 
                                    }
                                });
                            }
                            else{
                                console.log( "map id not saved" );
                                res.status(400).send("couldn't save map id" );
                            }
                        }          
                    )
                    }
                    catch (e) {
                    console.log( "couldn't find game with that name" );
                    res.status(400).send("couldn't find game with that name" );
                }
            }
            else{
                console.log( "error " + err );
                res.status(400).send("Error "  + err);
            }
        })      
    } catch(e){
        res.status(400).send("Unknown error" );
    }
});

//------------------------------update------------------------------------

dataRoutes.route('/map/update').post(function (req, res) {
    console.log("Searching map with name " + req.body.mapNameOld);
    Game.findOne({gameName:req.body.gameName}).exec(function(err,game){    
        if(!game){
            res.status(400).send("Couldn't find game with that name"); 
        }
        else{
            Map.findOne({mapName:req.body.mapNameOld})
            .exec(function(err, map) {
            if (!map)
                res.status(404).send("Record not found");
            else {       
                if(!req.body.mapNameNew == ""){
                    map.mapName = req.body.mapNameNew;
                    console.log("Changing map name")
                }
                map.gameName = req.body.gameName;
                map.mapImage = req.body.mapImage;
                map.save().then(Game => {
                    res.json('Update complete');
                })
                .catch(err => {
                    res.status(400).send("unable to update the database");
                });
            }
             });
        }  
    });
});

//------------------------------delete------------------------------------

dataRoutes.route('/map/delete').delete(function (req, res) { 
    try{
        Map.findOne({mapName:req.query.mapName}).exec(function(err,map){        
            if(!map){
                res.status(400).send("couldn't find map with that name" );
            }
            else{          
                console.log( "trying to find data" );
                Game.findOne({gameName:req.query.gameName}, [], {}, function(err, game) {
                    if(!err){
                    console.log( "found " + game );
                    console.log( "Trying to remove map reference" + map._id );
                    try {
                        game.updateOne(
                        {$pull:{maps:map._id}},
                        function(err,callback){
                            if(!err){
                                MapPool.updateMany(
                                    {$pull:{maps:map._id}},
                                    function(err,callback){
                                        if(!err){
                                            Map.findOneAndDelete({mapName:req.query.mapName}).exec(function(err,map){        
                                                if(!map){
                                                    res.status(400).send("couldn't find map with that name" );
                                                }
                                                else{
                                                    res.status(200).json({'removed': map});
                                                }
                                            });
                                        }
                                        else{
                                            console.log( "map id not saved" );
                                            res.status(400).send("couldn't save map id" );
                                        }
                                    }
                                )
                            }
                            else{
                                console.log( "map id not saved" );
                                res.status(400).send("couldn't save map id" );
                            }
                        })                          
                    }
                    catch (e) {
                    console.log( "couldn't find game with that name" );
                    res.status(400).send("couldn't find game with that name" );
                    }
                }
                    else{
                        console.log( "error " + err );
                        res.status(400).send("Error "  + err);
                    }
                })      
            }
        });
    } catch(e){
        res.status(400).send("Unknown error" );
    }
});



//##########################  MAP POOL  ###############################


//------------------------------get------------------------------------
dataRoutes.route('/mapPool/get').get(function (req, res) {
    console.log("Getting maps");
    try{
        MapPool.find({gameName:req.query.gameName}).populate(
            {
                path:'maps',
                populate:{
                    path:'maps',
                    model:'Map', 
                }
            }
        ).exec(function(err,mapPool){
            if(!mapPool){
                res.status(400).send( "Couldn't get map pools" );
            }
            else{
                res.status(200).json({mapPool});
            }  
        })
    } catch(e){
        res.status(400).send( "Unknown error" );
    }
});

//------------------------------add------------------------------------

dataRoutes.route('/mapPool/add').post(function (req, res) {
    let mapPool = new MapPool({
        gameName:req.body.gameName,
        _id: new mongoose.Types.ObjectId(),
        poolName:req.body.poolName
    });

    try{
        console.log( "trying to find data" );
        Game.findOne({gameName:req.body.gameName}, [], {}, function(err, game) {
            if(!err){
                console.log( "found " + game );
                console.log( "Trying to save new map pool" + mapPool._id );
                    try {
                        game.updateOne(
                        {$push:{mapPools:mapPool._id}},
                        function(err,callback){
                            if(!err){
                                mapPool.save(function (err) {
                                    if(!err){
                                        console.log( "map pool saved " );
                                        res.status(200).json({'saved': mapPool});
                                    }
                                    else{
                                        res.status(400).send(err); 
                                    }
                                });
                            }
                            else{
                                console.log( "map pool id not saved" );
                                res.status(400).send("couldn't save map pool id" );
                            }
                        }          
                    )
                    }
                    catch (e) {
                    console.log( "couldn't find game with that name" );
                    res.status(400).send("couldn't find game with that name" );
                }
            }
            else{
                console.log( "error " + err );
                res.status(400).send("Error "  + err);
            }
        })      
    } catch(e){
        res.status(400).send("Unknown error" );
    }
});

//------------------------------update------------------------------------

dataRoutes.route('/mapPool/update').post(function (req, res) {
    console.log("Searching map pool with name " + req.body.poolNameOld);
    
    Game.findOne({gameName:req.body.gameName}).exec(function(err,game){    
        if(!game){
            res.status(400).send("Couldn't find game with that name"); 
        }
        else{
            MapPool.findOne({poolName:req.body.poolNameOld})
            .exec(function(err, mapPool) {
                if (!mapPool)
                    res.status(404).send("Record not found");
                else {
                    
                    if(!req.body.poolNameNew == ""){
                        mapPool.gameName = req.body.gameName;
                        mapPool.poolName = req.body.poolNameNew;
                        console.log("Changing map pool name")
                    }
                    mapPool.save().then(Game => {
                        res.json('Update complete');
                    })
                    .catch(err => {
                        res.status(400).send("unable to update the database");
                    });
                }
            });
        }
    });
    
});

//------------------------------delete------------------------------------

dataRoutes.route('/mapPool/delete').delete(function (req, res) { 
    try{
        MapPool.findOne({poolName:req.query.poolName}).exec(function(err,mapPool){        
            if(!mapPool){
                res.status(400).send("couldn't find map pool with that name" );
            }
            else{          
                console.log( "trying to find data" );
                Game.findOne({gameName:req.query.gameName}, [], {}, function(err, game) {
                    if(!err){
                    console.log( "found " + game );
                    console.log( "Trying to remove map pool reference" + mapPool._id );
                    try {
                        game.updateOne(
                        {$pull:{mapPools:mapPool._id}},
                        function(err,callback){
                            if(!err){
                                MapPool.findOneAndDelete({poolName:req.query.poolName}).exec(function(err,mapPool){        
                                    if(!mapPool){
                                        res.status(400).send("couldn't find map with that name" );
                                    }
                                    else{
                                        res.status(200).json({'removed': mapPool});
                                    }
                                });
                            }
                            else{
                                console.log( "map pool id not removed" );
                                res.status(400).send("couldn't remove map pool id" );
                            }
                        })                          
                    }
                    catch (e) {
                    console.log( "couldn't find game with that name" );
                    res.status(400).send("couldn't find game with that name" );
                    }
                }
                    else{
                        console.log( "error " + err );
                        res.status(400).send("Error "  + err);
                    }
                })      
            }
        });
    } catch(e){
        res.status(400).send("Unknown error" );
    }
});



//########################  MAP POOL MAPS #############################

//------------------------------add------------------------------------

dataRoutes.route('/mapPool/addMaps').post(function (req, res) {
    var mapIDs = [];

    Map.find({
        'mapName':{$in:req.body.maps},
        'gameName':req.body.gameName
    }).exec(function (error,results) {
        for(var i = 0 ; i < Object.keys(req.body.maps).length; i++){
            try{
                if(results[i] == undefined){
                    console.log("Not found " + req.body.maps[i])
                    throw "Not found " + req.body.maps[i];
                }
                else{
                    mapIDs.push(results[i]._id);
                }
                if(i==Object.keys(req.body.maps).length-1){                 
                    MapPool.findOne({poolName:req.body.poolName}, [], {}, function(err, mapPool) {
                        if(!err){
                            console.log( "Trying to save new maps to pool");
                                try {
                                    mapPool.updateOne({   
                                        $addToSet:{
                                        maps:{
                                            $each:mapIDs
                                            }
                                        }
                                    },
                                    function(err,callback){
                                        if(!err){
                                            console.log( "added new maps to pool" );
                                            res.status(200).json({'saved': mapPool});
                                        }
                                        else
                                        {
                                            console.log( "couldn't add new maps to pool" );
                                            res.status(400).send("couldn't add new maps to pool");
                                        }
                                    }          
                                    )
                                }
                                catch (e) {
                                console.log( "couldn't find map pool with that name" + req.body.poolName );
                                res.status(400).send("couldn't find map pool with that name" + req.body.poolName );
                            }
                        }
                        else{
                            console.log( "error " + err );
                            res.status(400).send("Error "  + err);
                        }
                    })                
                }
            }catch(e){
                res.status(400).send(e);
                break;
            }
        }   
    });

   
});

//----------------------------remove-----------------------------------

dataRoutes.route('/mapPool/removeMaps').post(function (req, res) {
    var mapIDs = [];

    Map.find({
        'mapName':{$in:req.body.maps},
        'gameName':req.body.gameName
    }).exec(function (error,results) {
        for(var i = 0 ; i < Object.keys(req.body.maps).length; i++){
            try{
                if(results[i] == undefined){
                    console.log("Not found " + req.body.maps[i])
                    throw "Not found " + req.body.maps[i];
                }
                else{
                    mapIDs.push(results[i]._id);
                    console.log("Puskettiin id " + results[i]._id)
                }
                if(i==Object.keys(req.body.maps).length-1){                 
                    MapPool.findOne({poolName:req.body.poolName}, [], {}, function(err, mapPool) {
                        if(!err){
                            console.log( "Trying to delete maps from pool");
                                try {
                                    mapPool.updateOne({
                                        $pull:{
                                        maps:{
                                            $in:mapIDs
                                            }
                                        }
                                    },
                                    function(err,callback){
                                        if(!err){
                                            console.log( "removed maps from pool" );
                                            res.status(200).json({'':"success"});
                                        }
                                        else
                                        {
                                            console.log( "couldn't remove maps from pool" );
                                            res.status(400).send("couldn't remove maps from pool");
                                        }
                                    }          
                                    )
                                }
                                catch (e) {
                                console.log( "couldn't find map pool with that name" + req.body.poolName);
                                res.status(400).send("couldn't find map pool with that name" + req.body.poolName );
                            }
                        }
                        else{
                            console.log( "error " + err );
                            res.status(400).send("Error "  + err);
                        }
                    })                
                }
            }catch(e){
                res.status(400).send(e);
                break;
            }
        }   
    });   
});



//########################  GAME FORMATS ##############################
//------------------------------add------------------------------------

dataRoutes.route('/gameFormat/get').get(function (req, res) {
    console.log("Getting game formats");
    try{
        GameFormat.find({gameName:req.query.gameName}).exec(function(err,format){
            if(!format){
                res.status(400).send( "Couldn't get map pools" );
            }
            else{
                res.status(200).json({format});
            }  
        })
    } catch(e){
        res.status(400).send( "Unknown error" );
    }
});

//------------------------------add------------------------------------

dataRoutes.route('/gameFormat/add').post(function (req, res) {
    let gameFormat = new GameFormat({
        formatName : req.body.formatName,
        winsRequired : req.body.winsRequired,
        gameName:req.body.gameName
    });

    try{
        console.log( "trying to find data" );
        Game.findOne({gameName:req.body.gameName}, [], {}, function(err, game) {
            if(!err){
                console.log( "found " + game );
                console.log( "Trying to save new format" + gameFormat._id );
                    try {
                        game.updateOne(
                        {$push:{gameFormat:gameFormat._id}},
                        function(err,callback){
                            if(!err){
                                gameFormat.save(function (err) {
                                    if(!err){
                                        console.log( "game format saved " );
                                        res.status(200).json({'saved': gameFormat});
                                    }
                                    else{
                                        res.status(400).send(err); 
                                    }
                                });
                            }
                            else{
                                console.log( "game format id not saved" );
                                res.status(400).send("couldn't save new game format id" );
                            }
                        }          
                    )
                    }
                    catch (e) {
                    console.log( "couldn't find game with that name" );
                    res.status(400).send("couldn't find game with that name" );
                }
            }
            else{
                console.log( "error " + err );
                res.status(400).send("Error "  + err);
            }
        })      
    } catch(e){
        res.status(400).send("Unknown error" );
    }
});   

//------------------------------update------------------------------------

dataRoutes.route('/gameFormat/update').post(function (req, res) {
    console.log("Searching game format with name " + req.body.formatNameOld);
    Game.findOne({gameName:req.body.gameName}).exec(function(err,game){    
        if(!game){
            res.status(400).send("Couldn't find game with that name"); 
        }
        else{
            console.log("Found game");
            GameFormat.findOne({formatName:req.body.formatNameOld})
            .exec(function(err, format) {
                if (!format)
                    res.status(404).send("Record not found");
                else {            
                    if(!req.body.formatNameNew == ""){
                        format.formatName = req.body.formatNameNew;
                        console.log("Changing game format name")
                    }
                    format.winsRequired = req.body.winsRequired;
                    format.gameName=req.body.gameName;
                    format.winsRequired=req.body.winsRequired;
                    format.save().then(Game => {
                        res.json('Update complete');
                    })
                    .catch(err => {
                        res.status(400).send("unable to update the database");
                    });
                }
            });   
        }  
    });
});

//------------------------------delete------------------------------------

dataRoutes.route('/gameFormat/delete').delete(function (req, res) { 
    try{
        GameFormat.findOne({formatName:req.query.formatName}).exec(function(err,gameFormat){        
            if(!gameFormat){
                res.status(400).send("couldn't find game format with that name" );
            }
            else{          
                console.log( "trying to find data" );
                Game.findOne({gameName:req.query.gameName}, [], {}, function(err, game) {
                    if(!err){
                    console.log( "found " + game );
                    console.log( "Trying to remove game format reference" + gameFormat._id );
                    try {
                        game.updateOne(
                        {$pull:{gameFormat:gameFormat._id}},
                        function(err,callback){
                            if(!err){
                                GameFormat.findOneAndDelete({formatName:req.query.formatName}).exec(function(err,gameFormat){        
                                    if(!gameFormat){
                                        res.status(400).send("couldn't find game format with that name" );
                                    }
                                    else{
                                        res.status(200).json({'removed': gameFormat});
                                    }
                                });
                            }
                            else{
                                console.log( "map pool id not removed" );
                                res.status(400).send("couldn't remove map pool id" );
                            }
                        })                          
                    }
                    catch (e) {
                    console.log( "couldn't find game with that name" );
                    res.status(400).send("couldn't find game with that name" );
                    }
                }
                    else{
                        console.log( "error " + err );
                        res.status(400).send("Error "  + err);
                    }
                })      
            }
        });
    } catch(e){
        res.status(400).send("Unknown error" );
    }
});


module.exports = dataRoutes;