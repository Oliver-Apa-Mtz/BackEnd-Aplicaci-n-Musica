'use strict'
var Cancion = require('../modelos/cancion');
var fs = require('fs');
var path = require('path');

function crearCancion(req, res){
  var cancion = new Cancion;
  var parametros = req.body;
  cancion.titulo = parametros.titulo;
  cancion.numero = parametros.numero;
  cancion.archivo = '';
  cancion.album = parametros.album;
  cancion.artista = parametros.artista;

  cancion.save((err, cancionGuardada) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!cancionGuardada){
        res.status(400).send({message: 'No se pudo crear la cancion'});
      }else{
        res.status(200).send({cancion: cancionGuardada});
      }
    }
  })
}

function obtenerCancion(req, res){
  var cancionId = req.params.id;
  Cancion.findById(cancionId).populate({
    path: 'album',
    populate: {
      path: 'artista',
      model: 'Artista'
    }
  }).exec((err, cancion) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!cancion){
        res.status(400).send({message: 'No se encontro la cancion'});
      }else{
        res.status(200).send({cancion: cancion});
      }
    }
  })
}

function obtenerCancionesAlbum(req, res){
  var albumId = req.params.id;
  Cancion.find({album: albumId}).sort('numero').populate({
    path: 'album',
    populate: {
      path: 'artista',
      model: 'Artista'
    }
  }).exec((err, canciones) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!canciones){
        res.status(400).send({message: 'No se encontraron canciones'});
      }else{
        res.status(200).send({canciones: canciones});
      }
    }
  })
}

function obtenerCancionesArtista(req, res){
  var artistaId = req. params.id;
  Cancion.find({artista: artistaId}).sort('titulo').populate({
    path: 'album',
    populate: {
      path: 'artista',
      model: 'Artista'
    }
  }).exec((err, canciones) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!canciones){
        res.status(400).send({message: 'No se encontraron canciones'});
      }else{
        res.status(200).send({canciones: canciones});
      }
    }
  })
}

function actualizarCancion(req, res){
  var cancionId = req.params.id;
  var actualizar = req.body;

  Cancion.findByIdAndUpdate(cancionId, actualizar, {new: true}, (err, cancionActualizada) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!cancionActualizada){
          res.status(400).send({message: 'No se pudo actualizar la cancion'});
      }else{
        res.status(200).send({cancion: cancionActualizada});
      }
    }
  })
}

function eliminarCancion(req, res){
  var cancionId = req.params.id;
  Cancion.findByIdAndRemove(cancionId, (err, cancionEliminada) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!cancionEliminada){
        res.status(400).send({message: 'No se pudo eliminar la cancion'});
      }else{
        res.status(200).send({cancion: cancionEliminada});
      }
    }
  })
}

function subirAudio(req, res){
  var cancionId = req.params.id;
  var file_name = '';
  if(req.files){
    var file_path = req.files.archivo.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    if(file_ext == 'mp3'){
      Cancion.findByIdAndUpdate(cancionId, {archivo: file_name}, {new: true}, (err, cancionActualizado) => {
        if(err){
          res.status(500).send({message: 'Ocurrio un error en la peticion'});
        }else{
          if(!cancionActualizado){
            res.status(400).send({message: 'No se pudo subir el audio de la cancion'});
          }else{
            res.status(200).send({cancion: cancionActualizado});
          }
        }
      })
    }else{
      res.status(200).send({message: 'Extension de archivo no valido'});
    }
  }else{
    res.status(200).send({message: 'No se ha subido ningun audio'});
  }
}

function obtenerAudio(req, res){
  var archivo = req.params.archivo;
  var pathAudio = './archivos-subidos/cancion/' + archivo;
  fs.exists(pathAudio, (exists) => {
    if(exists){
      res.sendFile(path.resolve(pathAudio));
    }else{
      res.status(200).send({message: 'No existe el archivo'});
    }
  })
}

module.exports = {
  crearCancion,
  obtenerCancion,
  obtenerCancionesAlbum,
  obtenerCancionesArtista,
  actualizarCancion,
  subirAudio,
  obtenerAudio,
  eliminarCancion
}
