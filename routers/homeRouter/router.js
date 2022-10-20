const homePage = require('./controller')

const { Router } = require("express");
let homeRouter = Router().get('/home', homePage)
module.exports = homeRouter
