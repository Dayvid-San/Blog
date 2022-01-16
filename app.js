// Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const admin = require('./routes/admin')
const path = require('path');


// Configurações
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');

    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log('O banco está conctado')
    }).catch((err)=>{
        console.log('Não conectado ao mongo. Algo está errado. => '+err)
    })

    // Public
    app.use(express.static(path.join(__dirname, 'public')))

// Rotas
app.use('/user', admin)



// Outros
const PORT = 8080
app.listen(PORT, ()=>{
    console.log('Servidor rodando!')
})