const faker = require('faker')
const fs = require('fs')
const { hash } = require('bcryptjs')

const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const User = require('./src/app/models/User')
const File = require('./src/app/models/File')
const RecipeFile = require('./src/app/models/RecipeFile')

const imageFolderRecipes = 'public/assets/recipes/'
const imageFolderChefs = 'public/assets/chefs/'

let recipesIds = []
let chefsIds = []
let total = 10

async function createRecipes() {
    const recipes = []

    while (recipes.length < total) {
        recipes.push({
            chef_id: Math.ceil(Math.random() * chefsIds.length),
            title: faker.name.title(),
            ingredients: faker.random.words([4]),
            preparation: faker.lorem.sentences(2),
            information: faker.lorem.sentences(3),
            user_id: Math.ceil(Math.random() * total)
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)

    recipesIds.forEach(async id => {
        let randomFilesRecipe = Math.ceil(Math.random() * 3) + 1

        for (let index =0; index< randomFilesRecipe; index++) {

            let recipeImage = fs.readdirSync(imageFolderRecipes)

            let image = recipeImage[Math.floor(Math.random() * recipeImage.length)]
            let imageSource = imageFolderRecipes+image
            let destinationFolder = `public/images/${Date.now().toString()}-${index}-${image}`

            fs.copyFile(imageSource, destinationFolder, (err) => {
                if (err) throw err;
            });
    
            let file_id = await File.create({
                name: image,
                path: destinationFolder
            })
            RecipeFile.create({
                recipe_id: id,
                file_id
            })
        }
    });
}

async function createChefs() {
    const chefs = []

    while (chefs.length < total) {
        let chefImage = fs.readdirSync(imageFolderChefs)

        let image = chefImage[Math.floor(Math.random() * chefImage.length)]
        let imageSource = imageFolderChefs+image

        let destinationFolder = `public/images/${Date.now().toString()}-${image}`

        fs.copyFile(imageSource, destinationFolder, (err) => {
            if (err) throw err;
        });

        let file_id = await File.create({
            name: image,
            path: destinationFolder
        })

        chefs.push({
            name: faker.name.firstName(),
            file_id: file_id,
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

async function createUsers() {
    const users = []
    const password = await hash('111', 8)
    
    while (users.length < total) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: Math.round(Math.random())
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()
