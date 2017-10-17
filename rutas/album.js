'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var AlbumControlador = require('../controladores/album');
var md_Auth = require('../middlewares/autenticar');
var md_upload = multipart({uploadDir: './archivos-subidos/album'});

var app = express.Router();

app.post('/crear-album', md_Auth.comprobarAutenticacion, AlbumControlador.crearAlbum);
app.put('/actualizar-album/:id', md_Auth.comprobarAutenticacion, AlbumControlador.actualizarAlbum);
app.get('/obtener-album/:id', AlbumControlador.obtenerAlbum);
app.get('/obtener-albums/:id?', AlbumControlador.obtenerAlbums);
app.delete('/eliminar-album/:id',md_Auth.comprobarAutenticacion, AlbumControlador.eliminarAlbum);
app.post('/subir-imagen-album/:id', [md_Auth.comprobarAutenticacion, md_upload], AlbumControlador.subirImagen);
app.get('/obtener-imagen-album/:imagen', md_Auth.comprobarAutenticacion, AlbumControlador.obtenerImagen);

module.exports = app;
