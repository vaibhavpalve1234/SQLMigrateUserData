const { getUserInformation, getClientInformation, getAllUserInformation } = require("../util/fetchData");
const { connection } = require("../connection/myslconnection");
const { asyncForEach } = require("../util/asyncForEach");

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
const inserDataIntoSql = async () => {
  try {
    let  result;
    let allUserInfo = await getAllUserInformation()
    let userIdentifire = Object.keys(allUserInfo)
    console.log(userIdentifire.length);
    await asyncForEach(userIdentifire, async (phoneNumber)=>{
      let userData = await getUserInformation(phoneNumber)
      let { userProfile, personal, workProfile } = userData || {}
      if (!workProfile) {
        console.log('user WorkProfile not present', phoneNumber);
        return;
      }
      let { firstName, lastName, user_id, gender, email, dob, address1, city, pinCode, state } = userProfile || {}
      let { panNumber, aadharNumber } = personal || {}
      let { value } = state || {}
      let client = Object.keys(workProfile)[0] || []
      console.log(phoneNumber);
      let clientInfo = await getClientInformation(client, phoneNumber)
      let { clientId } = clientInfo
      if (workProfile) {
        result = inserUserData(phoneNumber, user_id, firstName, lastName, gender, email, dob, address1, city, pinCode, state, panNumber, aadharNumber, value, clientId);
      }
    })
    console.log("done");
    return {result, error}
  } catch (error) {
    return error
  }
}
const inserUserData = (phoneNumber, user_id, firstName, lastName, gender, email, dob, address1, city, pinCode, state, panNumber, aadharNumber, value, clientId) => {
  let result = connection.query(`select * from ewa_user where OLD_USERIDENTIFIER = ${phoneNumber}`, (err, result) => {
    console.log(result);
    if (result.length > 0) {
      console.log('user already present in db');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user (USER_CODE,FNAME,LNAME,PHONE,EMAIL,GENDER,DOB,PAN,AADHAR,ADDRESS,CITY,STATE,PIN,STATUS,CREATED_BY,CREATED_TS,UPDATED_BY,UPDATED_TS,OLD_CLIENTID,OLD_USERIDENTIFIER) values('${user_id}','${firstName}','${lastName}','${phoneNumber}','${email}','${gender}','${dob}','${panNumber}','${aadharNumber}','${address1}','${city}','${value}','${pinCode}','Active','user','${formatDate(new Date())}','valyu app','${formatDate(new Date())}','${clientId}','${phoneNumber}')`, (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      }
      );
    }
  })
  return {result}
}
const inserDataIntoSqlOneUSer = async (userIdentifire) => {
  try {
    let phoneNumber , result;
      phoneNumber = userIdentifire
      let userData = await getUserInformation(phoneNumber)
      let { userProfile, personal, workProfile } = userData || {}
      if (!workProfile) {
        console.log('user WorkProfile not present', phoneNumber);
        return;
      }
      let { firstName, lastName, user_id, gender, email, dob, address1, city, pinCode, state } = userProfile || {}
      let { panNumber, aadharNumber } = personal || {}
      let { value } = state || {}
      let client = Object.keys(workProfile)[0] || []
      console.log(phoneNumber);
      let clientInfo = await getClientInformation(client, phoneNumber)
      let { clientId } = clientInfo
      if (workProfile) {
        result = inserUserData(phoneNumber, user_id, firstName, lastName, gender, email, dob, address1, city, pinCode, state, panNumber, aadharNumber, value, clientId);
      }
    console.log("done");
    return {result, error}
  } catch (error) {
    return error
  }
}
inserDataIntoSql()
module.exports = {inserDataIntoSql, inserDataIntoSqlOneUSer}
