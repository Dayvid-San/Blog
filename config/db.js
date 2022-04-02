// Verifica para rodar no Heroku e ou Localmente

if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongo://<usuario>:<senha>URL DE CONECÇÃO"}
}
else{
    mondule.exports = {mongoURI: "mongodb://localhost/blogapp"}
}