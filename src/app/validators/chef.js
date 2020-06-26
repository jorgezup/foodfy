const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

function checkAllFields(body) {
    //verificar se todos os campos estão completos
    const keys = Object.keys(body)

    for(let key of keys) {
        if (body[key] == '') {
            return {
                error: 'Preencha todos os campos'
            }
        }
    }
}

async function show(req, res, next) {
    const { id } = req.params
            
    const chef = await Chef.findOne({
        where: {id}
    })

    if (!chef) return res.render('admin/chefs/index', {
        error: "Chef não encontrado"
    })
    
    req.chef = chef 

    next()
} 

async function post(req, res, next) {
    
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.send('Por favor preencha todos os campos!')
    }

    if (!req.files || req.files.length == 0) {
        return res.send('Por favor insira pelo menos uma imagem!')
    }

    next()
}

async function edit(req, res, next) {
    const { id } = req.params
            
    const chef = await Chef.findOne({
        where: {id}
    })

    if (!chef) return res.render('admin/chefs/index', {
        error: "Chef não encontrado"
    })
    
    req.chef = chef 

    next()
}

async function remove(req, res, next) {
    const recipes = await Recipe.findAll({
        where: {
            chef_id: req.body.id
        }
    })
    
    if (Object.keys(recipes).length > 0) {
        return res.render("admin/chefs/hasRecipes")
    }

    next()
}

module.exports = {
    show,
    post,
    edit,
    remove
}