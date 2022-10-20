const {rdbInstance, rdbFireStoreInstance} = require('../firebase/uat_connection')
const merge = require('lodash.merge');

const saveUserToFirestore = async (collectionName, key, data) => {
  await rdbFireStoreInstance
    .collection(collectionName)
    .doc(key + '')
    .set(data);
};

const insertIntoFirestoreCollection = async (collectionName, key, data) => {
  await rdbFireStoreInstance
    .collection(collectionName)
    .doc(key + '')
    .set(data);
};

const updateUserInfoInDB = async (userData, ref) => {
  await rdbInstance.ref(ref).update(userData);
};
const getUserInformation = async (userIdentifier) => {
  let userData = rdbInstance.ref('users/' + userIdentifier);
  userData = await userData.once('value');
  userData = userData.val();
  return userData;
};

const getUserWorkProfileInformation = async (userIdentifier, client) => {
  let userData = rdbInstance.ref(
    `users/${userIdentifier}/workProfile/${client}`
  );
  userData = await userData.once('value');
  userData = userData.val();
  return userData;
};

const getAllLoanDataOfUser = async (userIdentifier) => {
  let userData = rdbInstance.ref('users/' + userIdentifier + '/Loan');
  userData = await userData.once('value');
  userData = userData.val();
  return userData;
};
const getAllUserInformation = async () => {
  let userData = rdbInstance.ref('users');
  userData = await userData.once('value');
  userData = userData.val();
  return userData;
};

const getStatusConstantInformation = async (status) => {
  let statusData = rdbInstance.ref('Constant/loan_ID/' + status + '/');
  statusData = await statusData.once('value');
  statusData = statusData.val();

  return statusData;
};

const getRolesInformation = async (roleType) => {
  let rolesData = rdbInstance.ref(`Roles/${roleType}`);
  rolesData = await rolesData.once('value');
  rolesData = rolesData.val();
  return rolesData;
};

const getLoanInformation = async (loanId) => {
  const userIdentifier = loanId.split(/[_ ]+/).pop();
  let loanData = rdbInstance.ref(`users/${userIdentifier}/Loan/${loanId}`);
  loanData = await loanData.once('value');
  loanData = loanData.val();
  return { loanData, userIdentifier };
};

const getDisbursedLoanInformation = async (userIdentifier) => {
  let loanData = rdbInstance.ref(`users/${userIdentifier}/Loan`);
  loanData = await loanData.orderByChild('status').equalTo(50).once('value');
  loanData = loanData.val();
  return loanData;
};
const getDisbursedConfirmedLoanInformation = async (userIdentifier) => {
  let loanData = rdbInstance.ref(`users/${userIdentifier}/Loan`);
  loanData = await loanData.orderByChild('status').equalTo(51).once('value');
  loanData = loanData.val();
  return loanData;
};
const getApprovedLoanInformation = async (userIdentifier) => {
  let loanData = rdbInstance.ref(`users/${userIdentifier}/Loan`);
  loanData = await loanData.orderByChild('status').equalTo(30).once('value');
  loanData = loanData.val();
  return loanData;
};

const getLoanInformationFromLoanHistory = async (loanId) => {
  let loanData = rdbInstance.ref(`LoanHistory/${loanId}`);
  loanData = await loanData.once('value');
  loanData = loanData.val();
  return loanData;
};

const getAllTransactions = async (userIdentifier) => {
  let transactionData = rdbInstance.ref(`users/${userIdentifier}/Transaction`);
  transactionData = await transactionData.once('value');
  transactionData = transactionData.val();
  return transactionData;
};

const getAllTransactionOnPurpose = async (userIdentifier, purpose) => {
  let transactionData = rdbInstance.ref(`users/${userIdentifier}/Transaction`);
  transactionData = await transactionData
    .orderByChild('purpose')
    .equalTo(purpose)
    .once('value');
  transactionData = transactionData.val();
  return transactionData;
};

const deleteRetryLoanID = async (loanId) => {
  let retryData = rdbInstance.ref(`retryLoans/${loanId}`);
  await retryData.remove();
  return true;
};

const getErrorInformation = async (loanId) => {
  let errorData = rdbInstance.ref(`Errors/${loanId}`);
  errorData = await errorData.once('value');
  errorData = errorData.val();
  return errorData;
};

const getClientInformation = async (employerName, userIdentifier) => {
  let workProfile,
    employerData,
    companyDetails = {};
  if (userIdentifier) {
    let workProfile = rdbInstance.ref(`users/${userIdentifier}/workProfile`);
    workProfile = await workProfile.once('value');
    workProfile = workProfile.val();
    if (!workProfile) {
      companyDetails = {};
    } else {
      ({ companyDetails } = workProfile[Object.keys(workProfile)[0]]);
    }
  }
  employerData = rdbInstance.ref('Client/' + employerName);
  employerData = await employerData.once('value');
  employerData = employerData.val();
  return merge({}, { ...employerData }, { ...companyDetails });
};

const getWorkProfile = async (userIdentifier) => {
  let employerName;
  let workProfile = rdbInstance.ref(`users/${userIdentifier}/workProfile`);
  workProfile = await workProfile.once('value');
  workProfile = workProfile.val();
  if (!workProfile) {
    return employerName;
  }
  employerName = Object.keys(workProfile)[0];
  return employerName;
};

const getClientConfigInformation = async (configName) => {
  let configData = rdbInstance.ref('ClientConfig/' + configName);
  configData = await configData.once('value');
  configData = configData.val();
  return configData;
};

const getAllClientsInformation = async () => {
  let clientData = rdbInstance.ref('Client/');
  clientData = await clientData.once('value');
  clientData = clientData.val();
  return clientData;
};
const getAllClientsConfigInformation = async () => {
  let clientData = rdbInstance.ref('ClientConfig');
  clientData = await clientData.once('value');
  clientData = clientData.val();
  return clientData;
};

const getUIConstantInformation = async () => {
  let data = rdbInstance.ref('Constant/UI');
  data = await data.once('value');
  data = data.val();
  return data;
};

const getConstantInformation = async () => {
  let data = rdbInstance.ref('Constant');
  data = await data.once('value');
  data = data.val();
  return data;
};

const getQueryInformation = async (userIdentifier) => {
  let queryData = rdbInstance.ref('Query/' + userIdentifier);
  queryData = await queryData.once('value');
  queryData = queryData.val();
  return queryData;
};

const updateAttendanceToDb = async (attendanceData, userIdentifier, client) => {
  if (attendanceData != undefined) {
    //attendanceData
    await rdbInstance
      .ref(`users/${userIdentifier}/workProfile/${client}/userData`)
      .child('attendance')
      .update({ ...attendanceData });
  }
  return true;
};
const insertIntoDatabase = async (ref, child, data) => {
  if (child) {
    return await rdbInstance.ref(ref).child(child).set(data);
  }
  return await rdbInstance.ref(ref).set(data);
};
const insertIntoDB = async (ref, child, data) => {
  await rdbInstance.ref(ref).update(data);
};
const updateIntoDatabase = async (ref, child, data) => {
  await rdbInstance.ref(ref).child(child).update(data);
};

const updateWhatsappResult = async (uniqueIdentifier, timestamp, result) => {
  await rdbInstance
    .ref(`Notification/${uniqueIdentifier}/whatsapp`)
    .child(`${timestamp}`)
    .child('results')
    .update(result);
};

const updateWhatsappNotification = async (
  uniqueIdentifier,
  timestamp,
  templateInfo
) => {
  await rdbInstance
    .ref(`Notification/${uniqueIdentifier}/whatsapp`)
    .child(`${timestamp}`)
    .update(templateInfo);
};

const getAllTransactionOnType = async (userIdentifier, type) => {
  let transactionData = rdbInstance.ref(`users/${userIdentifier}/Transaction`);
  transactionData = await transactionData
    .orderByChild('type')
    .equalTo(type)
    .once('value');
  transactionData = transactionData.val();
  return transactionData;
};
const getAllTransactionByLoanId = async (userIdentifier, loanId) => {
  let transactionData = rdbInstance.ref(`users/${userIdentifier}/Transaction`);
  transactionData = await transactionData
    .orderByChild('loanId')
    .equalTo(loanId)
    .once('value');
  transactionData = transactionData.val();
  return transactionData;
};

const getAgentInfo = async (agentId) => {
  let data = rdbInstance.ref(`Constant/RokadAgentMapping/${agentId}`);
  data = await data.once('value');
  data = data.val();
  return data;
};

const getTemplateStatusMapping = async (status) => {
  let data = rdbInstance.ref(`Constant/WatiTemplateStatusMapping`);
  data = await data.once('value');
  data = data.val();
  return data;
};

const updatePromo = async (uniqueIdentifier, promo) => {
  await rdbInstance
    .ref(`users/${uniqueIdentifier}/personal`)
    .child(`promo`)
    .set(promo);
};

const getPromoCodeDetails = async (promoCode) => {
  let data = rdbInstance.ref(`Constant/promoCodes/${promoCode}`);
  data = await data.once('value');
  data = data.val();
  return data;
};
const updatePromoCodeApplicants = async (
  promoCode,
  applicantData,
  uniqueIdentifier
) => {
  rdbInstance
    .ref(`Constant/promoCodes/${promoCode}/usersApplied/${uniqueIdentifier}`)
    .update(applicantData);
};
const getAvailablePromos = async (uniqueIdentifier) => {
  let data = rdbInstance.ref(`users/${uniqueIdentifier}/availablePromos`);
  data = await data.once('value');
  data = data.val();
  return data;
};

const getDefaultReferralPromoConfig = async () => {
  let data = rdbInstance.ref(`Constant/defaultPromoCode`);
  data = await data.once('value');
  data = data.val();
  return data;
};
const createReferralPromo = async (newPromoCode, promoConfig) => {
  await rdbInstance
    .ref(`Constant/promoCodes`)
    .update({ [newPromoCode]: promoConfig });
};

const updateUserAppliedPromo = async (uniqueIdentifier, promoCode) => {
  let exisitingPromos = (await getAvailablePromos(uniqueIdentifier)) || [];
  exisitingPromos.push(promoCode);
  await rdbInstance
    .ref(`users/${uniqueIdentifier}`)
    .child(`availablePromos`)
    .set(exisitingPromos);
};

const updateExistingPromo = async (promoCode, promoConfig) => {
  await rdbInstance.ref(`Constant/promoCodes/${promoCode}`).update(promoConfig);
};

const getClient = async (clientName) => {
  let data = rdbInstance.ref(`Client/${clientName}`);
  data = await data.once('value');
  data = data.val();
  return data;
};
const updateUser = async (userIdentifier, userData) => {
  await rdbInstance.ref(`users/${userIdentifier}`).update(userData);
};

module.exports = {
  getAllTransactions,
  insertIntoDB,
  getAgentInfo,
  getUserInformation,
  getAllUserInformation,
  getAllClientsInformation,
  getAllClientsConfigInformation,
  getClientInformation,
  getLoanInformation,
  getQueryInformation,
  getStatusConstantInformation,
  getUIConstantInformation,
  getErrorInformation,
  deleteRetryLoanID,
  updateAttendanceToDb,
  updateUserInfoInDB,
  saveUserToFirestore,
  getDisbursedLoanInformation,
  getWorkProfile,
  getAllTransactionOnPurpose,
  insertIntoDatabase,
  getRolesInformation,
  updateIntoDatabase,
  getConstantInformation,
  getClientConfigInformation,
  getUserWorkProfileInformation,
  getAllLoanDataOfUser,
  updateWhatsappResult,
  updateWhatsappNotification,
  getAllTransactionOnType,
  getAllTransactionByLoanId,
  getTemplateStatusMapping,
  updatePromo,
  getDefaultReferralPromoConfig,
  getPromoCodeDetails,
  updatePromoCodeApplicants,
  getAvailablePromos,
  getLoanInformationFromLoanHistory,
  createReferralPromo,
  updateUserAppliedPromo,
  updateExistingPromo,
  getClient,
  updateUser,
  getDisbursedConfirmedLoanInformation,
  getApprovedLoanInformation,
  insertIntoFirestoreCollection
};
