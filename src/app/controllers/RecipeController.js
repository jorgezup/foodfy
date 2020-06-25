const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            const isAdmin = req.isAdmin

            let recipes= ""

            if(isAdmin==true) {
                recipes = await LoadRecipeService.load('recipes')
            }
            else {
                recipes = await LoadRecipeService.load('recipes', {
                    where: {user_id: req.session.userId}
                })

                if(recipes == '')
                    return res.render('admin/recipes/index', {
                        error: 'Não há receitas cadastradas!'
                    })
            }

            return res.render('admin/recipes/index', {receitas: recipes, isAdmin})
            
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        try {
            const isAdmin = req.isAdmin
            
            const chefs = await Chef.findAll()
            
            if (chefs == "") return res.render('admin/recipes/index', {
                error: "Não é possível criar uma receita pois não há nenhum chef cadastrado"
            })
            
            
            return res.render('admin/recipes/create', {chefs, isAdmin})
        } catch (error) {
            console.error(error)
        }
    },
    async show (req, res) {
        try {
            const isAdmin = req.isAdmin
            
            const recipe = await LoadRecipeService.load('recipe', {
                where: { id: req.recipe.id }
            })
                        
            return res.render('admin/recipes/show', {recipe, req, isAdmin})
            
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const isAdmin = req.isAdmin

            let filesId = []

            const filesPromise = req.files.map(file => File.create({
                name: file.filename, 
                path: file.path
            }))
            await Promise.all(filesPromise)
            .then ((values) => {
                for (let index = 0; index < values.length; index++) {
                    let element = values[index]
                    filesId.push(element)
                }
            }) 

            const { chef_id, title, ingredients, preparation, information } = req.body

            let user_id = req.session.userId
            
            const recipeId = await Recipe.create({
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                user_id
            })
            
            for (let fileId of filesId) {
                await RecipeFile.create({
                    recipe_id:recipeId, 
                    file_id: fileId
                })
            }

            // return res.redirect(`/admin/recipes`)
            return res.render('admin/recipes/success', {isAdmin})
            
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/error', {isAdmin})

        }
    },
    async edit (req, res) {
        try {
            const isAdmin = req.isAdmin

            const recipe = await LoadRecipeService.load('recipe', {
                where: { id: req.recipe.id }
            })

            const chefs = await Chef.findAll()

            return res.render('admin/recipes/edit', {recipe, chefs, isAdmin})

        } catch (error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {
            
            /* Inserindo novas Imagens */
            let filesId = []
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file =>File.create({
                    name: file.filename, 
                    path: file.path
                }))
                await Promise.all(newFilesPromise)
                
                .then((values) => {
                    for (let index = 0; index < values.length; index++) {
                        let element = values[index]
                        filesId.push(element)
                    }
                })
                for (let fileId of filesId) {
                    await RecipeFile.create({
                        recipe_id:req.body.id, 
                        file_id: fileId
                    })
                }
            }

            /* Remoção das Imagens */
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",") //[1,2,3,]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) //[1,2,3]
                                
                removedFiles.forEach(async id => {
                    const file = await File.findById(id)
                    RecipeFile.delete(id)
                    File.delete(id)
                    unlinkSync(file.path)
                });
            }

            let{ chef_id, title, ingredients, preparation, information } = req.body
            
            let lastIngredient = ingredients[ingredients.length - 1]
            if (lastIngredient == '')
                ingredients.pop()

            let lastPreparation = preparation[preparation.length - 1]
            if (lastPreparation == '')
                preparation.pop()    

            await Recipe.update(req.body.id, {
                chef_id,
                title,
                ingredients,
                preparation,
                information
            })

            return res.redirect(`/admin/recipes`)
        }
        catch(error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        const isAdmin = req.isAdmin

        const recipeFiles = await RecipeFile.find(req.body.id) // [ { id: 15, recipe_id: 5, file_id: 20 }, ]
        for (let i = 0; i < recipeFiles.rows.length; i++) {
            let files = recipeFiles.rows[i]
            let fileId = Number(Object.values(files))
            const file = await File.findById(fileId)
            await RecipeFile.delete(fileId)
            await File.delete(fileId)
            unlinkSync(file.path)
        }

        await Recipe.delete(req.body.id)

        // res.redirect(`/admin/recipes`)
        return res.render('admin/recipes/delete', {isAdmin})
    }
}
