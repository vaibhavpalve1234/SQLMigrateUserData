const { asyncForEach } = require("../util/asyncForEach");
const { connection } = require("../connection/myslconnection");
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

migrateData = async () => {
  try {
    let allUserInfo = await getAllUserInformation()
    let userIdentifire = Object.keys(allUserInfo)
    await asyncForEach(userIdentifire, async (phoneNumber) => {
      let userData = await getUserInformation(phoneNumber)
      var { userProfile, personal, workProfile, Loan, userProvidedData, Transaction } = userData || {}
      if(!workProfile){
        return
      }
      if(!personal){
        return;
      }
      if(!workProfile){
        return;
      }
      if(!Loan){
        return;
      }
      if(!userProvidedData){
        return;
      }
      if(!Transaction){
        return;
      }
      // insert Loan Data
      console.log(phoneNumber);
      if (Loan) {
        var client = Object.keys(workProfile)[0] || []
        let clientInfo = await getClientInformation(client, phoneNumber)
        let { clientId } = clientInfo
        var { arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit, doj, product_name, salary, isKYCReportPDFGenerated } = workProfile[client].userData
        await asyncForEach(Object.keys(Loan), async (LoanId) => {
          let { arthmateLoanId, amount, SI, firstEmiDate, accountNumber, arthmateLoanSuccess, bankName, cgstOnProcessingAmount, cgstOnPlatform_fee, created_at, disbursementDate, disbursmentAmount, loanStatusChangeOn, discountedAmount, employerName, repaymentAmount, isCalculationCompleted, isDisbursmentCompleted, officialEmail, totalGstOnProcessingAmount, processingFees, userRebateFee, id } = Loan[LoanId]
          let data = rdbInstance.ref("ArthmateDisbursement/" + LoanId);
          data = await data.once("value");
          let { utr, status, date_and_time_stamp, remarks, disbursement_amount } = data.val() || {};
          // console.log(arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit,doj,product_name, salary, isKYCReportPDFGenerated,arthmateLoanId,  amount, SI, accountNumber, arthmateLoanSuccess, bankName, cgstOnProcessingAmount, cgstOnPlatform_fee,created_at, disbursementDate, disbursmentAmount, discountedAmount, employerName, repaymentAmount, isCalculationCompleted,isDisbursmentCompleted, officialEmail, totalGstOnProcessingAmount);
          processingFees = processingFees ? processingFees : 0.00
          totalGstOnProcessingAmount = totalGstOnProcessingAmount ? totalGstOnProcessingAmount : 0.00
          repaymentAmount = repaymentAmount ? repaymentAmount : 0.00
          userRebateFee = userRebateFee ? userRebateFee : 0.00
          status = status ? status : null
          utr = utr ? utr : null
          remarks = remarks ? remarks : new Date()
          clientId = clientId ? clientId : null
          arthmateUuid = arthmateUuid ? arthmateUuid : null
          amount = amount ? amount : 0.00
          arthmateLoanId = arthmateLoanId ? arthmateLoanId : null
          employerName = employerName ? employerName : null
          product_name = product_name ? product_name : null
          accountNumber = accountNumber ? accountNumber : null
          created_at = created_at ? created_at : new Date()
          loanStatusChangeOn = loanStatusChangeOn ? loanStatusChangeOn : new Date()
          id = id ? id : null
          await insertLoanDetails(clientId, arthmateUuid, arthmateLoanId, employerName, product_name, amount, processingFees, totalGstOnProcessingAmount, repaymentAmount, userRebateFee, accountNumber, status, utr, created_at, remarks, id, phoneNumber, loanStatusChangeOn)
          // console.log("-------------------------------------------------------   insertLoanDetails   ----------------------------------------------------------------");
        })
      }
      // insert Bank Deatil 
      if (workProfile) {
        let employerName = Object.keys(workProfile)[0]
        let { account } = workProfile[employerName]
        let client = Object.keys(workProfile)[0] || []
        let clientInfo = await getClientInformation(client, phoneNumber)
        let { clientId } = clientInfo
        let { bankAcNo, bankName, ifscCode } = account || {}
        if (!bankAcNo || !bankName || !ifscCode) {
          return;
        }
        let { user_id, firstName, lastName } = userProfile
        let fullName = firstName + " " + lastName
        await insertBankDetails(clientId, bankName, fullName, bankAcNo, ifscCode, phoneNumber);
        // console.log("-------------------------------------------------------   insertBankDetails   ----------------------------------------------------------------");
      }
      //insert user company data and user line 
      if (userProvidedData) {
        let { state, user_id } = userProfile || {}
        let { isDataSubmissionComplete } = personal || {}
        let client = Object.keys(workProfile)[0] || []
        let { arthmateDocumentId, arthmate_line_id, arthmateUuid, available_amount, creditLineId, creditLimit, doj, product_name, salary, isKYCReportPDFGenerated, employeeId, employeeType } = workProfile[client].userData
        let { clientId, } = workProfile[client].companyDetails
        if (workProfile) {
          phoneNumber = phoneNumber ? phoneNumber : null
          user_id = user_id ? user_id : null
          arthmateUuid = arthmateUuid ? arthmateUuid : null
          clientId = clientId ? clientId : null
          employeeId = employeeId ? employeeId : null
          employeeType = employeeType ? employeeType : null
          salary = salary ? salary : 0.00
          isKYCReportPDFGenerated = isKYCReportPDFGenerated ? isKYCReportPDFGenerated : false
          clientId = clientId ? clientId : null
          arthmate_line_id = arthmate_line_id ? arthmate_line_id : null
          available_amount = available_amount ? available_amount : 0.00
          salary = salary ? salary : 0.00
          arthmateUuid = arthmateUuid ? arthmateUuid : null
          await  inserUserComapnyData(phoneNumber, user_id, arthmateUuid, clientId, employeeId, employeeType, salary, isKYCReportPDFGenerated)
          // console.log("-------------------------------------------------------   inserUserComapnyData   ----------------------------------------------------------------");
          await  inserUserLineData(clientId, arthmate_line_id, available_amount, salary, phoneNumber, arthmateUuid);
          // console.log("-------------------------------------------------------   inserUserLineData   ----------------------------------------------------------------");
        }
      }
      // insert user data 
      if(workProfile){
        let { firstName, lastName, user_id, gender, email, dob, address1, city, pinCode, state } = userProfile || {}
        let { panNumber, aadharNumber } = personal || {}
        let { value } = state || {}
        let { time } = userProvidedData || {}
        let client = Object.keys(workProfile)[0] || []
        let clientInfo = await getClientInformation(client, phoneNumber)
        let { clientId } = clientInfo
        if (workProfile) {
          user_id = user_id ? user_id : null
          firstName = firstName ? firstName : null
          lastName = lastName ? lastName : null
          gender = gender ? gender : null
          email = email ? email : null
          dob = dob ? dob : null
          address1 = address1 ? address1 : null
          city = city ? city : null
          pinCode = pinCode ? pinCode : null
          panNumber = panNumber ? panNumber : null
          state = state ? state : null
          aadharNumber = aadharNumber ? aadharNumber : null
          value = value ? value : null
          clientId = clientId ? clientId : null
          time = time ? time : new Date()
          result = await  inserUserData(phoneNumber, user_id, firstName, lastName, gender, email, dob, address1, city, pinCode, state, panNumber, aadharNumber, value, clientId, time);
          // console.log("-------------------------------------------------------   inserUserData   ----------------------------------------------------------------");
        }
      }
      console.log(phoneNumber,"done user all data uploated.");
    })
  } catch (error) {
    console.log(error);
  }
}

const insertLoanDetails = async(clientId,arthmateUuid,arthmateLoanId,employerName,product_name,amount,processingFees,totalGstOnProcessingAmount,repaymentAmount,userRebateFee,accountNumber,status,utr,remarks,created_at,id,userIdentifier, loanStatusChangeOn) => {
  let result = connection.query(`select * from ewa_loan_details where OLD_LOANIDENTIFIER ='${id}';`, (err, result) => {
    if (result.length > 0) {
      console.log('user already present in db insertLoanDetails');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_loan_details(USER_COMPANY_ID, ARTHUM_USER_ID,NBFC_USER_ID, ARTHUM_LOAN_ID, NBFC_LOAN_ID, COMPANY_NAME,PRODUCT_TYPE,LOAN_AMOUNT,TRANSACTION_FEE,SUBSCRIPTION_FEE,PROCESSING_FEE, PLATFORM_FEE,OTHER_FEE, GST, DISBURSEMENT_AMOUNT,INTEREST_AMOUNT, REPAYMENT_AMOUNT, REPAYMENT_DUE_DATE,ACCOUNT_ID,STATUS,DISBURSE_UTR,RECOVER_AMOUNT,RECOVER_DATE,RECOVER_UTR, CREATED_TS,CREATED_BY,COMMENTS,UPDATED_BY,UPDATED_TS,OLD_USERIDENTIFIER,OLD_LOANIDENTIFIER) values('${clientId}','','${arthmateUuid}','','${arthmateLoanId}','${employerName}','${product_name}','${amount}','${amount}','${amount}','${processingFees}','${amount}','${amount}','${totalGstOnProcessingAmount}','${repaymentAmount}','${userRebateFee}','${repaymentAmount}','','123456','${status}','${utr}','${repaymentAmount}','${formatDate(new Date())}','${utr}','${remarks}','user','${created_at}','user','${loanStatusChangeOn}','${userIdentifier}','${id}')`, (err, res) => {
        if (err) throw err;
        console.log(' insertLoanDetails Last insert ID:', res.insertId);
      }
      );
    }
  })
  return {result}
}

const insertBankDetails = async(clientId,bankName,fullName,bankAcNo,ifscCode,userIdentifier) => {
  let result = connection.query(`select * from ewa_user_bank_account where OLD_USERIDENTIFIER = ${userIdentifier}`, (err, result) => {

    if (result.length > 0) {
      console.log('user already present in db insertBankDetails');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user_bank_account(USER_COMPANY_ID, BANK_NAME, ACCOUNT_NAME, ACCOUNT_NUMBER, IFSC, STATUS, ISVERIFIED, VERIFIED_DATE, CREATED_BY, CREATED_TS , UPDATED_BY, UPDATED_TS, OLD_USERIDENTIFIER)values('${clientId}','${bankName}','${fullName}','${bankAcNo}','${ifscCode}','Active','true','${formatDate(new Date())}','user', '${formatDate(new Date())}','user','${formatDate(new Date())}','${userIdentifier}')`, (err, res) => {
        if (err) throw err;
        console.log('insertBankDetails Last insert ID:', res.insertId);
      }
      );
    }
  })
  return {result}
}

const inserUserComapnyData = (phoneNumber, user_id, arthmateUuid, clientId, employeeId, employeeType, salary, isKYCReportPDFGenerated) => {
  let result = connection.query(`select * from ewa_user_company where OLD_USERIDENTIFIER = ${phoneNumber}`, (err, result) => {
    if (result.length > 0) {
      console.log('user already present in db inserUserComapnyData');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user_company (USER_ID,ARTHUM_USER_ID,NBFC_USER_ID,COMPANY_ID,HR_CODE,EMPLOYMENT_TYPE,SALARY,KYC_STATUS,STATUS,CREATED_BY,CREATED_TS,UPDATED_BY,UPDATED_TS,OLD_CLIENTID,OLD_USERIDENTIFIER) values('${user_id}','','${arthmateUuid}','${clientId}','','${employeeType}','${salary}','${isKYCReportPDFGenerated}','Active','user','${formatDate(new Date())}','user','${formatDate(new Date())}','${clientId}','${phoneNumber}')`, (err, res) => {
        if (err) throw err;
        console.log('inserUserComapnyData Last insert ID:', res.insertId);
      }
      );
    }
  })
  return { result }
}

const inserUserLineData = (clientId, arthmate_line_id,available_amount,salary,phoneNumber, arthmateUuid) => {
  connection.query(`select * from ewa_user_line where OLD_USERIDENTIFIER = ${phoneNumber}`, (err, result) => {
    if (result.length > 0) {
      console.log('user already present in db inserUserLineData');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user_line (USER_COMPANY_ID,NBFC_USER_ID, NBFC_LINE_ID, ARTHUM_LINE_ID,LIMIT_AMOUNT,EARNED_AMOUNT,LINE_TENURE_MONTHS,STATUS,EXPIRY_DATE,CREATED_BY, CREATED_TS,UPDATED_BY,UPDATED_TS,OLD_USERIDENTIFIER) values('${clientId}','${arthmateUuid}','${arthmate_line_id}','','${available_amount}','${salary}',11,'Active','${formatDate(new Date())}','user','${formatDate(new Date())}','user','${formatDate(new Date())}','${phoneNumber}')`, (err, res) => {
        if (err) throw err;
        console.log('inserUserLineData Last insert ID:', res.insertId);
      }
      );
    }
  })
}

const inserUserData = (phoneNumber, user_id, firstName, lastName, gender, email, dob, address1, city, pinCode, state, panNumber, aadharNumber, value, clientId, time) => {
  let result = connection.query(`select * from ewa_user where OLD_USERIDENTIFIER = ${phoneNumber}`, (err, result) => {
    if (result.length > 0) {
      console.log('user already present in db inserUserData');
      return result
    }
    else {
      console.log("insert");
      connection.query(`INSERT INTO ewa_user (USER_CODE,FNAME,LNAME,PHONE,EMAIL,GENDER,DOB,PAN,AADHAR,ADDRESS,CITY,STATE,PIN,STATUS,CREATED_BY,CREATED_TS,UPDATED_BY,UPDATED_TS,OLD_CLIENTID,OLD_USERIDENTIFIER) values('${user_id}','${firstName}','${lastName}','${phoneNumber}','${email}','${gender}','${dob}','${panNumber}','${aadharNumber}','${address1}','${city}','${value}','${pinCode}','Active','user','${time}','valyu app','${time}','${clientId}','${phoneNumber}')`, (err, res) => {
        if (err) throw err;
        console.log('inserUserData Last insert ID:', res.insertId);
      }
      );
    }
  })
  return { result }
}

module.exports = {migrateData}