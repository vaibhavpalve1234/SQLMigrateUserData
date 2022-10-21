const {migrateBankDetails, migrateBankDetailsForOneUser}  = require('../../migrate/migrateUserBankDetails')
const migrateAllUserBankDetails = (req, res) =>{
    try {
        let {result, error } = migrateBankDetails()
        res.status(200).send({"result":"User insert succefully", "status":"true"})
    } catch (error) {
        console.log(error);
        res.status(404).send({"error":"errrrrrrrrrrrooooorrrrrr!!!!!", "status":"false"})
    }
}

const migrateOneUserBankDetails = async(req, res) =>{
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
        let {result, error } = migrateBankDetailsForOneUser(userIdentifeir)
        res.status(200).send({"result":"User insert succefully", "status":"true"})
    })
    } 
    catch (error) {
        console.log(error);
        res.status(404).send({"error":"errrrrrrrrroooooorrrrrr!!!!!", "status":"false"})
    }
}
module.exports = {migrateAllUserBankDetails,migrateOneUserBankDetails}