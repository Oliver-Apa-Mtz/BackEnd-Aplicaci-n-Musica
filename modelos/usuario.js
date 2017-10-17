'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
  nombre: {type: String, required: true},
  apellidos: String,
  email: {type: String, unique: true, lowercase: true, required: true},
  password: {type: String, required: true},
  tipo: String,
  imagen: String,
  fechaRegistro: {type: Date, default: Date.now},
  seguidos: Array
})

module.exports = mongoose.model('Usuario', UsuarioSchema);
