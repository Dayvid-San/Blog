// Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const admin = require('./routes/admin')


// Configurações
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    // Handlebars
 //   app.engine('handlebars', handlebars({defaultLayout: true}))
   // app.set('view engine', 'handlebars');

    // Mongoose

// Rotas
app.use('/user', admin)


// Outros
const PORT = 8080
app.listen(PORT, ()=>{
    console.log('Servidor rodando!')
})