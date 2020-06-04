const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('admin/user/register')
    },
    async show(req, res) {
        const { user } = req
        if (!user.is_admin) {
            return res.render('admin/user/edit', { user, req })
        }
    },
    async list(req, res) {
        const users = await User.findAll()
        return res.render('admin/user/list-users', { users, req })
    },
    async post(req, res) {

        // const userId = await User.create(req.body)

        // req.session.userId = userId
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

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send(`Preencha todos os campos!  ---> ${key}`)
                }
            }
            
            await User.update(req.body.id, {
                name: req.body.name,
                email: req.body.email
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
}