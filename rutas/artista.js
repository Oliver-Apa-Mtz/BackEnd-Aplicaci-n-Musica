'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var ArtistaControlador = require('../controladores/artista');
var md_Auth = require('../middlewares/autenticar');
var md_upload = multipart({uploadDir: './archivos-subidos/artistas'});

var app = express.Router();

app.post('/crear-artista', md_Auth.comprobarAutenticacion, ArtistaControlador.guardarArtista);
app.get('/obtener-artista/:id', ArtistaControlador.obtenerArtista);
app.get('/obtener-artistas/:pagina?', ArtistaControlador.obtenerArtistas);
app.put('/actualizar-artista/:id', md_Auth.comprobarAutenticacion, ArtistaControlador.actualizarArtista);
app.delete('/eliminar-artista/:id', md_Auth.comprobarAutenticacion, ArtistaControlador.eliminarArtista);
app.post('/subir-imagen-artista/:id', [md_Auth.comprobarAutenticacion, md_upload], ArtistaControlador.subirImagen);
app.get('/obtener-imagen-artista/:imagen', ArtistaControlador.obtenerImagen);

module.exports = app;
