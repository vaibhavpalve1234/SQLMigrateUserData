const {inserDataIntoSql, inserDataIntoSqlOneUSer } = require('../../migrate/usermigrate')
const migrateAllUser = (req, res) =>{
    try {
        let {result, error } = inserDataIntoSql()
        res.status(200).send({result, error})
    } catch (error) {
        console.log(error);
        res.status(404).send("errrrrrrrrrrorr!!!!!!")
    }
}

const migrateOneUser = (req, res) =>{
    try {
        let userIdentifeir = req.body.phoneNumber
        let {result, error } = inserDataIntoSqlOneUSer(userIdentifeir)
        res.status(200).send({result, error})
    } catch (error) {
        console.log(error);
        res.status(404).send("errrrrrrrrrrorr!!!!!!")
    }
}
module.exports = migrateAllUser