const express = require('express');
var CronJob = require('cron').CronJob;
new CronJob('00 30 11 * * 2-6', function(){

});
const homePage = require('../routers/homeRouter/router')
const userMigrate = require('../routers/migrateUserInfo/router')
const app = express()
app.use('/',homePage)
app.use('/', userMigrate)
let port = 3000
app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})
