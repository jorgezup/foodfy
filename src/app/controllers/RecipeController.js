const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

module.exports = {
    async index(req, res) {
        let recipes = req.recipes
        try {
            if (recipes == undefined) {
                recipes = await Recipe.findAll({'ORDER BY':'updated_at'})
                console.log(recipes)
                
                if (recipes == "") return res.render('admin/recipes', {
                    error: "Não há receitas cadastradas!"
                })
            }

            /* Get Images */
            for (let recipe of recipes) {
                const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
                for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
                    let img = await Recipe.files(results.rows[i].file_id)
                    img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
                    recipe['img'] = img.rows[0].path
                    let chefName = await Chef.searchName(recipe.chef_id)
                    recipe['chef_name'] = Object.values(chefName.rows[0])
                }
            }
            return res.render('admin/recipes/index', {receitas: recipes, req})
            
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        try {
            const chefs = await Chef.findAll()

            return res.render('admin/recipes/create', {chefs})
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "information" ) {
                    return res.send(`Preencha todos os campos! `)
                }
            }

            if (req.files.length == 0) {
                return res.render('admin/recipes/create', {
                    recipe: req.body,
                    error: "Envie pelo menos uma imagem!"
                })
            }
            
            let filesId = []

            const filesPromise = req.files.map(file => File.create({...file}))
            await Promise.all(filesPromise)
            .then ((values) => {
                for (let index = 0; index < values.length; index++) {
                    let element = values[index].rows[0]
                    filesId.push(element.id)
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
                await RecipeFile.create(recipeId, fileId)
            }

            return res.redirect(`/admin/recipes`)
            
        } catch (error) {
            console.error(error)
        }
    },
    async show (req, res) {
        try {
            const { id } = req.params
            
            const recipe = await Recipe.findById(id)

            const chef = await Chef.findById(recipe.chef_id)
            
            if (!recipe) return res.send('Receitas não encontradas!')

          /* Get Images */
          const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
          let files = []
          for (let i=0; i < results.rows.length; i++){
              let img = await Recipe.files(results.rows[i].file_id)
              img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
              files.push({
                  id: img.rows[0].id,
                  src:img.rows[0].path,
                  name: img.rows[0].name
              })
          }
          
            return res.render('admin/recipes/show', {recipe, chef, files, req})
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const recipe = await Recipe.findById(req.params.id)

            const chefs = await Chef.findAll()
    
            if (!recipe) return res.send('Receita não encontrada!')

            /* Get Images */
            const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
            let files = []
            for (let i=0; i < results.rows.length; i++){
                let img = await Recipe.files(results.rows[i].file_id)
                img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
                files.push({
                    id: img.rows[0].id,
                    src:img.rows[0].path,
                    name: img.rows[0].name
                })
            }
        
            return res.render('admin/recipes/edit', {recipe, chefs, files, req})
        } catch (error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "" && key != "information" && key != "removed_files") {
                    return res.send("Preencha todos os campos!")
                }
            }

            /* Inserindo novas Imagens */
            let filesId = []
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file =>File.create({...file}))
                await Promise.all(newFilesPromise)
                .then((values) => {
                    for (let index = 0; index < values.length; index++) {
                        let element = values[index].rows[0]
                        filesId.push(element.id)
                    }
                })
                for (let fileId of filesId) {
                    await RecipeFile.create(req.body.id, fileId)
                }
            }

            /* Remoção das Imagens */
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",") //[1,2,3,]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) //[1,2,3]
                                
                let removedFilesPromise = removedFiles.map(id => RecipeFile.delete(id))
                await Promise.all(removedFilesPromise)

                removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
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
            await RecipeFile.delete(fileId)
            await File.delete(fileId)
        }

        await Recipe.delete(req.body.id)

        res.redirect(`/admin/recipes`)
    }
}
