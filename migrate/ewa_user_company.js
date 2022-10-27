
// (USER_ID,
//     ARTHUM_USER_ID: user id,
//     NBFC_USER_ID: uuid,
//     COMPANY_ID:company id ,
//     HR_CODE:employee id,
//     EMPLOYMENT_TYPE: employee type,
//     SALARY:salary,
//     KYC_STATUS: is data submited,
//     STATUS:active,
//     CREATED_BY:today date,
//     CREATED_TS:user,
//     UPDATED_BY:created,
//     UPDATED_TS:user,
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
      let { state } = userProfile || {}
      let {} = personal || {}
      let client = Object.keys(workProfile)[0] || []
      console.log(phoneNumber);
      let {arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit,doj,product_name, salary, isKYCReportPDFGenerated} = workProfile[client].userData
      let {clientId, } = workProfile[client].companyDetails
      // let clientInfo = await getClientInformation(client, phoneNumber)
      // let { clientId } = clientInfo
      if (workProfile) {
        
      }
    })
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}