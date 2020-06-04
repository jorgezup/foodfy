const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')
const { isLoggedRedirect, isAdmin, onlyUsers } = require('../app/middlewares/session')


// login /logout 
routes.get('/login', isLoggedRedirect, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)


//forgot-password
routes.get('/forgot-password', SessionController.forgotPasswordForm)
routes.post('/forgot-password', SessionValidator.forgotPassword, SessionController.forgotPassword)

routes.get('/reset-password', SessionController.resetPasswordForm)
routes.post('/reset-password', SessionValidator.resetPassword, SessionController.resetPassword)


// // Rotas de perfil de um usuário logado
routes.get('/profile', UserValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', UserValidator.update, ProfileController.put)// Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', isAdmin , UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/new-user', isAdmin, UserController.registerForm) //Cadastrar um usuário
routes.post('/users', isAdmin, UserController.post) //Cadastrar um usuário
routes.get('/users/:id/edit', isAdmin, UserController.edit) //Cadastrar um usuário
routes.put('/users', isAdmin, UserController.put) // Editar um usuário
// routes.delete('/admin/users', isAdmin, UserController.delete) // Deletar um usuário

module.exports = routes