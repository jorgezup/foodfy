const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

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

            const chefs = await Chef.findAll()
            
            if (chefs == '') return res.render('admin/chefs/index', {req})

            for (let chef of chefs) {
                /* Get Images */
                let img = await File.findAll({where:{id:chef.file_id}})
                img[0].path = `${req.protocol}://${req.headers.host}${img[0].path.replace("public", "")}`
                chef['img'] = img[0].path 
            }

            return res.render('admin/chefs/index', {chefs, isAdmin})
                     
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        try {
            const isAdmin = req.user.is_admin

            return res.render('admin/chefs/create', {isAdmin})
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != 'photos') {
                    return res.send(`Preencha todos os campos! --> ${key}`)
                }
            }

            if (req.files.length == 0) {
                return res.send('Por favor, envie pelo menos uma imagem')
            }

            let file_id = ""
            const filesPromise = req.files.map(file => File.create({...file}))
            await Promise.all(filesPromise)
                .then((values) => {
                    file_id = values[0].rows[0]
                })

            await Chef.create({
                name: req.body.name,
                file_id: Object.values(file_id)
            })

            return res.redirect(`/admin/chefs`)

        } catch (error) {
            console.error(error)
        }
    },
    async show (req, res) {
        try {
            const { id } = req.params
            
            const chef = await Chef.findOne({
                where: {id}
            })
           
            if (!chef) return res.send('Chefs não encontrados!')

            /* Get Chef Image */
            let img = await File.findById(chef.file_id)
            img.path = `${req.protocol}://${req.headers.host}${img.path.replace("public", "")}`
            chef['img'] = img.path


            /* Get All recipes by chef_id */
            let recipes = await Recipe.findAll({
                where: {
                    chef_id:id
                }
            })

            
            recipes = await Promise.all (
                    recipes.map(async recipe => {
                        recipe
                        recipe['img'] = await getRecipeFirstImage(recipe, req)
                        recipe['chef_name'] = await getChefName(recipe.chef_id)
                        return recipe
                })
            )


            /* Get Images - Recipes*/
            // for (let recipe of recipes) {
            //     const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
            //     for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
            //         let img = await File.findAll({where:{id:results.rows[i].file_id}})
            //         img[0].path = `${req.protocol}://${req.headers.host}${img[0].path.replace("public", "")}`
            //         recipe['img'] = img[0].path
            //         let chefName = await Chef.searchName(recipe.chef_id)
            //         recipe['chef_name'] = Object.values(chefName.rows[0])
            //     }
            // }


            return res.render('admin/chefs/show', {chef, recipes, req})
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const chef = await Chef.findById(req.params.id)

            if (!chef) return res.send('Chef não encontrado!')
    
            /* Get Images */
            const avatar_id = chef.file_id
            let img = await Chef.files(avatar_id)

            let files = []
            img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
            files.push({
                id: img.rows[0].id,
                src:img.rows[0].path,
                name: img.rows[0].name
            })

            return res.render(`admin/chefs/edit`, {chef, files, req})

        } catch (error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send(`Preencha todos os campos!  ---> ${key}`)
                }
            }

            let avatar_id = ""
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file =>File.create({ ...file }))
                await Promise.all(newFilesPromise)
                .then((values) => {
                    avatar_id = Object.values(values[0].rows[0])
                })
    
                Chef.update(req.body.id, { name: req.body.name, file_id: avatar_id })
            }
            
            if (req.body.removed_files) {
                //1, 2, 3, 
                const removedFiles = req.body.removed_files.split(",") //[1, 2, 3, ]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) // [1, 2, 3]
                
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }
            
            if (!req.body.removed_files){
                await Chef.update(req.body.id, {
                    name: req.body.name,
                })
            }

            return res.redirect(`/admin/chefs`)
        }
        catch(error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        const recipes = await Recipes.findAll({
            where: {
                chef_id: req.body.id
            }
        })
        
        if (Object.keys(recipes).length > 0) {
            return res.send("Este chef não pode ser apagado pois ele possui receitas cadastradas.")
        }

        const chef = await Chef.findById(req.body.id)
    
        await Chef.delete(req.body.id)
        await File.deleteChefAvatar(chef.file_id)

        return res.redirect(`/admin/chefs`)
    }
}
