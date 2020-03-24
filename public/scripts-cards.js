const cards = document.querySelectorAll(".card")
cards.forEach(function(card, index) {

    card.addEventListener('click', () => {
        window.location.href = `/receitas/${index}`
    })
})