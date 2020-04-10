const express = require('express')
const routes = express.Router()
const receitas = require('./app/controllers/receitasControler')
const chefs = require('./app/controllers/chefController')

routes.get('/', (req, res) => {
    res.render('index')
})
routes.get('/sobre', (req, res) => {
    res.render('sobre')
})

 
routes.get("/admin/receitas", receitas.index); // Mostrar a lista de receitas
routes.get("/admin/receitas/create", receitas.create); // Mostrar formulário de nova receita
routes.get("/admin/receitas/:id", receitas.show); // Exibir detalhes de uma receita
routes.get("/admin/receitas/:id/edit", receitas.edit); // Mostrar formulário de edição de receita

routes.post("/admin/receitas", receitas.post); // Cadastrar nova receita
routes.put("/admin/receitas", receitas.put); // Editar uma receita
routes.delete("/admin/receitas", receitas.delete); // Deletar uma receita

routes.get("/admin-chefs/chefs", chefs.index); // Mostrar a lista de chefs
routes.get("/admin-chefs/chefs/create", chefs.create); // Mostrar formulário de nova chef
// routes.get("/admin-chefs/chefs/:id", chefs.show); // Exibir detalhes de uma chef
// routes.get("/admin-chefs/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de chef

routes.post("/admin-chefs/chefs", chefs.post); // Cadastrar nova chef
// routes.put("/admin-chefs/chefs", chefs.put); // Editar uma chef
// routes.delete("/admin-chefs/chefs", chefs.delete); // Deletar uma chef




routes.use(function(req, res) {
    res.status(404).render('not-found')
})

module.exports = routes