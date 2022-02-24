// Este arquivo verifica se o usuário está autenticado e se ele é o Administrador


module.exports = {
    eAdmin: function(req, res, next){

        if (req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash('error_msg', 'Você precisa ser adminstrador para entrar aqui')
        res.redirect('/')

    }
}