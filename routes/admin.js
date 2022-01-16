
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose') // Import do mongoose
require('../models/Categoria')  // Chamando arquivo do model
const Categoria = mongoose.model('categorias') // Passando referencia do model para a variavel


router.get('/',(req, res)=>{
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de postes')
})

router.get('/categorias', (req, res)=>{
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/add', (req,res)=>{
    const novaCategoria = { // Recebe os dados do formulario
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        console.log('Categoria salva com sucesso')
    }).catch((err)=>{
        console.log('Erro ao savar categoria'+err)
    })
})

router.get('/testes', (req, res)=>{
    res.send('Aqui ficaram os testes')
})

module.exports = router