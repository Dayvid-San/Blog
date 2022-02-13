// Carregando modulos
const express = require('express');
const { engine } = require ('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const admin = require('./routes/admin')
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')



    

// Configurações
    // Sessão
    app.use(session({
        secret: "CursoNode",  // Chave para gerar sessão (ponha uma segura)
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    // Middleware
    /*app.use((req, res, next)=>{
        res.locale.success_msg = req.flash("success_msg") // São variaveis globais
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    */

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    // Handlebars
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set("views", "./views");


    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log('O banco está conectado')
    }).catch((err)=>{
        console.log('Não conectado ao mongo. Algo está errado. => '+err)
    })

    // Public
    app.use(express.static(path.join(__dirname, 'public')))

    app.use((req, res, next)=>{
        console.log('Nova requisição')
        next()
    })

// Rotas
app.use('/user', admin)

app.get('/',(req,res)=>{
    Postagem.find().populate('categorias').sort({data: 'desc'}).then((postagens)=>{
        res.render('index', {postagens})

    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro em se comunicar com a home')
        res.redirect('/404')
    })
})

app.get('/postagem/:slug', (req,res)=>{
    // Vai pesquisar uma postagem pelo slug. O vai slug vai ser passado para o usuário pelo paramentro da rota
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            // passando os dados da postagem que ele achou
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('error_msg', 'Essa postagem não existe')
            res.redirect('/')
        }
    }).catch((err) =>{
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
    })
})

app.get('/categorias',(req,res)=>{
    // Listando as categorias
    Categoria.find()
    .then((categorias)=>
    {
        res.render('categorias/index', {categorias: categorias})
    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias' + err)
        res.redirect('/')
    })
})

app.get('/categorias/slug', (req,res)=>{
    
    Categoria.findOne({slug: req.params.slug})
    .then((categoria)=>
    {
        if(categoria)
        {
            // Busca pelos posts que pertencem a categoria, que fora, passadas pelo slug
            Postagem.find({categira: categoria._id}).then((postagens)=>{
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria})

            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao listar os posts!')
            })

        }
        else
        {
            req.flash('error_msg', 'Está categoria não existe')
            res.redirect('/')
        }

    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno ao carregar a página dessa categoria')
        res.redirect('/')
        
    })
})

app.get('/404', (req,res)=>{
    res.send('Erro 404')
})


// Outros
const PORT = 8080
app.listen(PORT, ()=>{
    console.log('Servidor rodando!')
})