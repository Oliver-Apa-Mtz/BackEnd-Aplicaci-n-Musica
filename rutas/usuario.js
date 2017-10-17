'use strict'
var express =  require('express');
var multipart = require('connect-multiparty');
var UsuarioControlador = require('../controladores/usuario');
var md_Auth = require('../middlewares/autenticar');
var md_upload = multipart({uploadDir: './archivos-subidos/usuarios'});

var app = express.Router();

app.post('/registro', UsuarioControlador.guardarUsuario);
app.post('/login', UsuarioControlador.iniciarSesion);
app.put('/actualizar-usuario/:id', md_Auth.comprobarAutenticacion, UsuarioControlador.actualizarUsuario);
app.post('/subir-imagen-usuario/:id', [md_Auth.comprobarAutenticacion, md_upload], UsuarioControlador.subirImagen);
app.get('/obtener-imagen-usuario/:imagen', UsuarioControlador.obtenerImagen);

module.exports = app;
