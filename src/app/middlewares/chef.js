const Chef = require('../models/Chef')

async function chefExists(req, res, next) {
    const chefs = await Chef.findAll()

    if (chefs == "") return res.render('admin/recipes/index', {
        error: "Não é possível criar uma receita pois não há nenhum chef cadastrado"
    })

    next()
}

module.exports = {
    chefExists
}