'use strict'
var Album = require('../modelos/album');
var Cancion = require('../modelos/cancion');
var fs = require('fs');
var path = require('path');

function crearAlbum(req, res){
  var album = new Album;
  var parametros = req.body;
  album.titulo = parametros.titulo;
  album.descripcion = parametros.descripcion;
  album.fechaPublicado = parametros.fechaPublicado;
  album.imagen = '';
  album.artista = parametros.artista;

  album.save((err, albumGuardado) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!albumGuardado){
        res.status(400).send({message: 'No se pudo guardar el album'});
      }else{
        res.status(200).send({album: albumGuardado});
      }
    }
  })
}

function actualizarAlbum(req, res){
  var albumId = req.params.id;
  var actualizar = req.body;

  Album.findByIdAndUpdate(albumId, actualizar, {new: true}, (err, albumActualizado) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!albumActualizado){
        res.status(400).send({message: 'No se pudo actualizar el album'});
      }else{
        res.status(200).send({album: albumActualizado});
      }
    }
  })
}

function obtenerAlbum(req, res){
  var albumId = req.params.id;
  Album.findById(albumId).populate({path: 'artista'}).exec((err, albumBuscado) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error al buscar el album'});
    }else{
      if(!albumBuscado){
        res.status(400).send({message: 'No existe el album'});
      }else{
        res.status(200).send({album: albumBuscado});
      }
    }
  })
}

function obtenerAlbums(req, res){
  var artistaId = req.params.id;
  if(!artistaId){
    var find = Album.find({}).sort('fechaPublicado')
  }else{
    var find = Album.find({artista: artistaId}).sort('fechaPublicado')
  }
  find.populate({path: 'artista'}).exec((err, albums) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!albums){
        res.status(400).send({message: 'No hay albums'});
      }else{
        res.status(200).send({albums: albums});
      }
    }
  })
}

function eliminarAlbum(req, res){
  var albumId = req.params.id;
  Album.find(albumId).remove((err, albumEliminado) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!albumEliminado){
        res.status(400).send({message: 'No se pudo eliminar el album'});
      }else{
        Cancion.find({album: albumEliminado._id}).remove((err, cancionEliminada) => {
          if(err){
            res.status(500).send({message: 'Ocurrio un error en la peticion'});
          }else{
            if(!cancionEliminada){
              res.status(400).send({message: 'No se pudo eliminar la cancion'});
            }else{
              res.status(200).send({album: albumEliminado});
            }
          }
        })
      }
    }
  })
}

function subirImagen(req, res){
  var albumId = req.params.id;
  var file_name = '';
  if(req.files){
    var file_path = req.files.imagen.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg'){
      Album.findByIdAndUpdate(albumId, {imagen: file_name}, (err, albumActualizado) => {
        if(err){
          res.status(500).send({message: 'Ocurrio un error al actualizar el album'});
        }else{
          if(!albumActualizado){
            res.status(400).send({message: 'No se pudo subir la imagen del album'});
          }else{
            res.status(200).send({artista: albumActualizado});
          }
        }
      })
    }else{
      res.status(200).send({message: 'Extension de archivo no valido'});
    }
  }else{
    res.status(200).send({message: 'No se ha subido ninguna imagen'});
  }
}

function obtenerImagen(req, res){
  var imagen = req.params.imagen;
  var pathImagen = './archivos-subidos/album/' + imagen;
  fs.exists(pathImagen, (exists) => {
    if(exists){
      res.sendFile(path.resolve(pathImagen));
    }else{
      res.status(200).send({message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  crearAlbum,
  actualizarAlbum,
  obtenerAlbum,
  obtenerAlbums,
  eliminarAlbum,
  subirImagen,
  obtenerImagen
}
