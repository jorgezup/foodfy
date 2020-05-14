const faker = require('faker')
const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')

let recipesIds = []

async function createRecipes() {
    const recipes = []

    while (recipes.length < 10) {
        recipes.push({
            chef_id: faker.random.number(9),
            image: faker.image.food(),
            title: faker.name.title(),
            ingredients: faker.random.words([4]),
            preparation: faker.lorem.sentences(2),
            information: faker.lorem.sentences(3)
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)
}

async function createChefs() {
    const chefs = []
    let i = 1
    while (chefs.length < 10) {
        chefs.push({
            id: i,
            name: faker.name.firstName(),
            avatar_url: faker.image.avatar(),
        })
        i++
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

// createChefs()
createRecipes()
