const {inserDataIntoSql, inserDataIntoSqlOneUSer } = require('../../migrate/usermigrate');
const { asyncForEach } = require('../../util/asyncForEach');
const migrateAllUser = (req, res) =>{
    try {
        let {result, error } = inserDataIntoSql()
        res.status(200).send({"result":"User insert succefully", "status":"true"})
    } catch (error) {
        console.log(error);
        res.status(404).send("errrrrrrrrrrorr!!!!!!")
    }
}

const migrateOneUser = async(req, res) =>{
    try {
        let { phoneNumbers: userIdentifiers } = req.body;
        if (!Array.isArray(userIdentifiers)) {
          return res.status(404).send({
            message: 'Please provide phoneNumbers key in Array format',
          });
        }
        await asyncForEach(userIdentifiers, async (userIdentifeir) => {
        console.log(req.body);
        if(!userIdentifeir){
            throw error
        }
        let {result, error } = inserDataIntoSqlOneUSer(userIdentifeir)
        res.status(200).send({"result":"User insert succefully", "status":"true"})
    })
    } 
    catch (error) {
        console.log(error);
        res.status(404).send("errrrrrrrrrrorr!!!!!!")
    }
}
module.exports = {migrateAllUser,migrateOneUser}