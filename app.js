'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//cargar rutas
var usuarioRutas = require('./rutas/usuario');
var artistaRutas = require('./rutas/artista');
var albumRutas = require('./rutas/album');
var cancionRutas = require('./rutas/cancion');
//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
})
//rutas body-parser
app.use('/api', usuarioRutas);
app.use('/api', artistaRutas);
app.use('/api', albumRutas);
app.use('/api', cancionRutas);

module.exports = app;
