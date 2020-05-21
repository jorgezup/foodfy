const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

module.exports = {
    async index(req, res) {
        try {
            let recipes = await Recipe.findAll()
            
            if (recipes == "") return res.send('Receitas não encontradas!')


            /* Get Images */
            for (let recipe of recipes) {
                const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
                for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
                    let img = await Recipe.files(results.rows[i].file_id)
                    img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
                    recipe['img'] = img.rows[0].path
                }
            }
            
            return res.render('admin/recipes/index', {receitas: recipes})
            
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
                if (req.body[key] == "") {
                    return res.send(`Preencha todos os campos! --> ${key}`)
                }
            }

            if (req.files.length == 0) {
                return res.send('Por favor, envie pelo menos uma imagem')
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
            const recipeId = await Recipe.create({
                chef_id,
                title,
                ingredients,
                preparation,
                information
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
          
            return res.render('admin/recipes/show', {recipe, chef, files})
            
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
        
            return res.render('admin/recipes/edit', {recipe, chefs, files})
        } catch (error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {
            const keys = Object.keys(req.body)            

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
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

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            const{ chef_id, image, title, ingredients, preparation, information } = req.body
            await Recipe.update(req.body.id, {
                chef_id,
                image,
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
        await Recipe.delete(req.body.id)

        return res.redirect(`/admin/recipes`)
    },
    async homeIndex(req, res) {
        let recipes = await Recipe.findAll()

        let receitas = []

        for (i = 0; i < 6; i++) {
           receitas.push(Object(recipes[i]))
        }

        return res.render(`index`, {recipes:receitas})
    }
}
