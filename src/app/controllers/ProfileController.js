const User = require('../models/User')

module.exports = {
    async index(req, res) {
        const { user } = req
        if (!user.is_admin) {
            return res.render('admin/user/edit', {user, req})
        }
    },
    async put(req, res) {
        try {
            const { user } = req
            console.log(user.name)
            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render('admin/user/edit', {
                user:req.body,
                success: "Conta atualizada com sucesso!!"
            })

        } catch (error) {
            console.error(error)
            return res.render('admin/user/index', {
                error: "Algum erro aconteceu."
            })
        }
    },
}