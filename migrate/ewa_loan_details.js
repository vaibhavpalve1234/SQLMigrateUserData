// (USER_COMPANY_ID --------> clientId, 
//     ARTHUM_USER_ID-------> none,
//     NBFC_USER_ID --------> arthmateUuid, 
//     ARTHUM_LOAN_ID ------> none, 
//     NBFC_LOAN_ID --------> arthmateLoanId, 
//     COMPANY_NAME --------> employerName,
//     PRODUCT_TYPE --------> product_name,
//     LOAN_AMOUNT ---------> amount,
//     TRANSACTION_FEE -----> none,
//     SUBSCRIPTION_FEE ----> none,
//     PROCESSING_FEE ------> processingFees, 
//     PLATFORM_FEE --------> none,
//     OTHER_FEE -----------> none, 
//     GST -----------------> totalGstOnProcessingAmount, 
//     DISBURSEMENT_AMOUNT -> repaymentAmount,
//     INTEREST_AMOUNT -----> userRebateFee, 
//     REPAYMENT_AMOUNT ----> repaymentAmount, 
//     REPAYMENT_DUE_DATE --> none,
//     ACCOUNT_ID ----------> bankName,
//     STATUS --------------> status,
//     DISBURSE_UTR --------> UTR,
//     RECOVER_AMOUNT ------> repaymentAmount,
//     RECOVER_DATE --------> new Date()
//     RECOVER_UTR ---------> UTR, 
//     COMMENTS ------------> remark, 
//     CREATED_BY ----------> user,
//     CREATED_TS ----------> new date(),
//     UPDATED_BY ----------> user,
//     UPDATED_TS ----------> new date(),
//     OLD_USERIDENTIFIER --> phoneMumber,
//     OLD_LOANIDENTIFIER --> id)
const { connection } = require("../connection/myslconnection");
const { asyncForEach } = require("../util/asyncForEach");
const {rdbInstance} = require('../firebase/prod-firebase-connection')
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
const migrateUserLoanDeatils = async() =>{
  try {
    let allUserInfo = await getAllUserInformation()
    let userIdentifire = Object.keys(allUserInfo)
    console.log(userIdentifire.length);
    await asyncForEach(userIdentifire,async(phoneNumber)=>{
      let userData = await getUserInformation(phoneNumber)
      var { userProfile, personal, workProfile, Loan, userProvidedData, Transaction } = userData || {}
      if (!workProfile) {
        console.log('user WorkProfile not present', phoneNumber);
        return;
      }
      if(!Loan){
        return;
      }      
      var client = Object.keys(workProfile)[0] || []
      console.log(phoneNumber);
      let clientInfo = await getClientInformation(client, phoneNumber)
      let { clientId } = clientInfo
      var {arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit,doj,product_name, salary, isKYCReportPDFGenerated} = workProfile[client].userData
      await asyncForEach(Object.keys(Loan), async(LoanId)=>{
        let {arthmateLoanId, amount, SI, firstEmiDate,accountNumber, arthmateLoanSuccess, bankName, cgstOnProcessingAmount, cgstOnPlatform_fee,created_at, disbursementDate, disbursmentAmount, loanStatusChangeOn,discountedAmount, employerName, repaymentAmount, isCalculationCompleted,isDisbursmentCompleted, officialEmail, totalGstOnProcessingAmount, processingFees, userRebateFee, id} = Loan[LoanId]
        let data = rdbInstance.ref("ArthmateDisbursement/" + LoanId);
        data = await data.once("value");
        let { utr, status, date_and_time_stamp, remarks, disbursement_amount } = data.val() || {};
        // console.log(arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit,doj,product_name, salary, isKYCReportPDFGenerated,arthmateLoanId,  amount, SI, accountNumber, arthmateLoanSuccess, bankName, cgstOnProcessingAmount, cgstOnPlatform_fee,created_at, disbursementDate, disbursmentAmount, discountedAmount, employerName, repaymentAmount, isCalculationCompleted,isDisbursmentCompleted, officialEmail, totalGstOnProcessingAmount);
        processingFees = processingFees?processingFees:0.00
        totalGstOnProcessingAmount= totalGstOnProcessingAmount?totalGstOnProcessingAmount:0.00
        repaymentAmount = repaymentAmount?repaymentAmount:0.00
        userRebateFee = userRebateFee?userRebateFee:0.00
        status = status?status:null
        utr= utr?utr:null
        remarks=remarks?remarks: new Date()
        clientId=clientId?clientId:null
        arthmateUuid=arthmateUuid?arthmateUuid:null
        amount=amount?amount:0.00
        arthmateLoanId=arthmateLoanId?arthmateLoanId:null
        employerName=employerName?employerName:null
        product_name=product_name?product_name:null
        accountNumber=accountNumber?accountNumber:null
        created_at=created_at?created_at:new Date()
        loanStatusChangeOn=loanStatusChangeOn?loanStatusChangeOn:new Date()
        id=id?id:null
        insertLoanDetails(clientId,arthmateUuid, arthmateLoanId, employerName, product_name, amount, processingFees, totalGstOnProcessingAmount, repaymentAmount, userRebateFee, accountNumber, status, utr, created_at, remarks,id, phoneNumber, loanStatusChangeOn)
      })
    })
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}

const insertLoanDetails = async(clientId,arthmateUuid,arthmateLoanId,employerName,product_name,amount,processingFees,totalGstOnProcessingAmount,repaymentAmount,userRebateFee,accountNumber,status,utr,remarks,created_at,id,userIdentifier, loanStatusChangeOn) => {
  let result = connection.query(`select * from ewa_loan_details where OLD_LOANIDENTIFIER ='${id}';`, (err, result) => {
    if (result.length > 0) {
      console.log('user already present in db');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_loan_details(USER_COMPANY_ID, ARTHUM_USER_ID,NBFC_USER_ID, ARTHUM_LOAN_ID, NBFC_LOAN_ID, COMPANY_NAME,PRODUCT_TYPE,LOAN_AMOUNT,TRANSACTION_FEE,SUBSCRIPTION_FEE,PROCESSING_FEE, PLATFORM_FEE,OTHER_FEE, GST, DISBURSEMENT_AMOUNT,INTEREST_AMOUNT, REPAYMENT_AMOUNT, REPAYMENT_DUE_DATE,ACCOUNT_ID,STATUS,DISBURSE_UTR,RECOVER_AMOUNT,RECOVER_DATE,RECOVER_UTR, CREATED_TS,CREATED_BY,COMMENTS,UPDATED_BY,UPDATED_TS,OLD_USERIDENTIFIER,OLD_LOANIDENTIFIER) values('${clientId}','','${arthmateUuid}','','${arthmateLoanId}','${employerName}','${product_name}','${amount}','${amount}','${amount}','${processingFees}','${amount}','${amount}','${totalGstOnProcessingAmount}','${repaymentAmount}','${userRebateFee}','${repaymentAmount}','','123456','${status}','${utr}','${repaymentAmount}','${formatDate(new Date())}','${utr}','${remarks}','user','${created_at}','user','${loanStatusChangeOn}','${userIdentifier}','${id}')`, (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      }
      );
    }
  })
  return {result}
}
// migrateUserLoanDeatils()
module.exports = {migrateUserLoanDeatils}