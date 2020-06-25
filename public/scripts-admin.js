const currentPage = location.pathname
const menuItems = document.querySelectorAll("header ul li a")
/* Adiciona a classe active conforme a página que está */
for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearError(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)

    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearError(input) {
        const errorDiv = input.parentNode.querySelector(".error")
        if (errorDiv)
            errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"
        return {
            error,
            value
        }
    },
    allFields(event) {
        const items = document.querySelectorAll('input, select')
        const removedFiles = document.querySelector('input[name="removed_files"]')
        for (item of items) {
            if(!removedFiles) {
                if(item.value == "") {
                    const message = document.createElement('div')
                    message.classList.add('messages')
                    message.classList.add('error')
                    message.innerHTML = 'Preencha todos os campos!'
                    document.querySelector('body').append(message)
    
                    event.preventDefault()
                }
            }
        }
    }
}

const divError = document.querySelector('.messages.errors')
if (divError) {
    const inputsElement = document.querySelectorAll('form div.fields input')
    inputsElement.forEach(inputElement => {
        inputElement.classList.add('input-error')
    });
}

/* SHOW - Gallery */
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

/* EDIT - Upload Image */
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        this.input = event.target
        
        if (PhotosUpload.hasLimit(event)) return
        
        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader() //BLOB

            reader.onload = () => {
                const image = new Image() //<img />
                image.src = String(reader.result)
               
                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        this.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const {uploadLimit, input, preview} = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} images`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de imagens')
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        
        div.onclick =  this.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "delete_forever"

        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode //i -> parentNode pega a div
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}


/* EDIT - Add Ingrediente e AddPasso */
function addIngrediente() {
    const div = document.querySelector('div#ingredientes')
    const input = document.querySelector('div#ingredientes > input')
    const clone = input.cloneNode(true)

    if (div.lastElementChild.value == '') {
        return false
    } else {
        clone.value = ''
        div.appendChild(clone)
    }
}

function addPasso() {
    const div = document.querySelector('div#passo')
    const input = document.querySelector('div#passo > input')
    const clone = input.cloneNode(true)

    if (div.lastElementChild.value == '') {
        return false
    } else {
        clone.value = ''
        div.appendChild(clone)
    }
}