'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistaSchema = Schema({
  nombre: {type: String, unique: true, required: true},
  imagen: String,
  bio: String,
  generos: Array,
  facebook: String,
  twitter: String,
  instagram: String
});

module.exports = mongoose.model('Artista', ArtistaSchema);
