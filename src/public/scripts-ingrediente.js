function adicionarIngrediente() {
    const ingredientes = document.querySelector('#ingredientes')
    const campoContainer = document.querySelectorAll('.ingrediente')

    const novoCampo = campoContainer[campoContainer.length - 1].cloneNode(true)

    if (novoCampo.children[0].value == "") return false

    novoCampo.children[0].value = ""
    ingredientes.appendChild(novoCampo)
}

function adicionarPasso() {
    const passos = document.querySelector('#passos')
    const campoContainer = document.querySelectorAll('.passo')

    const novoCampo = campoContainer[campoContainer.length - 1].cloneNode(true)

    if (novoCampo.children[0].value == "") return false

    novoCampo.children[0].value = ""
    passos.appendChild(novoCampo)
}

const ingrediente = document.querySelector('.adicionar-ingrediente')
ingrediente.addEventListener('click', adicionarIngrediente)

const passo = document.querySelector('.adicionar-passo')
passo.addEventListener('click', adicionarPasso)


