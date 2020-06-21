const Recipe = require('../models/Recipe')
const User = require('../models/User')

// async function recipeExists(req, res, next) {
//     const recipe = await Recipe.findOne({where:{id:req.params.id}})
//     if ((!recipe) || (recipe==undefined)) {
//         res.status(404).render('admin/not-found')
//     }
//     else {
//         req.recipe = recipe
           
//         next()
//     }
// }


async function ownerRecipe(req, res, next) {
    const recipe = req.recipe
    const user = await User.findById(req.session.userId)

    if ((recipe.user_id != req.session.userId)&&(user.is_admin != true)) {
        /* Acesso negado */
        return res.render(`admin/index`, {
            error: "Você não tem permissão de editar a receita de outro usuário."
        })
    }

    req.user = user
        
    next()

}

async function verifyOwnerRecipe(req, res, next) {
    const userId = req.session.userId
    const user = await User.findById(userId)

    if (!user.is_admin) {
        const recipes = await Recipe.findAll({where:{user_id:userId}})
        req.recipes = recipes
    }

    next()
}

module.exports = {
    // recipeExists,
    ownerRecipe,
    verifyOwnerRecipe
}