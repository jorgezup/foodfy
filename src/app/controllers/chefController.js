const { date } = require('../../lib/utils')

const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        Chef.all(function(chefs) {
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

        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin-chefs/chefs`)
        })
    }
}