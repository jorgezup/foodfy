const express = require('express')
const routes = express.Router()


const SearchController = require('../app/controllers/SearchController')

const site = require('./site')
const admin = require('./admin')
const users = require('./users')

/* Search */
routes.get('/recipes/search', SearchController.index)


routes.use('', site)
routes.use('/admin', admin)
routes.use('/admin', users)

routes.use(function(req, res) {
    res.status(404).render('./not-found')
})

module.exports = routes
