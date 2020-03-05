const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./config/database.config');
    
// links
// https://fullstackopen.com/en/part3/saving_data_to_mongo_db
  const dataRoutes = require('./routes/data.routes');
  mongoose.Promise = global.Promise;
  mongoose.connect(config.url, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false}).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
  );

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/API', dataRoutes);
  console.log('data routes ' + dataRoutes);
  const port = process.env.PORT || 4040;

  const server = app.listen(port, function(){
      console.log('Listening on port ' + port);
  });