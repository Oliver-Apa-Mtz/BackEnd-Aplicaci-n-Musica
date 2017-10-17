'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CancionSchema = Schema({
  titulo: String,
  numero: String,
  archivo: String,
  album: {type: Schema.ObjectId, ref: 'Album'},
  artista: {type: Schema.ObjectId, ref: 'Artista'}
})

module.exports = mongoose.model('Cancion', CancionSchema);
