const express = require('express')
const nunjucks = require('nunjucks')
const receitas = require('./data.js')

const server = express()

/* Public */
server.use(express.static('public'))

/* Nunjucks */
server.set('view engine', 'njk')
nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})

/* Rotas */
server.get('/', (req, res) => {
    res.render('index', { receitas })
})
server.get('/sobre', (req, res) => {
    res.render('sobre')
})

server.get("/receitas/:index", function(req, res) {
    const receitasData = receitas
    const receitaIndex = req.params.index;

    if (!receitasData[receitaIndex]) {
        return res.status(404).redirect('/not-found')
    }

    res.render('receitas', { receitas: receitas[receitaIndex] })
})

server.use(function(req, res) {
    res.status(404).render('not-found')
})

/* Server Running */
server.listen(5000, () => {
    console.log('server is running')
})