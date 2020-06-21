const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')


const User = require('../models/User')
const Recipe = require('../models/Recipe')
const RecipeFile = require('../models/RecipeFile')
const File = require('../models/File')
const { unlinkSync } = require('fs')


module.exports = {
    registerForm(req, res) {
        return res.render('admin/user/register')
    },
    async show(req, res) {
        try {
            const { user } = req
            const isAdmin = req.user.is_admin
    
            if (!user.is_admin) {
                return res.render('admin/user/edit', { user, isAdmin })
            }
            
        } catch (error) {
            console.error(error)
        }
    },
    async list(req, res) {
        try {
            const users = await User.findAll()
            const isAdmin = req.user.is_admin
    
            return res.render('admin/user/list-users', { users, isAdmin })
            
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            let { name, email, is_admin } = req.body

            const password = crypto.randomBytes(4).toString("hex")
            const passwordHash = await hash(password, 8)

            await User.create({
                name,
                email,
                is_admin: is_admin || false,
                password:passwordHash
            })

            await mailer.sendMail({
                to: email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Credenciais de Acesso ao Foodfy',
                html: `<h2>Credenciais</h2>
                <p>Bem vindo ao Foodfy</p>
                <p>Seu e-mail de login: ${email}</p>
                <p>Sua senha: ${password}</p>
                <h4>Recomendamos que seja feita a alteração de senha.</h4>
                `
            })
    
            return res.redirect('/admin/users')
            
        } catch (error) {
            console.error(error)
        }


    },
    async edit(req, res) {
        try {
            const user = await User.findById(req.params.id)

            if (!user) return res.render(`admin/index`, {
                error: "Usuário não encontrado!"
            })
            return res.render(`admin/user/edit-admin`, { user })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send(`Preencha todos os campos!  ---> ${key}`)
                }
            }
            
            await User.update(req.body.id, {
                name: req.body.name,
                email: req.body.email,
                is_admin: req.body.is_admin || false
            })

            return res.redirect('/admin/users')

        } catch (error) {
            console.error(error)
            return res.render('/admin/user/index', {
                user: req.body,
                error: "Algum erro aconteceu."
            })
        }
    },
    async delete(req, res) {
        try {
            const recipes = await Recipe.findAll({ where: { user_id: req.user.id } })
            if (recipes != "") {
                recipes.forEach(async function (recipe) {
                    let recipeFiles = await RecipeFile.find(recipe.id) // [ { id: 15, recipe_id: 5, file_id: 20 }, ]
                    for (let i = 0; i < recipeFiles.rows.length; i++) {
                        let files = recipeFiles.rows[i]
                        let fileId = Number(Object.values(files))
                        const path = await File.findById(fileId)
                        console.log(path)
    
                        await RecipeFile.delete(fileId)
                        await File.delete(fileId)
                        unlinkSync(path.path)
                    }
                    await Recipe.delete(recipe.id)
                });
            }


            User.delete(req.user.id)

            return res.redirect('/admin/users')

        } catch (error) {
            console.error(error)
            return res.render('admin/user/edit-admin', {
                user: req.user,
                error: "Erro ao tentar deletar a conta 11111111111"
            })
        }
    }
}