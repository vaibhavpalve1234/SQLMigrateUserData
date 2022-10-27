
// (COMPANY_ID,
//     MODE_ID,
//     LIMIT_PERCENTAGE,
//     LIMIT_MIN,
//     LIMIT_MAX,
//     BLACKOUT_START_DATE,
//     BLACKOUT_END_DATE,
//     RECOVERY_DATE,
//     STATUS,
//     CREATED_BY,
//     CREATED_TS,
//     UPDATED_BY,
//     UPDATED_TS,
//     OLD_CLIENTID)

const { connection } = require("../connection/myslconnection");
const { rdbInstance } = require("../firebase/uat-firebase-connection");
const { asyncForEach } = require("../util/asyncForEach");
const {  getAllClientsConfigInformation, getClientInformation } = require("../util/fetchData");

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
const migrateClientConfigInfoDeatils = async() =>{
  try {
      let clientConfigInfo = await getAllClientsConfigInformation()
    await asyncForEach(Object.keys(clientConfigInfo), async(client) =>{
      let {ContractId, blackoutEndDay, blackoutStartDay,cutOffDay, cutOffDayMonth, payDay, payDayMonth, payrollDaysCount, payrollStartDay, settlementDay, settlementDayMonth} = clientConfigInfo[client]
      // console.log(ContractId, blackoutEndDay, blackoutStartDay,cutOffDay, cutOffDayMonth, payDay, payDayMonth, payrollDaysCount, payrollStartDay, settlementDay, settlementDayMonth);
      let configData = rdbInstance.ref('Client/' + client);
      configData = await configData.once('value');
      configData = configData.val() || {};
      let product = configData.defaultProductName;
      let productInArthmate = configData[product] || {};
      let {rules, payDate, maximum_loan_amount, cgst, cutoffDate, min_loan_amount, payrollEndDate, payrollStartDate, settlementDate, sgst } = productInArthmate
      
    })
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}

migrateClientConfigInfoDeatils()