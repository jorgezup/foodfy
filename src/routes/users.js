const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')
const { isLoggedRedirect, onlyAdmin, onlyUsers, verifyIsAdmin } = require('../app/middlewares/session')


// login /logout 
routes.get('/login', isLoggedRedirect, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)


//forgot-password
routes.get('/users/forgot-password', SessionController.forgotPasswordForm)
routes.post('/users/forgot-password', SessionValidator.forgotPassword, SessionController.forgotPassword)

routes.get('/users/reset-password', SessionController.resetPasswordForm)
routes.post('/users/reset-password', SessionValidator.resetPassword, SessionController.resetPassword)


// // Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, UserValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', onlyUsers, UserValidator.update, ProfileController.put)// Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyUsers, verifyIsAdmin, onlyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/new-user', onlyUsers, verifyIsAdmin, onlyAdmin, UserController.registerForm) //Cadastrar um usuário
routes.post('/users', onlyUsers, verifyIsAdmin, onlyAdmin, UserValidator.post, UserController.post) //Cadastrar um usuário
routes.get('/users/:id/edit', onlyUsers, verifyIsAdmin, onlyAdmin, UserController.edit) //Cadastrar um usuário
routes.put('/users', onlyUsers, verifyIsAdmin, onlyAdmin, UserValidator.updateByAdmin, UserController.put) // Editar um usuário
routes.delete('/users', onlyAdmin, verifyIsAdmin, UserValidator.remove, UserController.delete) // Deletar um usuário

module.exports = routes