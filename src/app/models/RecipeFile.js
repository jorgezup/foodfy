const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    async find(id) {
        return db.query(`SELECT file_id FROM recipe_files WHERE recipe_id = $1`, [id])
    }
}