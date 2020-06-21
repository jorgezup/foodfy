const Chef = require('../models/Chef')

async function chefExists(req, res, next) {
    const chef = await Chef.findOne({where:{id:req.params.id}})
    if ((!chef) || (chef==undefined)) {
        res.status(404).render('admin/not-found')
    }
    else {
        next()
    }
}

module.exports = {
    chefExists
}