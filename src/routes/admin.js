const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const RecipeController = require('../app/controllers/RecipeController')
const ChefController = require('../app/controllers/ChefController')

const ChefValidator = require('../app/validators/chef')
const RecipeValidator = require('../app/validators/recipe')

const { onlyUsers, isAdmin, isLoggedRedirect} = require('../app/middlewares/session')
const { recipeExists, ownerRecipe, verifyOwnerRecipe } = require('../app/middlewares/recipe')
const { chefExists } = require('../app/middlewares/chef')

/* ----------------------------- Admin ----------------------------------------*/
routes.get('', isLoggedRedirect, 
    function (req, res) {
        res.render('admin/session/login')
    })
/*============================ Receitas =====================================*/
routes.get("/recipes", onlyUsers, RecipeController.index); // Mostrar a lista de receitas
routes.get("/recipes/create", onlyUsers, RecipeController.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, RecipeValidator.show, RecipeController.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, RecipeValidator.edit, RecipeController.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", onlyUsers, multer.array("photos", 5), RecipeValidator.post, RecipeController.post); // Cadastrar nova receita
routes.put("/recipes", onlyUsers, multer.array("photos", 5), RecipeValidator.put, RecipeController.put); // Editar uma receita
routes.delete("/recipes", onlyUsers, RecipeController.delete); // Deletar uma receita


// /*============================== Chefs ======================================*/
routes.get("/chefs", onlyUsers, ChefController.index); // Mostrar a lista de chefs
routes.get("/chefs/create", isAdmin, ChefController.create); // Mostrar formulário de novo chef
routes.get("/chefs/:id", onlyUsers, ChefValidator.show, ChefController.show); // Exibir detalhes de um chef
routes.get("/chefs/:id/edit", isAdmin, ChefValidator.edit, ChefController.edit); // Mostrar formulário de edição de chef

routes.post("/chefs", isAdmin, multer.array("photos", 1), ChefValidator.post, ChefController.post); // Cadastrar novo chef
routes.put("/chefs", isAdmin, multer.array("photos", 1), ChefController.put); // Editar um chef
routes.delete("/chefs", isAdmin, ChefValidator.remove, ChefController.delete); // Deletar um chef

module.exports = routes