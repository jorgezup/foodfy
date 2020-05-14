const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        try {
            const recipes = await Recipe.findAll()
            
            if (!recipes) return res.send('Receitas não encontradas!')

            return res.render('admin/recipes/index', {receitas: recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        try {
            return res.render('admin/recipes/create')
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Preencha todos os campos!")
                }
            }
            const{ chef_id, image, title, ingredients, preparation, information } = req.body
            const recipeId = await Recipe.create({
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information
            })
            return res.redirect(`admin/recipes/${recipeId}`)
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

            return res.render('admin/recipes/show', {recipe, chef})
            // res.send(recipe)
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const recipe = await Recipe.findById(req.params.id)

            const chefs = await Chef.findAll()

    
            if (!recipe) return res.send('Receita não encontrada!')
    
            // const recipe = await Recipe.findOne(id)
    
            return res.render('admin/recipes/edit', {recipe, chefs})
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
    }
}
