const btnToggle = document.querySelectorAll('.toggle')

btnToggle.forEach(function(item) {
    item.addEventListener('click', () => {
        if (item.innerHTML === "esconder") {
            item.innerHTML = "mostrar"
        } else {
            item.innerHTML = "esconder"
        }
        //item.nextElementSibling.classList.toggle('hidden')
        item.nextElementSibling.classList.toggle('hidden')
    })
})