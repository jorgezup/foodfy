const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "7ad3a6df92df0d",
        pass: "056b24d459b060"
    }
})

module.exports = transport