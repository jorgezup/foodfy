const db = require('../../config/db')
const Base = require('./Base')


Base.init({ table: 'recipes' })

module.exports = {
    ...Base
}