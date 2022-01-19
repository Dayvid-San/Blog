const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Postagem = new Schema({
    // Definindo model da postagem
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descrição: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        // Referenciando categorias que já existem
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", Postagem)