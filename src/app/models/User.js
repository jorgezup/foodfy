const db = require('../../config/db')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')



const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async create(data) {
        crypto.r
        const password = crypto.randomBytes(4).toString("hex")
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
        `
        //hash of password
        const passwordHash = await hash(password, 8)

        let admin = ""
        if (data.is_admin == 'on'){
            admin = true
        } else {
            admin = false
        }

        const values = [
            data.name,
            data.email,
            passwordHash,
            admin
        ]

        console.log(password)

        await mailer.sendMail({
            to: data.email,
            from: 'no-replay@foodfy.com.br',
            subject: 'Credenciais de Acesso ao Foodfy',
            html: `<h2>Credenciais</h2>
            <p>Bem vindo ao Foodfy</p>
            <p>Seu e-mail de login: ${data.email}</p>
            <p>Sua senha: ${password}</p>
            <h4>Recomendamos que seja feita a alteração de senha.</h4>
            `
        })

        const results = await db.query(query, values)

        return results.rows[0].id
    },
    // async update(id, fields) {
    //     let query = "UPDATE users SET"

    //     Object.keys(fields).map((key, index, array) => {
    //         if((index + 1) < array.length) {
    //             query = `${query}
    //                 ${key} = '${fields[key]}',
    //             `
    //         } else {
    //             query = `${query}
    //                 ${key} = '${fields[key]}'
    //                 WHERE id = ${id}
    //             `
    //         }
    //     })
    //     console.log(query)

    //     await db.query(query)

    //     return
    // }
}