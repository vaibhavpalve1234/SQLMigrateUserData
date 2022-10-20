const { Router } = require("express");
const migrateAllUser = require('./controller')

let migrateUser =Router().get('/migrateUser', migrateAllUser).post('/', migrateAllUser)
module.exports = migrateUser