const fs = require('fs')
const data = require('../../data.json')

//index
exports.index = (req, res) => {
    return res.render('admin/index', { receitas:data.receitas })
}

exports.create = (req, res) => {
    return res.render('admin/create')
}

exports.show = (req, res) => {
    const { id } = req.params

    const receitaEncontrada = data.receitas.find(function (receita) {
        return receita.id == id
    })

    if (!receitaEncontrada) return res.send('Receita não encontrada')

    return res.render('admin/show', { data: receitaEncontrada })
}

exports.edit = (req, res) => {
    const { id } = req.params

    const receitaEncontrada = data.receitas.find(function (receita) {
        return receita.id == id
    })

    if (!receitaEncontrada) return res.send('Receita não encontrada')

    return res.render('admin/edit', { data: receitaEncontrada })
}

exports.post = (req, res) => {

    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "")
            return res.send('Por favor, Preencha todos os campos')
    }

    const { imagem_receita, ingrediente_receita, modo_preparo_receita, informacoes_receita } = req.body
    const id = Number(data.receitas.length + 1)

    data.receitas.push({
        id,
        imagem_receita,
        ingrediente_receita,
        modo_preparo_receita,
        informacoes_receita
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send('Erro de escrita')

        return res.redirect('/admin/receitas')
    })
}

exports.put = (req, res) => {
    const { id } = req.body
    let index

    const receitaEncontrada = data.receitas.find(function (receita, indexEncontrado) {
        if (receita.id == id) {
            index = indexEncontrado
            return true
        }
    })

    if (!receitaEncontrada) return res.send('Receita não encontrada')

    const receita = {
        ...receitaEncontrada,
        ...req.body
    }

    data.receitas[index] = receita

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) return ('Erro ao escrever')

        return res.redirect(`/admin/receitas/${id}`)
    })
}

exports.delete = (req, res) => {
    const { id } = req.body

    const receitaFiltrada = data.receitas.filter(function (receita) {
        return receita.id != id
    })
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err)
            return res.send('Erro de escrita')

        return res.redirect('/admin/receitas')
    })
}

