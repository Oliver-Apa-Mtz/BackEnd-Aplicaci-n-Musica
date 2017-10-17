'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var CancionControlador = require('../controladores/cancion');
var md_Auth = require('../middlewares/autenticar');
var md_upload = multipart({uploadDir: './archivos-subidos/cancion'});

var app = express.Router();

app.post('/crear-cancion', md_Auth.comprobarAutenticacion, CancionControlador.crearCancion);
app.get('/obtener-cancion/:id', CancionControlador.obtenerCancion);
app.get('/obtener-canciones-album/:id', CancionControlador.obtenerCancionesAlbum);
app.get('/obtener-canciones-artista/:id', CancionControlador.obtenerCancionesArtista);
app.get('/actualizar-cancion/:id', md_Auth.comprobarAutenticacion, CancionControlador.actualizarCancion);
app.post('/subir-audio/:id', [md_Auth.comprobarAutenticacion, md_upload], CancionControlador.subirAudio);
app.get('/obtener-audio/:archivo', md_Auth.comprobarAutenticacion, CancionControlador.obtenerAudio);
app.delete('/eliminar-cancion/:id', md_Auth.comprobarAutenticacion, CancionControlador.eliminarCancion);

module.exports = app;
