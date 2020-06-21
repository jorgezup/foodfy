const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

const LoadRecipeService = require('../services/LoadRecipeService')


async function getImagesRecipe(req, recipeId) {
    const results = await Recipe.recipeFiles(recipeId) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
    let files = []
    for (let i=0; i < results.rows.length; i++){
        let img = await File.findAll({where:{id:results.rows[i].file_id}})
        img[0].path = `${req.protocol}://${req.headers.host}${img[0].path.replace("public", "")}`
        files.push({
            id: img[0].id,
            src:img[0].path,
            name: img[0].name
        })
    }

    return files
}

async function getRecipeFirstImage(recipe, req) {
    let fileIdFirstImage = await (await Recipe.recipeFiles(recipe.id)).rows[0].file_id
    let imagePath = await (await File.findAll({where:{id:fileIdFirstImage}}))[0].path
    let image = `${req.protocol}://${req.headers.host}${imagePath.replace("public", "")}`
    return image
}

async function getChefName(chefId) {
    let chef = await (await Chef.searchName(chefId)).rows[0]
    let chefName = Object.values(chef)
    return chefName
}

module.exports = {
    async index(req, res) {
        try {
            const isAdmin = req.user.is_admin

            let recipes= ""

            if(isAdmin==true) {
                recipes = await LoadRecipeService.load('recipes')
            }
            else {
                recipes = await LoadRecipeService.load('recipes', {
                    where: {user_id: req.session.userId}
                })

                if(recipes == '')
                    return res.render('admin/index', {
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
            const chefs = await Chef.findAll()
            
            if (chefs == "") return res.render('admin/recipes/index', {
                error: "Não é possível criar uma receita pois não há nenhum chef cadastrado"
            })
            
            const isAdmin = req.user.is_admin

            return res.render('admin/recipes/create', {chefs, isAdmin})
        } catch (error) {
            console.error(error)
        }
    },
    async show (req, res) {
        try {
            const recipe = await LoadRecipeService.load('recipe', {
                where: { id: req.recipe.id }
            })
            
            const isAdmin = req.user.is_admin

            return res.render('admin/recipes/show', {recipe, req, isAdmin})
            
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
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

            return res.redirect(`/admin/recipes`)
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const recipe = await LoadRecipeService.load('recipe', {
                where: { id: req.recipe.id }
            })

            const chefs = await Chef.findAll()

            return res.render('admin/recipes/edit', {recipe, chefs, req})

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

        res.redirect(`/admin/recipes`)
    }
}
