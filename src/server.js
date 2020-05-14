const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')

const server = express()

server.use(express.urlencoded({ extended: true }))
/* Public */
server.use(express.static('public'))
/* Rotas */
server.use(methodOverride('_method'))
server.use(routes)

/* Nunjucks */
server.set('view engine', 'njk')
nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

/* Server Running */
server.listen(5000, () => {
    console.log('server is running')
})