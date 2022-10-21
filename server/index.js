const express = require('express');
require('dotenv').config()
var CronJob = require('cron').CronJob;
new CronJob('00 30 11 * * 2-6', function(){

});
const homePage = require('../routers/homeRouter/router')
const userMigrate = require('../routers/migrateUserInfo/router')
const migrateBank = require('../routers/migrateBankDetails/router')
const app = express()
app.use('/',homePage)
app.use('/', userMigrate)
app.use('/',migrateBank)
app.get("/",(req, res) =>{
    try {
        res.status(200).send({"result":"User insert succefully", "status":"true"})
    } catch (error) {
        res.status(404).send({"error":"error!!!!!", "status":"false"})
    }
})
let port =  process.env.PORT || 3001
app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})
