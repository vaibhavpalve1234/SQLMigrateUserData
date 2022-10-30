
// (USER_ID,
//     ARTHUM_USER_ID: user id,
//     NBFC_USER_ID: uuid,
//     COMPANY_ID:company id ,
//     HR_CODE:"none",
//     EMPLOYMENT_TYPE: employee type,
//     SALARY:salary,
//     KYC_STATUS: is data submited,
//     STATUS:active,
//     CREATED_BY:user,
//     CREATED_TS:today new,
//     UPDATED_BY:user,
//     UPDATED_TS:today new,
//     OLD_CLIENTID:company id,
//     OLD_USERIDENTIFIER:-phone number)
const { connection } = require("../connection/myslconnection");
const { asyncForEach } = require("../util/asyncForEach");
const { getAllUserInformation, getClientInformation, getUserInformation } = require("../util/fetchData");

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
const migrateUserCompanyDeatils = async() =>{

  try {
    let allUserInfo = await getAllUserInformation()
    let userIdentifire = Object.keys(allUserInfo)
    console.log(userIdentifire.length);
    await asyncForEach(userIdentifire,async(phoneNumber)=>{
      let userData = await getUserInformation(phoneNumber)
      let { userProfile, personal, workProfile, Loan, userProvidedData, Transaction } = userData || {}
      if (!workProfile) {
        console.log('user WorkProfile not present', phoneNumber);
        return;
      }
      if(!Loan){
        return;
      }
      let { state, user_id } = userProfile || {}
      let {isDataSubmissionComplete } = personal || {}
      let client = Object.keys(workProfile)[0] || []
      console.log(phoneNumber);
      let {arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit,doj,product_name, salary, isKYCReportPDFGenerated, employeeId, employeeType} = workProfile[client].userData
      let {clientId, } = workProfile[client].companyDetails
      if (workProfile) {
        phoneNumber=phoneNumber?phoneNumber:null
        user_id=user_id?user_id:null
        arthmateUuid=arthmateUuid?arthmateUuid:null
        clientId=clientId?clientId:null
        employeeId=employeeId?employeeId:null
        employeeType=employeeType?employeeType:null
        salary=salary?salary:0.00
        isKYCReportPDFGenerated=isKYCReportPDFGenerated?isKYCReportPDFGenerated:false
        inserUserData(phoneNumber, user_id, arthmateUuid, clientId, employeeId, employeeType, salary, isKYCReportPDFGenerated)
      }
    })
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}

const inserUserData = (phoneNumber, user_id, arthmateUuid, clientId, employeeId, employeeType, salary, isKYCReportPDFGenerated) => {
  let result = connection.query(`select * from ewa_user_company where OLD_USERIDENTIFIER = ${phoneNumber}`, (err, result) => {
    if (result.length > 0) {
      console.log('user already present in db');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user_company (USER_ID,ARTHUM_USER_ID,NBFC_USER_ID,COMPANY_ID,HR_CODE,EMPLOYMENT_TYPE,SALARY,KYC_STATUS,STATUS,CREATED_BY,CREATED_TS,UPDATED_BY,UPDATED_TS,OLD_CLIENTID,OLD_USERIDENTIFIER) values('${user_id}','','${arthmateUuid}','${clientId}','','${employeeType}','${salary}','${isKYCReportPDFGenerated}','Active','user','${formatDate(new Date())}','user','${formatDate(new Date())}','${clientId}','${phoneNumber}')`, (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      }
      );
    }
  })
  return { result }
}
// migrateUserCompanyDeatils()
module.exports = {migrateUserCompanyDeatils}