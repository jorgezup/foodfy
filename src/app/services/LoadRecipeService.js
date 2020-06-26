const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')


async function getImagesRecipe(recipeId) {
    const results = await Recipe.recipeFiles(recipeId) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
    let files = []
    for (let i=0; i < results.rows.length; i++){
        let img = await File.findAll({where:{id:results.rows[i].file_id}})
        img[0].path = `${img[0].path.replace("public", "")}`
        files.push({
            id: img[0].id,
            src:img[0].path,
            name: img[0].name
        })
    }
    return files
}

async function getChefName(chefId) {
    let chef = await (await Chef.searchName(chefId)).rows[0]
    let chefName = Object.values(chef)
    return chefName
}

async function format(recipe) {
    const files = await getImagesRecipe(recipe.id)
    recipe.img = files[0].src
    recipe.files = files
    recipe.chef_name = await getChefName(recipe.chef_id)

    return recipe
}


const LoadService = {
    load(service, filter) {
        this.filter = filter

        return this[service]()
    },
    async recipe(){
        try {
            const recipe = await Recipe.findOne(this.filter) 
            
            return format(recipe)
        } catch (error) {
            console.error(error)
        }
    },
    async recipes(){
        try {
            const recipes = await Recipe.findAll(this.filter) 
            // const recipesPromise = recipes.map(recipe => format(recipe))
            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
         } catch (error) {
             console.error(error)
         }
    },
    format,
}

module.exports = LoadService