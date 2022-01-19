
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
    Categoria.find().sort({date: 'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/add', (req,res)=>{

    var erros = []
    // validando formularios
    if(req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        error.push({texto: "nome invalido"})
    }
    if(!req.body.slug || typeof req.body.nome == undefined || req.body.nome == null){
        error.push({texto: "slug invalido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria é muito pequeno'})
    }
    if(erros.length > 0){
        res.render('admin/add:categorias', {erros: erros})
    }else{
        const novaCategoria = { // Recebe os dados do formulario
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg', 'categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao salvar a cetegoria. Tente novamente!')
            res.redirect('/admin')
        })
    }

})

router.get('/testes', (req, res)=>{
    res.send('Aqui ficaram os testes')
})

module.exports = router