const db = require('../../config/db')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')


const Recipe = require('../models/Recipe')
const RecipeFile = require('../models/RecipeFile')
const File = require('../models/File')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async create(data) {
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
    async delete(id) {
        const recipes = await Recipe.findAll({ where: { user_id: id } })

        if (recipes != "") {
            recipes.forEach(async function (recipe) {
                let recipeFiles = await RecipeFile.find(recipe.id) // [ { id: 15, recipe_id: 5, file_id: 20 }, ]
                for (let i = 0; i < recipeFiles.rows.length; i++) {
                    let files = recipeFiles.rows[i]
                    let fileId = Number(Object.values(files))

                    await RecipeFile.delete(fileId)
                    await File.delete(fileId)
                }
                await Recipe.delete(recipe.id)
            });
        }
        return db.query(`DELETE FROM users WHERE id =${id}`)
    }
}