const Recipe = require('../models/Recipe')
const User = require('../models/User')


async function ownerRecipe(req, res, next) {
    const recipe = await Recipe.findOne({where:{id:req.params.id}})

    if (recipe.user_id != req.session.userId) {
        /* Acesso negado */
        return res.render(`admin/index`, {
            error: "Você não tem permissão de editar a receita de outro usuário."
        })
    }
       
    next()
}

async function verifyOwnerRecipe(req, res, next) {
    const userId = req.session.userId
    const user = await User.findById(userId)

    if (!user.is_admin) {
        const recipes = await Recipe.findAll({where:{user_id:userId}})
        if (recipes == "") {
            return res.render('admin/recipes/index', {
                // error: "Você não possui receitas cadastradas."
            })
        } else {
            req.recipes = recipes

        }
    }


    next()
}

module.exports = {
    ownerRecipe,
    verifyOwnerRecipe
}