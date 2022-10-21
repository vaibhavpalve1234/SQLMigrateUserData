const homePage = require('./controller')

const { Router } = require("express");
let homeRouter = Router().get('/homepage', homePage)
module.exports = homeRouter
