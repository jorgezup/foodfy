const Chef = require('../models/Chef')
const Recipes = require('../models/Recipe')
const File = require('../models/File')


module.exports = {
    async index(req, res) {
        try {
            const chefs = await Chef.findAll()
            
            if (chefs == '') return res.send('Chefes não encontrados!')

            let files = []
            for (let chef of chefs) {
                /* Get Images */
                let img = await Chef.files(chef.file_id)
                img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
                chef['img'] = img.rows[0].path 
            }

            return res.render('admin/chefs/index', {chefs})
                     
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        try {
            return res.render('admin/chefs/create')
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

            return res.redirect(`/admin`)

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

            /* Get Images */
            const avatar_id = chef.file_id
            let img = await Chef.files(avatar_id)
            console.log(img)

            let files = []
            img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
            files.push({
                id: img.rows[0].id,
                src:img.rows[0].path,
                name: img.rows[0].name
            })
           
            const recipes = await Recipes.findAll({
                where: {
                    chef_id:id
                }
            })

            const qntdRecipes = Object.keys(recipes).length

            return res.render('admin/chefs/show', {chef, receitas: recipes, qntdRecipes, files})
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const chef = await Chef.findById(req.params.id)
            console.log(chef)

            if (!chef) return res.send('Chef não encontrado!')
    
            /* Get Images */
            const avatar_id = chef.file_id
            let img = await Chef.files(avatar_id)
            console.log(img)

            let files = []
            img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
            files.push({
                id: img.rows[0].id,
                src:img.rows[0].path,
                name: img.rows[0].name
            })

            return res.render(`admin/chefs/edit`, {chef, files})

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

        await Chef.delete(req.body.id)

        return res.redirect(`/admin/chefs`)
    }
}
