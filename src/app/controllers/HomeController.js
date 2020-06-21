const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

const LoadRecipeService = require('../services/LoadRecipeService')

async function getImagesRecipe(req, recipeId) {
    const results = await Recipe.recipeFiles(recipeId) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
    let files = []
    for (let i=0; i < results.rows.length; i++){
        let img = await File.findAll({where:{id:results.rows[i].file_id}})
        img[0].path = `${req.protocol}://${req.headers.host}${img[0].path.replace("public", "")}`
        files.push({
            id: img[0].id,
            src:img[0].path,
            name: img[0].name
        })
    }
    return files
}

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
            const allRecipes = await LoadRecipeService.load('recipes', {'ORDER BY':'updated_at'})

            const recipes = []
            for (let index = 0; index < 6; index++) {
                recipes.push(allRecipes[index])
            }

            return res.render('site/index', {recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipes(req, res) {
        try {
            const recipes = await LoadRecipeService.load('recipes', {'ORDER BY':'updated_at'})

            if (recipes == "") return res.render('site/recipes')
 
            return res.render('site/recipes', {recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipeShow(req, res) {
        let recipe = await Recipe.findOne({
            where: {id:req.params.id}
        })

        if ((!recipe)||(recipe==undefined)) {
            res.status(404).render('./not-found')
        } 

        recipe = await LoadRecipeService.load('recipe', {
            where: { id: recipe.id }
        })

        return res.render (`site/recipeShow`, {recipe})
    },
    async chefs(req, res) {
        try {
            const chefs = await Chef.findAll()
            
            if (chefs == '') return res.render('site/chefs')

            for (let chef of chefs) {
                /* Get Images */
                let img = await File.findById(chef.file_id)
                img.path = `${req.protocol}://${req.headers.host}${img.path.replace("public", "")}`
                chef['img'] = img.path
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