const User = require('../models/User')
const { compare, hash } = require('bcryptjs')


async function login(req, res, next) {
    const { email, password } = req.body
    const user = await User.findOne({
        where: {email}
    })
    
    if (!user) return res.render('admin/session/login', {
        user: req.body,
        error: "Usuário não cadastrado"
    })
    
    const passed = await compare(password, user.password)

    if (!passed) return res.render('admin/session/login', {
        user: req.body,
        error: "Senha incorreta"
    })

    req.user = user 

    next()
}

async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body
      
        const user = await User.findOne({where:{email}})
            
        if (!user) {
            return res.render('admin/session/forgot-password', {
                user: req.body,
                error: "E-mail não cadastrado."
            })
        }
        req.user = user

        next()

    } catch (error) {
        console.error(error)
    }
}

async function resetPassword(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body
    try {

        const user = await User.findOne({where:{email}})
        
        if (!user) {
            return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: "E-mail não cadastrado."
            })
        }
        
        const passed = password == passwordRepeat

        if (!passed) {
            return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: "Senhas não coincidem"
            })
        }

        if (token != user.reset_token) {
            return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: 'Token inválido! Solicite uma nova recuperação de senha.'
            })
        }

        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) {
            return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: 'Token expirado! Solicite uma nova recuperação de senha.'
            })
        }

        req.user = user

        next()

    } catch (error) {
        console.error(error)
    }
}





module.exports = {
    login,
    forgotPassword,
    resetPassword
}