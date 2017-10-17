'use strict'
var Usuario = require('../modelos/usuario');
var jwt = require('../servicios/jwt');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

function guardarUsuario(req, res) {
  var usuario = new Usuario;
  var parametros = req.body;
  usuario.nombre = parametros.nombre;
  usuario.email = parametros.email;
  usuario.apellidos = '';
  usuario.tipo = 'usuario';
  usuario.imagen = '';
  usuario.seguidos = [];

  if(usuario.nombre != null & usuario.email != null & parametros.password != null){
    bcrypt.hash(parametros.password, null, null, (err, hash) => {
      usuario.password = hash;
    })
    Usuario.findOne({email: usuario.email}, (err, usuarioBuscado) => {
      if(err){
        res.status(500).send({message: 'Error al comprobar al usuario'});
      }else{
        if(!usuarioBuscado){
          usuario.save((err, usuarioGuardado) => {
            if(err){
              res.status(500).send({message: 'Error al guardar el usuario'});
            }else{
              if(!usuarioGuardado){
                res.status(400).send({message: 'No se pudo guardar el usuario'});
              }else{
                res.status(200).send({usuario: usuarioGuardado});
              }
            }
          })
        }else{
          res.status(400).send({message: 'Este email ya se encuentra registrado'});
        }
      }
    })
  }else{
    res.status(400).send({message: 'Introduce todos los datos'});
  }
}

function iniciarSesion(req, res){
  var parametros = req.body;
  var email = parametros.email;
  var password = parametros.password;
  Usuario.findOne({email: email}, (err, usuario) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion'});
    }else{
      if(!usuario){
        res.status(400).send({message: 'El usuario no se encuentra registrado'});
      }else{
        bcrypt.compare(password, usuario.password, (err, check) => {
          if(check){
            if(parametros.token){
              res.status(200).send({token: jwt.crearToken(usuario)});
            }else{
              res.status(200).send({message: usuario});
            }
          }else{
            res.status(400).send({message: 'Contraseña incorrecta'});
          }
        })
      }
    }
  })
}

function actualizarUsuario(req, res){
  var usuarioId = req.params.id;
  var actualizar = req.body;

  if(usuarioId != req.usuario.sub){
    return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
  }
  Usuario.findByIdAndUpdate(usuarioId, actualizar, {new: true}, (err, usuarioActualizado) => {
    if(err){
      res.status(500).send({message: 'Error al actualizar al usuario'});
    }else{
      if(!usuarioActualizado){
        res.status(400).send({message: 'No existe el usuario'});
      }else{
        res.status(200).send({usuario: usuarioActualizado});
      }
    }
  })
}

function subirImagen(req, res){
  var usuarioId = req.params.id;
  var file_name = '';
  if(req.files){
    var file_path = req.files.imagen.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg'){
      Usuario.findByIdAndUpdate(usuarioId, {imagen: file_name}, {new: true}, (err, usuarioActualizado) => {
        if(err){
          res.status(500).send({message: 'Ocurrio un error al actualizar al usuario'});
        }else{
          if(!usuarioActualizado){
            res.status(400).send({message: 'No se pudo subir la imagen del usuario'});
          }else{
            res.status(200).send({usuario: usuarioActualizado});
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
  var pathImagen = './archivos-subidos/usuarios/' + imagen;
  fs.exists(pathImagen, (exists) => {
    if(exists){
      res.sendFile(path.resolve(pathImagen));
    }else{
      res.status(200).send({message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  guardarUsuario,
  iniciarSesion,
  actualizarUsuario,
  subirImagen,
  obtenerImagen
};
