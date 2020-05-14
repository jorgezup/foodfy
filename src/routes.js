const express = require('express')
const receitas = require('./app/controllers/RecipeController')
const chefs = require('./app/controllers/ChefController')

routes = express.Router()

routes.get('/', (req, res) => {
    res.render('index')
})
routes.get('/sobre', (req, res) => {
    res.render('sobre')
})

routes.get('/receitas', (req, res) => {
    res.render('receitas')
})

// routes.get('/chefs', (req, res) => {
//     res.render('chefs')
// })


routes.get('/admin', (req, res) => res.render('admin/index'))


/*============================ Receitas =====================================*/
routes.get("/admin/recipes", receitas.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", receitas.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", receitas.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", receitas.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", receitas.post); // Cadastrar nova receita
routes.put("/admin/recipes", receitas.put); // Editar uma receita
routes.delete("/admin/recipes", receitas.delete); // Deletar uma receita


// /*============================== Chefs ======================================*/
routes.get("/admin/chefs", chefs.index); // Mostrar a lista de chefs
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de nova chef
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de uma chef
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de chef

routes.post("/admin/chefs", chefs.post); // Cadastrar nova chef
routes.put("/admin/chefs", chefs.put); // Editar uma chef
routes.delete("/admin/chefs", chefs.delete); // Deletar uma chef

module.exports = routes



// routes.use(function(req, res) {
//     res.status(404).render('not-found')
// })
