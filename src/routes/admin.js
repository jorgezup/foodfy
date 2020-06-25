const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const RecipeController = require('../app/controllers/RecipeController')
const ChefController = require('../app/controllers/ChefController')

const ChefValidator = require('../app/validators/chef')
const RecipeValidator = require('../app/validators/recipe')

const { onlyUsers, onlyAdmin, isLoggedRedirect, verifyIsAdmin} = require('../app/middlewares/session')

/* ----------------------------- Admin ----------------------------------------*/
routes.get('', isLoggedRedirect,
    function (req, res) {
        res.render('admin/session/login')
    })
/*============================ Receitas =====================================*/
routes.get("/recipes", onlyUsers, verifyIsAdmin,  RecipeController.index); // Mostrar a lista de receitas
routes.get("/recipes/create", onlyUsers, verifyIsAdmin, RecipeController.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, verifyIsAdmin, RecipeValidator.show, RecipeController.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, verifyIsAdmin, RecipeValidator.edit, RecipeController.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", onlyUsers, verifyIsAdmin, multer.array("photos", 5), RecipeValidator.post, RecipeController.post); // Cadastrar nova receita
routes.put("/recipes", onlyUsers, verifyIsAdmin, multer.array("photos", 5), RecipeValidator.put, RecipeController.put); // Editar uma receita
routes.delete("/recipes", onlyUsers, verifyIsAdmin, RecipeController.delete); // Deletar uma receita


// /*============================== Chefs ======================================*/
routes.get("/chefs", onlyUsers, verifyIsAdmin, ChefController.index); // Mostrar a lista de chefs
routes.get("/chefs/create", onlyAdmin, verifyIsAdmin, ChefController.create); // Mostrar formulário de novo chef
routes.get("/chefs/:id", onlyUsers, verifyIsAdmin, ChefValidator.show, ChefController.show); // Exibir detalhes de um chef
routes.get("/chefs/:id/edit", onlyAdmin, verifyIsAdmin, ChefValidator.edit, ChefController.edit); // Mostrar formulário de edição de chef

routes.post("/chefs", onlyAdmin, verifyIsAdmin, multer.array("photos", 1), ChefValidator.post, ChefController.post); // Cadastrar novo chef
routes.put("/chefs", onlyAdmin, verifyIsAdmin, multer.array("photos", 1), ChefController.put); // Editar um chef
routes.delete("/chefs", onlyAdmin, verifyIsAdmin, ChefValidator.remove, ChefController.delete); // Deletar um chef

module.exports = routes