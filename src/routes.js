const express = require('express')
const routes = express.Router()

const multer = require('./app/middlewares/multer')
const RecipeController = require('./app/controllers/RecipeController')
const ChefController = require('./app/controllers/ChefController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')


/* Search */
routes.get('/recipes/search', SearchController.index)
/* ------------------------------------------------------- Site ------------------------------------------------------------------------- */
routes.get('/', HomeController.index)
routes.get('/sobre', (req, res) => {
    res.render('site/sobre')
})
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.recipeShow)
routes.get('/chefs', HomeController.chefs)


/* ----------------------------------------------------- Admin -----------------------------------------------------------------------*/
routes.get('/admin', (req, res) => res.render('admin/index'))
/*============================ Receitas =====================================*/
routes.get("/admin/recipes", RecipeController.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", RecipeController.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", RecipeController.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", RecipeController.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", multer.array("photos", 5), RecipeController.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), RecipeController.put); // Editar uma receita
routes.delete("/admin/recipes", RecipeController.delete); // Deletar uma receita


// /*============================== Chefs ======================================*/
routes.get("/admin/chefs", ChefController.index); // Mostrar a lista de chefs
routes.get("/admin/chefs/create", ChefController.create); // Mostrar formulário de nova chef
routes.get("/admin/chefs/:id", ChefController.show); // Exibir detalhes de uma chef
routes.get("/admin/chefs/:id/edit", ChefController.edit); // Mostrar formulário de edição de chef

routes.post("/admin/chefs", multer.array("photos", 1), ChefController.post); // Cadastrar nova chef
routes.put("/admin/chefs", multer.array("photos", 1), ChefController.put); // Editar uma chef
routes.delete("/admin/chefs", ChefController.delete); // Deletar uma chef

module.exports = routes



// routes.use(function(req, res) {
//     res.status(404).render('not-found')
// })
