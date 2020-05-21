const express = require('express')
const routes = express.Router()

const multer = require('./app/middlewares/multer')
const RecipeController = require('./app/controllers/RecipeController')
const chefs = require('./app/controllers/ChefController')

routes.get('/', RecipeController.homeIndex)
routes.get('/sobre', (req, res) => {
    res.render('sobre')
})

routes.get('/receitas', RecipeController.homeIndex)

// routes.get('/chefs', (req, res) => {
//     res.render('chefs')
// })


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
routes.get("/admin/chefs", chefs.index); // Mostrar a lista de chefs
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de nova chef
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de uma chef
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de chef

routes.post("/admin/chefs", multer.array("photos", 1), chefs.post); // Cadastrar nova chef
routes.put("/admin/chefs", multer.array("photos", 1), chefs.put); // Editar uma chef
routes.delete("/admin/chefs", chefs.delete); // Deletar uma chef

module.exports = routes



// routes.use(function(req, res) {
//     res.status(404).render('not-found')
// })
