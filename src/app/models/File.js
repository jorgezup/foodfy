const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')


Base.init({ table: 'files' })


module.exports = {
    ...Base,
    // create({filename, path}) {
    //     const query = `
    //         INSERT INTO files (
    //             name,
    //             path
    //         ) VALUES ($1, $2)
    //     RETURNING id
    //     `
    //     const values = [
    //         filename,
    //         path
    //     ]

    //     return db.query(query, values)
    // },
    async delete(id) {
        try {    
                let results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
                let file = results.rows[0]

                await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
                fs.unlinkSync(file.path)

            return
        } catch (err) {
            console.error(err)
        }
    },
    async deleteChefAvatar(id) {
        try {
            let result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            let file = result.rows[0]
            
            fs.unlinkSync(file.path)
            
            await db.query(`DELETE FROM files WHERE id = $1`, [id])

            return
        } catch (err) {
            console.error(err)
        }
    }
}