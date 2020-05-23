const db = require('../../config/db')
const Base = require('./Base')


Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    recipeFiles(id) {
        return db.query(`
            SELECT * FROM recipe_files WHERE recipe_id = $1
        `, [id])
    }, 
    search(params) {
        const { filter } = params

        let query = "",
            filterQuery = `WHERE`

        filterQuery = `
            ${filterQuery} recipes.title ILIKE '%${filter}%'
        `

        query = `
            SELECT * FROM recipes ${filterQuery}
        `

        return db.query(query)
    }
}