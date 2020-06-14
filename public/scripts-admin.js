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
    }
}

const divError = document.querySelector('.messages.errors')
if (divError) {
    const inputsElement = document.querySelectorAll('form div.fields input')
    inputsElement.forEach(inputElement => {
        inputElement.classList.add('input-error')
    });
}