// (COMPANY_ID, 
// ENTITY_ID, 
// COMPANY_NAME, 
// COMPANY_CODE ,
// COMPANY_ADDRESS ,
// CONTACT1 ,
// EMAIL1 ,
// CONTACT2 ,
// EMAIL2 ,
// CONTACT3 ,
// EMAIL3 ,
// SALARY_DATE,
// LOGO ,
// STATUS ,
// CREATED_BY ,
// CREATED_TS, 
// UPDATED_BY ,
// UPDATED_TS,
// OLD_CLIENTID
// )

const { connection } = require("../connection/myslconnection");
const { asyncForEach } = require("../util/asyncForEach");
const { getAllClientsInformation } = require("../util/fetchData");

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}
const migrateCompanyMaster = async () => {
    try {
        let clientInfo = await getAllClientsInformation()
        await asyncForEach(Object.keys(clientInfo), async (client) => {
            let { clientId, clientName, defaultProductName, address, logoUrl, isActive, loanVerificationEmailId } = clientInfo[client] || {}
            if(clientId){
                inserUserData(clientId, clientName, defaultProductName, address, logoUrl, isActive, loanVerificationEmailId)
            }
        })
        console.log("done");
    } catch (error) {
        console.log(error);
    }
}

const inserUserData = (clientId, clientName, defaultProductName, address, logoUrl, isActive, loanVerificationEmailId) => {
    try {
        let result = connection.query(`select * from ewa_company_master where OLD_CLIENTID = ${clientId}`, (err, result) => {
            if (result.length > 0) {
                console.log('user already present in db');
                return result
            }
            else {
                console.log("insert");
                connection.query(`INSERT INTO ewa_company_master (ENTITY_ID, COMPANY_NAME, COMPANY_CODE ,COMPANY_ADDRESS ,CONTACT1 ,EMAIL1 ,CONTACT2 ,EMAIL2 ,CONTACT3 ,EMAIL3 ,SALARY_DATE,LOGO ,STATUS ,CREATED_BY ,CREATED_TS, UPDATED_BY ,UPDATED_TS,OLD_CLIENTID)values('${clientId}','${clientName}','${clientId}','${address.toString()}','','${loanVerificationEmailId}','','','','','2','${logoUrl}','${isActive}','dev-ops','${formatDate(new Date())}','dev-ops','${formatDate(new Date())}','${clientId}')`, (err, res) => {
                    if (err) throw err;
                    console.log('Last insert ID:', res.insertId);
                }
                );
            }
        })
        return { result }
    } catch (error) {
        console.log(error)
    }

}

// migrateClientInfoDeatils()
module.exports = {migrateCompanyMaster}