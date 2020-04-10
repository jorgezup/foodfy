const { date } = require('../../lib/utils')

const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        Chef.all(function (chefs) {
            // return res.send('oi')
            return res.json(chefs)
        })
    },

    create(req, res) {
        // return res.render('admin-chefs/create')
        return res.send('create-page')
    },

    post(req, res) {
        const keys = Object.keys(req.body)


        for (let key of keys) {
            if (req.body[key] == "")
                return res.send('Por Favor preencha todos os campos')
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`/admin-chefs/chefs`)
        })
    },

    show(req, res) {
        // Chef.find(req.params.id, function (chef) {
        //     if (!chef){
        //         return res.send("Chefe não encontrado!")
        //     }
        //     return res.json(chef)
        // })
        // Chef.findRecipe(req.params.id, function(recipes) {
        //     if (!recipes)
        // })

        Chef.findRecipeChef(req.params.id, function (chef) {
            console.log(chef)
            if (!chef) {
                Chef.find(req.params.id, function (chef) {
                    if (!chef){
                        return res.send("Chefe não encontrado!")
                    }
                    return res.json(chef)
                })
            } else {
                // return res.render(`admin-chefs/show`, {chef})
                return res.json(chef)
            }
        })
    },

    edit(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send("Chef não encontrado!")

            // return res.render(`admin-chefs/edit`, { chef })
            return res.json(chef)
        })
    },

    put(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Preencha todos os campos")
        }

        Chef.update(req.body, function () {
            // return res.redirect(`/admin-chefs/chefs/${req.body.id}`)
            return res.json(req.body.id)
        })
    },

    delete(req, res) {
        Chef.findRecipeChef(req.body.id, function(chef) {
            console.log(chef)
            if (chef[0]) {
                res.send(`O chef de id: ${req.body.id} não pode ser excluído pois possui receitas cadastradas`)
            } else {
                Chef.delete(req.body.id, function () {
                    // return res.redirect(`/admin/chefs`)
                    return res.send(`o ${req.body.id} doi deletado com sucesso`)
                })
            }
        })
    }
}