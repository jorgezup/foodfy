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
        const filter = params

        let query = `
            SELECT * FROM recipes
                WHERE 1 = 1
        `
        
        if (filter) {
            query += ` AND recipes.title ILIKE '%${filter}%'`
        }

        return db.query(query)
    }
}