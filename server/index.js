const express = require('express');
require('dotenv').config()
var CronJob = require('cron').CronJob;
new CronJob('00 30 11 * * 2-6', function(){

});
const homePage = require('../routers/homeRouter/router')
const userMigrate = require('../routers/migrateUserInfo/router')
const app = express()
app.use('/',homePage)
app.use('/', userMigrate)
let port =  process.env.PORT
app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})
