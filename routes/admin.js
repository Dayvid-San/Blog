
const express = require('express')
const router = express.Router()


router.get('/',(req, res)=>{
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de postes')
})

router.get('/categorias', (req, res)=>{
    res.send('Página de categorias')
})

router.get('/testes', (req, res)=>{
    res.send('Aqui ficaram os testes')
})

module.exports = router