const localStrategy = require('passport-local').Strategy;
const passaport = require('passport')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Model de usuário
require('../models/Usuario')
const Usuario = mongoose.model('usuarios');


module.exports = function(passport){


    // Sistema de autenticação

    // Com essa parte indicamos o campo que queremos analizar
    passport.use(new localStrategy({usernamefield: 'email'}, (email, senha, done) => {

        Usuario.findOne({email: email})
        .then((usuario) => {

            if( !usuario ){

                // PARAMETROS
                // dados da conta que foi autenticada
                // se a auteticação ocorreu com sucesso
                // e a mensagem

                return done(null, false, {message: 'Essa conta não existe!'})

            }

            // Comparando 2 valores encriptados
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {

                if (batem)
                {
                    return done(null, user)
                }
                else
                {
                    return done(null, false, {message: 'Senha incorreta!'})
                }
                

            })

        })
    }))


    // Salva dados usuario numa sessão {
    passaport.serializeUser((usuario, done) => {

        done(null, usuario.id)

    })


    passaport.deserializeUser((id, done) => {

        // A função de callback está procurando um usuário pelo ID
        User.findById(id, (err, usuario) => {

            done(err, user)

        })
    })

    // }

}