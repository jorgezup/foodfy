const { date } = require('../../lib/utils')

const Recipe = require('../models/Recipe')


module.exports = {
    index(req, res) {

        let { filter, page, limit }= req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page, 
            limit, 
            offset,
            callback(recipes) {
                let mathTotal = recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total /limit)

                const pagination = {
                        total: mathTotal,
                        page
                }
                return res.render(`admin/index`, { receitas:recipes, pagination, filter})
            }
        }

        Recipe.paginate(params)

        /* const { filter } = req.query

        if (filter) {
            Recipe.findByName(filter, function (recipes) {
                return res.render(`admin/index`, { receitas: recipes, filter })
            })
        } else {
            Recipe.all(function (recipes) {
                return res.render('admin/index', { receitas: recipes })
            })
        } */
    },

    create(req, res) {
        return res.render('admin/create')
    },

    post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send('Por favor, Preencha todos os campos')
        }

        Recipe.create(req.body, function (recipe) {
            return res.redirect(`/admin/receitas`)
        })
    },

    show(req, res) {
        Recipe.find(req.params.id, function (recipe) {

            if (!recipe) return res.send("Receita não encontrada")

            // recipe.create_at = date(recipe.create_at).format

            return res.render(`admin/show`, { recipe })
        })
    },

    edit(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Receita não encontrada")

            return res.render(`admin/edit`, { recipe })
        })
    },

    put(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Preencha todos os campos")
        }

        Recipe.update(req.body, function () {
            return res.redirect(`/admin/receitas/${req.body.id}`)
        })
    },

    delete(req, res) {
        Recipe.delete(req.body.id, function () {
            return res.redirect('/admin/receitas')
        })
    }
}



