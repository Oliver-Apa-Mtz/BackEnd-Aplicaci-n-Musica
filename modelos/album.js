'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
  titulo: {type: String, required: true},
  descripcion: String,
  fechaPublicado: Date,
  imagen: String,
  artista: {type: Schema.ObjectId, ref: 'Artista', required: true}
});

module.exports = mongoose.model('Album', AlbumSchema);
