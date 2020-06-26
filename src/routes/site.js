const express = require('express')
const routes = express.Router()


const HomeController = require('../app/controllers/HomeController')


/* ------------------------------------------------------- Site ------------------------------------------------------------------------- */
routes.get('/', HomeController.index)
routes.get('/sobre', (req, res) => {
    res.render('site/sobre')
})
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.recipeShow)
routes.get('/chefs', HomeController.chefs)

module.exports = routes