
const { connection } = require("../connection/myslconnection");
const { asyncForEach } = require("../util/asyncForEach");
const { getAllUserInformation, getClientInformation } = require("../util/fetchData");

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


const migrateBankDetails = async () => {
  try {
    let bankDetails = [];
    let usersInformation = await getAllUserInformation();
    let userIdentifiers = Object.keys(usersInformation);
    await asyncForEach(userIdentifiers, async (userIdentifier) => {
      let { workProfile, userProfile } = usersInformation[userIdentifier] || {}
      if (!workProfile) {
        return;
      }
      let employerName = Object.keys(workProfile)[0]
      let { account } = workProfile[employerName]
      let client = Object.keys(workProfile)[0] || []
      console.log(userIdentifier);
      let clientInfo = await getClientInformation(client, userIdentifier)
      let { clientId } = clientInfo
      let { bankAcNo, bankName, ifscCode } = account || {}
      if(!bankAcNo || !bankName || !ifscCode){
        return;
      }
      let { user_id, firstName, lastName } = userProfile
      let fullName = firstName + " " + lastName
      insertBankDetails(clientId,bankName,fullName,bankAcNo,ifscCode,userIdentifier)
      })
  } catch (error) {
    console.log(error);
  }
};

const insertBankDetails = async(clientId,bankName,fullName,bankAcNo,ifscCode,userIdentifier) => {
    let result = connection.query(`select * from ewa_user_bank_account where OLD_USERIDENTIFIER = ${userIdentifier}`, (err, result) => {
      console.log(result);
      if (result.length > 0) {
        console.log('user already present in db');
        return result
      }
      else {
        console.log("insert");
        connection.query(`INSERT INTO ewa_user_bank_account(USER_COMPANY_ID, BANK_NAME, ACCOUNT_NAME, ACCOUNT_NUMBER, IFSC, STATUS, ISVERIFIED, VERIFIED_DATE, CREATED_BY, CREATED_TS , UPDATED_BY, UPDATED_TS, OLD_USERIDENTIFIER)values('${clientId}','${bankName}','${fullName}','${bankAcNo}','${ifscCode}','Active','true','${formatDate(new Date())}','user', '${formatDate(new Date())}','user','${formatDate(new Date())}','${userIdentifier}')`, (err, res) => {
          if (err) throw err;
          console.log('Last insert ID:', res.insertId);
        }
        );
      }
    })
    return {result}
  }
migrateBankDetails();