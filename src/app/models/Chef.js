const Base = require('./Base')
const db = require('../../config/db')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    searchName(id) {
        return db.query(`
            SELECT name FROM chefs WHERE id = $1
        `, [id])
    }
}