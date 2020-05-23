const db = require('../../config/db')

function find(filters, table) {
    let query = `SELECT * FROM ${table}`
    if (filters) {
        Object.keys(filters).map(key => {
            //WHERE | OR | AND
            if (key == 'ORDER BY') {
                query = `${query} ORDER BY ${Object.values(filters)} DESC`
            }
            else {
            query = `${query} ${key}`
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`
                })
            }
        })
    }
    return db.query(query)
}


const Base = {

    init({ table }) {
        if (!table) throw new Error('Invalid Params')

        this.table = table

        return this
    },
    async findById(id) {
        const results = await find({ where: { id } }, this.table)
        // const query = `SELECT * FROM ${this.table} WHERE id = ${id}`

        // const results = await db.query(query)
        return results.rows[0]
    },
    async findAll(filters) {
        const results = await find(filters, this.table)

        return results.rows
    },
    async findOne(filters) {
        const results = await find(filters, this.table)

        return results.rows[0]
    },
    async create(fields) { //Recipe.create({name: 'pizza})
        try {
            let keys = [], values = []

            /* Object.keys(fields) -> retorna os campos do objeto  */
            /* Object.values(fields) -> retorna os valores */

            Object.keys(fields).map(key => {
                // adiciona a chave no array de keys
                keys.push(key)

                if (key == 'ingredients' || key == 'preparation') {
                    //se a key for uma das duas, por elas serem um array
                    // adiciona uma { entre o valor }
                    values.push(`'{${fields[key]}}'`) // adiciona o array de values
                    // o valor do campo correspondente a chave
                } else {
                    values.push(`'${fields[key]}'`) 
                }
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
            VALUES (${values.join(',')})
            RETURNING id`

            const results = await db.query(query)
            return results.rows[0].id

        } catch (error) {
            console.error(error)
        }
    },
    update(id, fields) {
        try {
            let update = []

            Object.keys(fields).map(key => {
                let line = ""
                if (key == 'ingredients' || key == 'preparation') {
                    line = `${key} = '{${fields[key]}}'`
                    update.push(line)
                }
                else {
                    line = `${key} = '${fields[key]}'`
                    update.push(line)
                }
            })

            let query = `UPDATE ${this.table} SET 
                ${update.join(',')} WHERE id = ${id}`

            db.query(query)

            return
        } catch (error) {
            console.error(error)
        }
    },
    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id =${id}`)
    },
    files(id) {
        return db.query(`
            SELECT * FROM files WHERE id = $1
        `, [id])
    }

}

module.exports = Base