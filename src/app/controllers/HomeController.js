const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

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
            let recipes = await Recipe.findAll({'ORDER BY':'updated_at'})
            if (recipes == "") return res.render('site/index')
            
            
            /* Get Images */
            // for (let recipe of recipes) {
            //     const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
            //     for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
            //         let img = await Recipe.files(results.rows[i].file_id)
            //         img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
            //         recipe['img'] = img.rows[0].path
            //         let chefName = await Chef.searchName(recipe.chef_id)
            //         recipe['chef_name'] = Object.values(chefName.rows[0])
            //     }
            // }

                        
            recipes = await Promise.all (
                recipes.map(async recipe => {
                    recipe
                    recipe['img'] = await getRecipeFirstImage(recipe, req)
                    recipe['chef_name'] = await getChefName(recipe.chef_id)
                    return recipe
            })
        )
            
            return res.render('site/index', {recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipes(req, res) {
        try {
            let recipes = await Recipe.findAll({'ORDER BY': 'updated_at'})
            if (recipes == "") return res.render('site/recipes')
            
            
            // /* Get Images */
            // for (let recipe of recipes) {
            //     const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
            //     for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
            //         let img = await Recipe.files(results.rows[i].file_id)
            //         img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
            //         recipe['img'] = img.rows[0].path
            //         let chefName = await Chef.searchName(recipe.chef_id)
            //         recipe['chef_name'] = Object.values(chefName.rows[0])
            //     }
            // }

            // const PromiseRecipes = recipes.map(async (recipe) => ({
            //     ... recipe,
            //     img: `${req.protocol}://${req.headers.host}${
            //         await (await Recipe.files(
            //             await (await Recipe.recipeFiles(recipe.id)).rows[0].file_id)).rows[0].path.replace("public", "")}`,
            //     chef_name: Object.values(await (await Chef.searchName(recipe.chef_id)).rows[0])
            // }))

            
            recipes = await Promise.all (
                    recipes.map(async recipe => {
                        recipe
                        recipe['img'] = await getRecipeFirstImage(recipe, req)
                        recipe['chef_name'] = await getChefName(recipe.chef_id)
                        return recipe
                })
            )
                
            return res.render('site/recipes', {recipes})
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipeShow(req, res) {
        const { id } = req.params

        let recipe = await Recipe.findOne({
            where: {id}
        })

        // const results = await Recipe.recipeFiles(recipe.id) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
        // for (let i=0; i < 1; i++){ /* Pega só a primeira imagem de cada receita */
        //     let img = await Recipe.files(results.rows[i].file_id)
        //     img.rows[0].path = `${req.protocol}://${req.headers.host}${img.rows[0].path.replace("public", "")}`
        //     recipe['img'] = img.rows[0].path
        //     let chefName = await Chef.searchName(recipe.chef_id)
        //     recipe['chef_name'] = Object.values(chefName.rows[0])
        // }

        // recipe = await Promise.all (
        //     async recipe => {
        //         recipe
        //         recipe['img'] = await getRecipeFirstImage(recipe.id, req)
        //         recipe['chef_name'] = await getChefName(recipe.chef_id)
        //         return recipe
        //     }
        // )

        recipe['img'] = await getRecipeFirstImage(recipe, req)
        recipe['chef_name'] = await getChefName(recipe.chef_id)

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