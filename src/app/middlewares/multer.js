const multer = require('multer')

/* Onde vai salvar a imagem, e qual o nome da imagem */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`)
    }
})

/* Qual o tipo de imagem */
const fileFilter = (req, file, cb) => {
    const isAccepted = [ 'image/png', 'image/jpg', 'image/jpeg']
    .find(acceptedFormat => acceptedFormat == file.mimetype)

    if (isAccepted) {
        return cb(null, true)
    }

    return cb(null, false)
}

module.exports = multer ({
    storage,
    fileFilter
})