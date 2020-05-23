const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')


module.exports = {
    async index(req, res) {
        try {
            let recipes = await Recipe.findAll({'ORDER BY':'updated_at'})
            if (recipes == "") return res.render('site/index')
            
            
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
            
            return res.render('site/index', {recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipes(req, res) {
        try {
            let recipes = await Recipe.findAll({'ORDER BY': 'updated_at'})
            if (recipes == "") return res.render('site/recipes')
            
            
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
            
            return res.render('site/recipes', {recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipeShow(req, res) {
        const { id } = req.params

        const recipe = await Recipe.findOne({
            where: {id}
        })

        const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
        for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
            let img = await Recipe.files(results.rows[i].file_id)
            img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
            recipe['img'] = img.rows[0].path
            let chefName = await Chef.searchName(recipe.chef_id)
            recipe['chef_name'] = Object.values(chefName.rows[0])
        }

        return res.render (`site/recipeShow`, {recipe})
    },
    async chefs(req, res) {
        try {
            const chefs = await Chef.findAll()
            
            if (chefs == '') return res.render('site/chefs')

            for (let chef of chefs) {
                /* Get Images */
                let img = await Chef.files(chef.file_id)
                img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
                chef['img'] = img.rows[0].path
                /* Get Recipes */ 
                let recipes = await Recipe.findAll({where:{chef_id:chef.id}})
                chef['recipes'] = recipes.length
            }

            return res.render('site/chefs', {chefs})
                     
        } catch (error) {
            console.error(error)
        }
    }
}