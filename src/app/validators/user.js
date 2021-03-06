const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    //verificar se todos os campos estão completos
    const keys = Object.keys(body)

    for(let key of keys) {
        if (body[key] == "" && key != 'password') {
            return {
                user: body,
                error: 'Preencha todos os campos'
            }
        }
    }
}


async function show(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({
        where: {id}
    })

    if (!user) return res.render('admin/user/register', {
        error: "Usuário não encontrado"
    })
    
    req.user = user //passa o user na req

    next() //chama a próxima no caso, UserController -> show
}

async function post(req, res, next) {
    const isAdmin = req.isAdmin

    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/user/register', fillAllFields, isAdmin)
    }

    //verificar se o email já existe
    const { email, password, passwordRepeat } = req. body
    const user = await User.findOne({
        where: {email}
    })

    if (user) return res.render("admin/user/register", {
        user: req.body,
        error: 'Usuário já cadastrado',
        isAdmin
    })

    //verificar se as senhas são iguais
    if (password != passwordRepeat) {
        return res.render("admin/user/register", {
            user: req.body,
            error: 'Senha não confere',
            isAdmin
        })
    }

    next()
}

async function update(req, res, next) {
    const isAdmin = req.isAdmin
    
    // verificar se todos os campos preenchidos
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/user/edit', fillAllFields, isAdmin)
    }

    // verificar se a senha está preenchida
    const { id, password } = req.body

    if (!password) return res.render('admin/user/edit', {
        user: req.body,
        error: "Insira sua senha para atualizar seu cadastro",
        isAdmin
    })

    //verificar se o email já existe
    const { email } = req. body
    let user = await User.findOne({
        where: {email}
    })

    if ((!user)||(user==undefined)) return res.render("admin/user/edit", {
        user: req.body,
        error: 'E-mail não encontrado, favor verifique.',
        isAdmin
    })

    if (user.id != req.body.id) return res.render("admin/user/edit", {
        user: req.body,
        error: 'Este e-mail já está sendo utilizado.',
        isAdmin
    })

    // password match
    user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)
    if (!passed) {
        return res.render('admin/user/edit', {
            user: user,
            error: "Senha incorreta",
            isAdmin
        }) 
    }
    req.user = user 

    next()
}

async function updateByAdmin(req, res, next) {
    const isAdmin = req.isAdmin
    
    // verificar se todos os campos preenchidos
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/user/edit-admin', fillAllFields, isAdmin)
    }

    // // verificar se a senha está preenchida
    // const { id, password } = req.body

    // if (!password) return res.render('admin/user/edit', {
    //     user: req.body,
    //     error: "Insira sua senha para atualizar seu cadastro",
    //     isAdmin
    // })

    //verificar se o email já existe
    const { email } = req.body
    let user = await User.findOne({
        where: {email}
    })

    if ((!user)||(user==undefined)) return res.render("admin/user/edit-admin", {
        user: req.body,
        error: 'E-mail não encontrado, favor verifique.',
        isAdmin
    })

    if (user.id != req.body.id) return res.render("admin/user/edit-admin", {
        user: req.body,
        error: 'Este e-mail já está sendo utilizado.',
        isAdmin
    })

    req.user = user 

    next()
}

async function remove(req, res, next) {
    const isAdmin = req.isAdmin

    const userId = req.session.userId
    const user = await User.findById(req.body.id)

    if (userId == req.body.id) return res.render('admin/user/deleteError', {isAdmin})

    req.user = user
    
    next()
}



module.exports = {
    post,
    show,
    update,
    updateByAdmin,
    remove
}