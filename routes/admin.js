const express = require('express')
const router = express.Router()
const mongoose = require('mongoose') // Import do mongoose
require('../models/Categoria')  // Chamando arquivo do model
const Categoria = mongoose.model('categorias') // Passando referencia do model para a variavel
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const { eAdmin } = require('../helpers/eAdmin')



router.get('/', eAdmin,(req, res)=>{
    res.render('admin/index')
})


router.get('/posts', eAdmin, (req, res) => {
    res.send('Página de postes')
})


router.get('/categorias', eAdmin, (req, res)=>{
    Categoria
    .find()
    .sort({date: 'desc'})
    .then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})

    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias' + err)
        res.redirect('/admin')
        
    })
})


router.get('/categorias/add', eAdmin, (req, res)=>{
    res.render('admin/addcategorias')

})

// *Tem algum problema no handlebars que impedindo de o banco receber os dados*
router.post('/categorias/add', eAdmin, (req,res)=>{

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

    }

    else{

        const { nome, slug } = req.body;
        const novaCategoria = { // Recebe os dados do formulario

            nome: nome,
            slug: slug
            
        }
    
        new Categoria(novaCategoria)
        .save()
        .then(()=>{
            req.flash('success_msg', 'categoria criada com sucesso')
            res.redirect('/admin/categorias')

        })
        .catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao salvar a cetegoria. Tente novamente!' + err)
            res.redirect('/admin')

        })
    }

})

router.post('/categorias/nova', eAdmin, (req,res)=>{
    const { nome, slug } = req.body;
    const novaCategoria = {
        nome: nome,
        slug: slug
    }

    new Categoria(novaCategoria).save()
    .then(()=>{
        console.log('Categoria salva com sucesso')
    })
    .catch((err)=>{
        console.log('Erro ao salvar categoria')
    })
})


router.get('/categorias/edit/:id', eAdmin, (req,res)=>{
    Categoria.findOne({_id:req.params.id})
    .then((categorias) =>{
        res.render('admin/editcategorias', {categoria: categoria})

    })
    .catch((err)=>{
        req.flash('error_msg', "Esta categoria não existe")

    })

})


router.post('/categorias/edit', eAdmin,(req,res)=>{

    const {id, name, slug} = req.body;

    Categoria.findOne({_id: id}).then((categoria)=>{
        categoria.nome = name
        categoria.slug = slug
    
        return categoria.save()
        .then(()=>{
            req.flash('success_msg', 'Categoria editada com successo')
            res.redirect('/admin/categorias')

        })
        .catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria' + err)
        })

    })
    .catch((err)=>{
        req.flash('error_msg', "Houve um erro ao editar a cetegoria" + err)
        res.redirect('/admin/categorias')
        
    })

})


router.post('/categorias/deletar', eAdmin, (req,res)=>{
    Categoria
    .remove({_id: req.body.id})
    .then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')

    })
    .catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')

    })
})


router.get('/postagens', eAdmin, (req,res)=>{

    Postagem
    .find()
    .populate("categoria")
    .sort({data: 'desc'})
    .then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})

    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect('/admin')

    })
})


router.get('/postagens/add', eAdmin, (req,res)=>{
    Categoria
    .find()
    .then((categorias)=>{
        res.render('admin/addpostagens', {categorias: categorias})

    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulario')
        res.render('/categorias')

    })
})


// Postando Categorias
router.post('/postagens/nova',(req,res)=>{
    // Validação

    var erros = []

    if(req.body.categoria === '0')
    {
        erros.push({text: 'categoria invalida! Registre um categoria!'})

    }
    if(erros.length > 0)
    {
        res.render('admin/addpostagem', {erros: erros})

    }
    else
    {

        const { titulo, descricao, conteudo, categoria, slug} = req.body;

        const novaPostagem = {

            titulo: titulo,
            descricao: descricao,
            conteudo: conteudo,
            categoria: categoria,
            slug: slug

        }
        new Postagem(novaPostagem).save()
        .then(()=>{
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/postagens')

        })
        .catch((err)=>{
            req.flash('error_msg', 'Houve um erro durante o salvamento da postagem')
            res.redirect('/admin/postagens')

        })
    }
})

// Editando categorias
router.get('/postagens/edit/:id', eAdmin, (req,res)=>{

    Postagem.findOneAndRemove({_id: req.body.params.id})
    .then((postagem)=>{
        
        //Listando as categorias no editCategorias
        Categoria.find().
        then((categorias)=>{
            res.render('admin/editpostagens', {categorias: categorias, postagens: postagens})

        })
        .catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/admin/postagens')

        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregaro formulário de edição')
        res.redirect('/admin/postagens')

    })
})

router.post('/postagem/edit', eAdmin, (req,res)=>{

    const { titulo, slug, descricao, conteudo, categoria } = req.body;
    
    // findOne pesquisa pela postagem
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{

        postagem.titulo = titulo
        postagem.slug = slug
        postagem.descricao = descricao
        postagem.conteudo = conteudo
        postagem.categoria = categoria

        postagem.save()
        .then(()=>{
            req.flash('sucess_msg', "Postagem editada com sucesso")
            res.redirect('/admin/postagens')
        })
        .catch((err)=>{
            req.flash('error_msg', "Houve um erro interno")
            res.redirect('/admin/postagens')

        })

    })
    .catch((err)=>{
        console.log(err)
        req.flash('error_msg', "Houve um erro ao salvar a edição")
        res.redirect('/admin/postagens')

    })
})


router.get('/postagens/deletar/:id', eAdmin,(req,res)=>{
    Postagem.remove({_id: req.params.id})
    .then(()=>{
        req.flash('sucess_msg', 'postagem deletada com sucesso!')
        res.redirect('/admin/postagens')

    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/admin/postagens')

    })
})


module.exports = router