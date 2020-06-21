const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            // let results,
            // params = {}
            
            // const { filter } = req.query
            
            // if (!filter) return res.redirect("/")
            
            // params.filter = filter
            
            // results = await Recipe.search(params)

            // let recipes = results.rows
            
            // const recipesPromise = recipes.map(LoadRecipeService.format)
            
            // recipes = await Promise.all(recipesPromise)

            // const search = {
            //     term: req.query.filter
            // }

            let { filter } = req.query

            if (!filter || filter.toLowerCase() == 'todas as receitas' ) filter = null

            let recipes = await Recipe.search(filter)

            const recipesPromise = recipes.rows.map(LoadRecipeService.format)

            recipes = await Promise.all(recipesPromise)

            const search = {
                term: filter || 'Todas as receitas'
            }

            return res.render('site/search/index', {recipes, search})
            
        } catch (error) {
            console.error(error)
        }
    },
}