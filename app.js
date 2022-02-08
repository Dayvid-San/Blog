// Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const admin = require('./routes/admin')
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagens')
const Postagem = mongoose.model('postagens')


// Configurações
    // Sessão
    app.use(session({
        secret: "CursoNode",  // Chave para gerar sessão (ponha uma segura)
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    // Middleware
    app.use((req, res, next)=>{
        res.locale.success_msg = req.flash("success_msg") // São variaveis globais
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    // Handlebars
    //app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    //app.set('view engine', 'handlebars');

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
app.get('/404', (req,res)=>{
    res.send('Erro 404')
})


// Outros
const PORT = 8080
app.listen(PORT, ()=>{
    console.log('Servidor rodando!')
})