const User = require('../models/User')

async function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/users/login')
    }

    const user = await User.findOne({where:{id:req.session.userId}})

    req.user = user
       
    next()
}

function isLoggedRedirect(req, res, next) {
    if (req.session.userId) {
        return res.render('admin/index', {req})
    }

    next()
}

async function isAdmin(req, res, next) {
    const user = await User.findOne({where:{id:req.session.userId}})
    if (!user.is_admin) {
        /* Acesso negado */
        return res.render('admin/index', {
            error: "Acesso negado"
        })
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirect,
    isAdmin
}