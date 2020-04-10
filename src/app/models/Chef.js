const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
            SELECT * FROM chefs
        `, function(err, results) {
            if (err) throw `Database Error ${err}`

            callback(results.rows)
        })
    },

    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `
        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err}`
            
            callback(results.rows[0])
        })
    },

    find(id, callback)  {
        const query = `SELECT * FROM  chefs WHERE id = $1`

        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    findRecipeChef(id, callback) {
        const query = `
            select chefs.name, chefs.avatar_url, recipes.title, recipes.image
            from recipes
            left join chefs on (chefs.id = recipes.chef_id)
            where chefs.id = $1
            order by recipes.id
        `
        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`
            callback(results.rows)
        })
    },

    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name = ($1),
                avatar_url = ($2)
            WHERE id = $3
        `
        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },

    delete(id, callback) {
        const query = `DELETE FROM chefs WHERE id =$1`

        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    }
}