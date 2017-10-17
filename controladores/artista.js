'use strict'
var Artista = require('../modelos/artista');
var Album = require('../modelos/album');
var Cancion = require('../modelos/cancion');
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

function guardarArtista(req, res){
  var artista = new Artista;
  var parametros = req.body;
  artista.nombre = parametros.nombre;
  artista.bio = '';
  artista.imagen = '';
  artista.facebook = '';
  artista.twitter = '';
  artista.instagram = '';
  artista.generos = '';

  if(artista.nombre != null){
    Artista.findOne({nombre: artista.nombre}, (err, artistaBuscado) => {
      if(err){
        res.status(500).send({message: 'Ocurrio un error al buscar al artista'});
      }else{
        if(!artistaBuscado){
          artista.save((err, artistaGuardado) => {
            if(err){
              res.status(500).send({message: 'Ocurrio un error al querer guardar al artista'});
            }else{
              if(!artistaGuardado){
                res.status(400).send({message: 'No se pudo guardar al artista'});
              }else{
                res.status(200).send({artista: artistaGuardado});
              }
            }
          })
        }else{
          res.status(400).send({message: 'Este artista ya existe'});
        }
      }
    });
  }else{
    res.status(400).send({message: 'Introduce todos los datos'});
  }
}

function obtenerArtista(req, res){
  var artistaId = req.params.id;

  Artista.findById(artistaId, (err, artistaBuscado) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error al buscar al artista'});
    }else{
      if(!artistaBuscado){
        res.status(400).send({message: 'El artista no existe'});
      }else{
        res.status(200).send({artista: artistaBuscado});
      }
    }
  })
}

function actualizarArtista(req, res){
  var artistaId = req.params.id;
  var actualizar = req.body;

  Artista.findByIdAndUpdate(artistaId, actualizar, {new: true}, (err, artistaActualizado) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error al actualizar al artista'});
    }else{
      if(!artistaActualizado){
        res.status(400).send({message: 'El artista no existe'});
      }else{
        res.status(200).send({artista: artistaActualizado});
      }
    }
  })
}

function obtenerArtistas(req, res){
  if(req.params.pagina){
    var pagina = req.params.pagina;
  }else{
    var pagina = 1;
  }
  var itemXPagina = 8;

  Artista.find().sort('nombre').paginate(pagina, itemXPagina, (err, artistas, total) => {
    if(err){
      res.status(500).send({message: 'Ocurrio un error en la peticion'});
    }else{
      if(!artistas){
        res.status(400).send({message: 'No hay artistas'});
      }else{
        res.status(200).send({
          total: total,
          artistas: artistas
        });
      }
    }
  })
}

function eliminarArtista(req, res){
  var artistaId = req.params.id;

  Artista.findByIdAndRemove(artistaId, (err, artistaEliminado) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion'});
    }else{
      if(!artistaEliminado){
        res.status(400).send({message: 'El artista no ha sido eliminado'});
      }else{
        Album.find({artista: artistaEliminado._id}).remove((err, albumEliminado) => {
          if(err){
            res.status(500).send({message: 'Ocurrio un error en la peticion'});
          }else{
            if(!albumEliminado){
              res.status(400).send({message: 'El album no ha sido eliminado'});
            }else{
              Cancion.find({album: albumEliminado._id}).remove((err, cancionEliminado) => {
                if(err){
                  res.status(500).send({message: 'Error en la peticion'});
                }else{
                  if(!cancionEliminado){
                    res.status(400).send({message: 'No se elimino la cancion'});
                  }else{
                    res.status(200).send({artista: artistaEliminado});
                  }
                }
              })
            }
          }
        })
      }
    }
  })
}

function subirImagen(req, res){
  var artistaId = req.params.id;
  var file_name = '';
  if(req.files){
    var file_path = req.files.imagen.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg'){
      Artista.findByIdAndUpdate(artistaId, {imagen: file_name}, {new: true}, (err, artistaActualizado) => {
        if(err){
          res.status(500).send({message: 'Ocurrio un error al actualizar al artista'});
        }else{
          if(!artistaActualizado){
            res.status(400).send({message: 'No se pudo subir la imagen del artista'});
          }else{
            res.status(200).send({artista: artistaActualizado});
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
  var pathImagen = './archivos-subidos/artistas/' + imagen;
  fs.exists(pathImagen, (exists) => {
    if(exists){
      res.sendFile(path.resolve(pathImagen));
    }else{
      res.status(200).send({message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  guardarArtista,
  obtenerArtista,
  actualizarArtista,
  obtenerArtistas,
  eliminarArtista,
  subirImagen,
  obtenerImagen
}
