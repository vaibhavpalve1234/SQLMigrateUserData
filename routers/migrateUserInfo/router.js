const { Router } = require("express");
const {migrateAllUser, migrateOneUser} = require('./controller')

let migrateUser =Router().get('/migrateUser', migrateAllUser).post('/', migrateOneUser)
module.exports = migrateUser