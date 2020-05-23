// function adicionarIngrediente() {
//     const ingredientes = document.querySelector('#ingredientes')
//     const campoContainer = document.querySelectorAll('.ingrediente')

//     const novoCampo = campoContainer[campoContainer.length - 1].cloneNode(true)

//     if (novoCampo.children[0].value == "") return false

//     novoCampo.children[0].value = ""
//     ingredientes.appendChild(novoCampo)
// }

// function adicionarPasso() {
//     const passos = document.querySelector('#passos')
//     const campoContainer = document.querySelectorAll('.passo')

//     const novoCampo = campoContainer[campoContainer.length - 1].cloneNode(true)

//     if (novoCampo.children[0].value == "") return false

//     novoCampo.children[0].value = ""
//     passos.appendChild(novoCampo)
// }

// const ingrediente = document.querySelector('.adicionar-ingrediente')
// ingrediente.addEventListener('click', adicionarIngrediente)

// const passo = document.querySelector('.adicionar-passo')
// passo.addEventListener('click', adicionarPasso)


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