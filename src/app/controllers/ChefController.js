const { unlinkSync } = require('fs')

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
    async show (req, res) {
        try {
            const { chef } = req

            /* Get Chef Image */
            let img = await File.findById(chef.file_id)
            img.path = `${req.protocol}://${req.headers.host}${img.path.replace("public", "")}`
            chef['img'] = img.path


            /* Get All recipes by chef_id */
            let recipes = await Recipe.findAll({
                where: {
                    chef_id:chef.id
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


            return res.render('admin/chefs/show', {chef, recipes, req})
            
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            let file_id = ""
            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: file.path
            }))
            console.log(filesPromise)
            await Promise.all(filesPromise)
                .then((values) => {
                    file_id = values[0]
                })

            await Chef.create({
                name: req.body.name,
                file_id: file_id
            })

            return res.redirect(`/admin/chefs`)

        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const { chef } = req
            /* Get Images */
            const avatar_id = chef.file_id
            let img = await File.findById(avatar_id)

            let files = []
            img.path = `${req.protocol}://${req.headers.host}${img.path.replace("public", "")}`
            files.push({
                id: img.id,
                src:img.path,
                name: img.name
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

            let newFileId = 0
            let removedFiles = 0
            let pathRemovedFiles = ""

            if (req.body.removed_files) {
                newFileId = await File.create({
                    name: req.files[0].filename,
                    path: req.files[0].path
                })

                removedFiles = req.body.removed_files.replace(/,/g, "")

                const results = await File.findById(removedFiles)
                pathRemovedFiles =  results.path
            
                let chef = await Chef.findById(req.body.id)
    
                Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id: newFileId || chef.file_id
                }).then(() => {
                    File.delete(removedFiles)
                    unlinkSync(pathRemovedFiles)
                })
            }

            if (!req.body.removed_files) {
                let chef = await Chef.findById(req.body.id)
    
                Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id: chef.file_id
                })
            }

            
            return res.redirect(`/admin/chefs`)
        }
        catch(error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        // const recipes = await Recipe.findAll({
        //     where: {
        //         chef_id: req.body.id
        //     }
        // })
        
        // if (Object.keys(recipes).length > 0) {
        //     return res.send("Este chef não pode ser apagado pois ele possui receitas cadastradas.")
        // }

        const chef = await Chef.findById(req.body.id)
        const fileId = await File.findById(chef.file_id)
    
        await Chef.delete(req.body.id)
        await File.delete(chef.file_id)
        unlinkSync(fileId.path)

        return res.redirect(`/admin/chefs`)
    }
}
