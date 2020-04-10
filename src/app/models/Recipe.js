const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
            SELECT * FROM recipes
        `, function (err, results) {
            if (err) throw `Database Error ${err}`

            callback(results.rows)
        })
    },

    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    find(id, callback) {
        const query = `SELECT * FROM recipes WHERE id = $1`
        db.query(query, [id], function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    findByName(filter, callback) {
        db.query(`
        SELECT * FROM recipes WHERE title ILIKE '%${filter}%'
        `, function (err, results) {
            if (err) throw `Database Error! ${err}`
            callback(results.rows)
        })
    },

    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image=($2),
                title=($3),
                ingredients=($4),
                preparation=($5),
                information=($6)
            WHERE id = $7
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },

    delete(id, callback) {
        const query = `DELETE FROM recipes WHERE id = $1`
        values = [id]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`

            return callback()
        })
    },

    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total `

        if (filter) {
            filterQuery = `${query}
            WHERE recipes.title ILIKE '%${filter}%' 
            `
            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            )AS total`
        } 

        query = `
            SELECT recipes.*, ${totalQuery} FROM recipes 
            ${filterQuery}
            LIMIT $1 OFFSET $2
        `
        

        db.query(query, [limit, offset], function (err, results) {
            if (err) throw `Database Error ${err}`

            callback(results.rows)
        })
    }
}