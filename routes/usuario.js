const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')


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
        
    }
})

module.exports = router