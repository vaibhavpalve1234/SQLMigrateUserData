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
    let allUserInfo = await getAllUserInformation()
    let userIdentifire = Object.keys(allUserInfo)
    console.log(userIdentifire.length);
    await asyncForEach(userIdentifire,async(phoneNumber)=>{
      let userData = await getUserInformation(phoneNumber)
      let { userProfile, personal, workProfile, userProvidedData } = userData || {}
      if (!workProfile) {
        console.log('user WorkProfile not present', phoneNumber);
        return;
      }
      let { state } = userProfile || {}
      let { panNumber, aadharNumber } = personal || {}
      let { value } = state || {}
      let {time} = userProvidedData || {}
      let client = Object.keys(workProfile)[0] || []
      console.log(phoneNumber);
      let {arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit,doj,product_name, salary} = workProfile[client].userData
      let clientInfo = await getClientInformation(client, phoneNumber)
      let { clientId } = clientInfo
      if (workProfile) {
        let data  = inserUserLineData(clientId, arthmate_line_id,available_amount,salary,phoneNumber,arthmateUuid);
      }
    })
    console.log("done");
    return data;
  } catch (error) {
    return error
  }
}
const inserUserLineData = (clientId, arthmate_line_id,available_amount,salary,phoneNumber, arthmateUuid) => {
  connection.query(`select * from ewa_user_line where OLD_USERIDENTIFIER = ${phoneNumber}`, (err, result) => {
    console.log(result);
    if (result.length > 0) {
      console.log('user already present in db');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user_line (USER_COMPANY_ID,NBFC_USER_ID, NBFC_LINE_ID, ARTHUM_LINE_ID,LIMIT_AMOUNT,EARNED_AMOUNT,LINE_TENURE_MONTHS,STATUS,EXPIRY_DATE,CREATED_BY, CREATED_TS,UPDATED_BY,UPDATED_TS,OLD_USERIDENTIFIER) values('${clientId}','${arthmateUuid}','${arthmate_line_id}','','${available_amount}','${salary}',11,'Active','${formatDate(new Date())}','user','${formatDate(new Date())}','user','${formatDate(new Date())}','${phoneNumber}')`, (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      }
      );
    }
  })
}
inserDataIntoSql()
