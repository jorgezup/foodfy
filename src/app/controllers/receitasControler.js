const { date } = require('../../lib/utils')

const Recipe = require('../models/Recipe')


module.exports = {
    index(req, res) {

        Recipe.all(function(recipes) {
            return res.render('admin/index', { receitas: recipes })
        })
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

        Recipe.create(req.body, function(recipe) {
            return res.redirect(`/admin/receitas`)
        })
    },

    show(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            
            if (!recipe) return res.send("Receita não encontrada")

            console.log(typeof(recipe.ingredients))
            recipe.create_at = date(recipe.create_at).format

            return res.render(`admin/show`, { recipe })
        })
    },

    edit(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send ("Receita não encontrada")

            return res.render(`admin/edit`, { recipe })
        })
    },

    put(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Preencha todos os campos")
        }

        Recipe.update(req.body, function() {
            return res.redirect(`/admin/receitas/${req.body.id}`)
        })
    },

    delete(req, res) {
        Recipe.delete(req.body.id, function() {
            return res.redirect('/admin/receitas')
        })
    }
}



