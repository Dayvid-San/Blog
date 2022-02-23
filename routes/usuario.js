const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')


router.get('/register', (req,res)=>{
    res.render('usuarios/registro')
})

router.post('/registro', (req,res)=>{
    // Validação Usuário
    var erros = []

    // Nome
    if( ! req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push(
            {texto: 'Nome invalido'})

    }

    // Email
    if( ! req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push(
            {texto: 'E-mail invalido'})

    }

    // Senha
    if( ! req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push(
            {texto: 'Senha invalida'})

    }

    // Tamanho da senha
    if( ! req.body.senha.length < 4){
        erros.push(
            {texto: 'Senha muito curta. Você pode melhorar isso'})

    }

    // Correspondencia entre as senhas
    if(req.body.senha != req.body.senha2){
        erros.push(
            {texto: 'As senha não correspondem. Tente novamente'})
    }


    if(erros.length > 0){

        res.render('usuarios/registro', {erros: erros})

    }
    else{
        
        //Checando se o email cadastrado já existe
        Usuario.findOne({email: req.body.email})
        .then(usuario => {

            if(usuario){
                req.flash('error_msg', 'Já existe uma conta com esse e-mail no nosso sistema.')
                res.redirect('/ususarios/registro')

            }
            else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })


                // Envez de salvarmos, nós encriptamos a senha
                bcrypt.genSalt(10, (err, salt) => {

                    // PARAMETROS
                    // 1: Qual valor vai "hashear"
                    // 2: o "Sal"
                    // 3: O callback
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {

                        if(erro){
                            req.flash('erro_msg', 'Houve um erro durante o salvamento do usuário.')
                            res.redirect('/')
                            
                        }

                        // Hashando
                        novoUsuario.senha = hash

                        // Agora sim! Estamos salvando
                        novoUsuario.save()
                        .then(() => {

                            req.flash('success_msg', 'Usuário criado com sucesso!')
                            req.redirect('/')

                        })
                        .catch((err) => {

                            res.flash('err_msg', 'Teve um erro ao criar o usuário. Tente novamente!')
                            req.redirect('/')

                        })

                    })
                })
                

            }
        })
        .catch((err) => {
            
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')

        })
    }
})


router.get('/login', (req,res) => {
    res.render('usuarios/login')
})


module.exports = router