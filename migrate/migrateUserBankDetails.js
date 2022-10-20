
const { asyncForEach } = require("../../functions/util/asyncForEach");


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
      let { bankAcNo, bankName, ifscCode } = account || {}
      if(!bankAcNo || !bankName || !ifscCode){
        return;
      }
      let { user_id, firstName, lastName } = userProfile
      let fullName = firstName + " " + lastName
      })
      
  } catch (error) {
    console.log(error);
  }
};


const insertBankDetails = (phoneNumber, user_id, firstName, lastName, gender, email, dob, address1, city, pinCode, state, panNumber, aadharNumber, value, clientId) => {
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
migrateBankDetails();