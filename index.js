'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/aplicacion-musica', {
  useMongoClient: true,
},
  (err, res) => {
  if(err){
    throw err;
  }else{
    console.log('Conexión con la base de datos establecida');
    app.listen(port, () => {
      console.log('Servidor del ApiRest escuchando');
    })
  }
})
