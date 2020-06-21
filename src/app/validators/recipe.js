const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const User = require('../models/User')
const File = require('../models/File')
// const RecipeFile = require('../models/RecipeFile')

async function getImagesRecipe(req, recipeId) {
    const results = await Recipe.recipeFiles(recipeId) /* return   { id: 5, recipe_id: 52, file_id: 10 } */
    let files = []
    for (let i=0; i < results.rows.length; i++){
        let img = await File.findAll({where:{id:results.rows[i].file_id}})
        img[0].path = `${req.protocol}://${req.headers.host}${img[0].path.replace("public", "")}`
        files.push({
            id: img[0].id,
            src:img[0].path,
            name: img[0].name
        })
    }

    return files
}


async function checkAllFields(req) {
    //verificar se todos os campos estão completos
    const keys = Object.keys(req.body)
    let chefs = await Chef.findAll()
    let files = await getImagesRecipe(req, req.body.id)
    
    for(let key of keys) {
        if (req.body[key] == "" && key != 'information' && key != 'removed_files') {
            return {
                recipe: req.body,
                chefs,
                files,
                error: 'Preencha todos os campos'
            }
        }
    }
}

async function show(req, res, next) {
    const { id } = req.params
    const recipe = await Recipe.findOne({
        where: {id}
    })

    if (!recipe) return res.render('admin/recipes/index', {
        error: "Receita não encontrada"
    })
    
    req.recipe = recipe

    next()
} 

async function post(req, res, next) {
    const fillAllFields = await checkAllFields(req)

    if (fillAllFields) {
        return res.render('admin/recipes/create', fillAllFields)
    }

    if (req.files.length == 0) {
        let chefs = await Chef.findAll()

        return res.render('admin/recipes/create', {
            recipe:req.body,
            chefs,
            error: 'Por favor, envie pelo menos uma imagem'
        })
    }

    next()
}

async function edit(req, res, next) {
    const { id } = req.params
    const recipe = await Recipe.findOne({
        where: {id}
    })
    
    if (!recipe) return res.status(404).render('admin/not-found', {
        error: "Receita não encontrada"
    })

    const user = await User.findById(req.session.userId)

    if ((recipe.user_id != req.session.userId)&&(user.is_admin != true)) {
        /* Acesso negado */
        return res.render(`admin/index`, {
            error: "Você não tem permissão de editar a receita de outro usuário."
        })
    }
   
    req.recipe = recipe

    next()
}

async function put(req, res, next) {
    const fillAllFields = await checkAllFields(req)

    if (fillAllFields) {
        return res.render('admin/recipes/edit', fillAllFields)
    }

    let files = await getImagesRecipe(req, req.body.id)

    if (req.body.removed_files) {
        const removedFilesLength = req.body.removed_files.split(',').length
        const removedFiles = req.body.removed_files.split(',')
        for(let i=0; i<removedFilesLength; i++){
            if (removedFiles[i] != ""){
                files.forEach(file => {
                    if(removedFiles[i] == file.id){
                        files = files.filter(item => item != file)
                    }
                })
            }
        }

        if (files.length == 0 && req.files.length == 0) {
            let chefs = await Chef.findAll()
    
            return res.render('admin/recipes/edit', {
                recipe:req.body,
                chefs,
                error: 'Por favor, envie pelo menos uma imagem'
            })
        }
    }
    next()
}


module.exports = {
    show,
    post,
    edit,
    put
}