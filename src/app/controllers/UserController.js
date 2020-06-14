const User = require('../models/User')


module.exports = {
    registerForm(req, res) {
        return res.render('admin/user/register')
    },
    async show(req, res) {
        const { user } = req
        const isAdmin = req.user.is_admin

        if (!user.is_admin) {
            return res.render('admin/user/edit', { user, isAdmin })
        }
    },
    async list(req, res) {
        const users = await User.findAll()
        const isAdmin = req.user.is_admin

        return res.render('admin/user/list-users', { users, isAdmin })
    },
    async post(req, res) {

        await User.create(req.body)

        return res.redirect('/admin/users')

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
            console.log(keys)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send(`Preencha todos os campos!  ---> ${key}`)
                }
            }
            console.log(req.body)

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

            User.delete(req.user.id)

            return res.render('admin/index', {
                success: "Conta removida com sucesso!"
            })

        } catch (error) {
            console.error(error)
            return res.render('admin/user/edit-admin', {
                user: req.user,
                error: "Erro ao tentar deletar a conta"
            })
        }
    }
}