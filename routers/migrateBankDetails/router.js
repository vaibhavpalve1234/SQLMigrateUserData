const { Router } = require("express");
const {migrateAllUserBankDetails, migrateOneUserBankDetails} = require('./controller')

let migrateBank =Router().get('/migrateBank', migrateAllUserBankDetails).post('/migrateBank', migrateOneUserBankDetails)
module.exports = migrateBank