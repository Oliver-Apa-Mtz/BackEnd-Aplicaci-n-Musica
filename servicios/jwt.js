'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_aplicacion_mercado';

exports.crearToken = (usuario) => {
  var payload = {
    sub: usuario._id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    tipo: usuario.tipo,
    imagen: usuario.imagen,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  }
  return jwt.encode(payload, secret);
}
