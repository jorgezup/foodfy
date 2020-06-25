const User = require('../models/User')

async function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/admin')
    }

    const user = await User.findOne({where:{id:req.session.userId}})

    req.user = user
       
    next()
}

async function isLoggedRedirect(req, res, next) {
    if (req.session.userId) {
        const user = await User.findOne({where:{id:req.session.userId}})
        const isAdmin = user.is_admin
        return res.render('admin/index', {isAdmin})
        // return res.redirect('/admin')
    }

    next()
}

async function onlyAdmin(req, res, next) {
    const user = await User.findOne({where:{id:req.session.userId}})
    if (!user.is_admin) {
        /* Acesso negado */
        return res.render('admin/index', {
            error: "Acesso negado"
        })
    }
    req.user = user
    next()
}

async function verifyIsAdmin(req, res, next) {
    const isAdmin = req.user.is_admin

    req.isAdmin = isAdmin

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirect,
    onlyAdmin,
    verifyIsAdmin
}