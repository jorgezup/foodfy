function paginate(selectedPage, totalPages) {
    let pages = [], 
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectePage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectePage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }
    }
    return pages
}

function createPagination(pagination) {
    const filter = Number(pagination.dataset.filter)
    const page = Number(pagination.dataset.page)
    const total = Number(pagination.dataset.total)
    const pages = paginate(page, total)
    
    let elements = ""
    
    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}


const currentPage = location.pathname
const menuItems = document.querySelectorAll("header ul li a")

console.log(currentPage)
/* Adiciona a classe active conforme a página que está */
for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}
/* Remove a busca do header, se a página for chefs ou sobre */
if (currentPage == '/chefs' || currentPage == '/sobre') {
    const header = document.querySelector('header ul')
    const busca = header.lastElementChild
    busca .classList.add('hidden')
    console.log(busca)
}


/* Recipe Show (a.toggle -> esconder/mostrar) */
function hiddenList (event) { /* event target é o a */
    const list = event.target.nextElementSibling
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden')
        event.target.innerHTML = "esconder"
    }
    else {
        list.classList.add('hidden')
        event.target.innerHTML = "mostrar"
    }
}
