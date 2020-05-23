const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

module.exports = {
    async index(req, res) {
        try {
            let results,
            params = {}

            
            const { filter } = req.query
            
            if (!filter) return res.redirect("/")
            
            params.filter = filter
            
            results = await Recipe.search(params)
            let recipes = results.rows
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

            const search = {
                term: req.query.filter
            }

            return res.render('site/search/index', {recipes, search})
            
        } catch (error) {
            console.error(error)
        }
    },
}