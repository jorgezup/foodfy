const Chef = require('../models/Chef')
const Recipes = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        try {
            const chefs = await Chef.findAll()
            
            if (!chefs) return res.send('Chefes não encontrados!')

            console.log(chefs)
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

            console.log(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Preencha todos os campos!")
                }
            }

            const chefId = await Chef.create({
                id: req.body.id,
                name: req.body.name,
                avatar_url: req.body.avatar_url,
            })

            return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.error(error)
        }
    },
    async show (req, res) {
        try {
            const { id } = req.params
            const chef_id = id

            console.log(id)

            const chef = await Chef.findOne({
                where: {id}
            })

            console.log(chef)
           
            if (!chef) return res.send('Chefs não encontrados!')
           
            const recipes = await Recipes.findAll({
                where: {
                    chef_id:id
                }
            })

            const qntdRecipes = Object.keys(recipes).length

            return res.render('admin/chefs/show', {chef, receitas: recipes, qntdRecipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const chef = await Chef.findById(req.params.id)

            console.log('aqui')
            console.log(chef)
    
            if (!chef) return res.send('Chef não encontrado!')
    
            return res.render(`admin/chefs/edit`, {chef})
        } catch (error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Preencha todos os campos!")
                }
            }

            const {id, name, avatar_url} = req.body

            console.log(name)

            await Chef.update(req.body.id, req.body)

            return res.redirect(`/admin/chefs`)
        }
        catch(error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect(`/admin/receitas`)
    }
}
