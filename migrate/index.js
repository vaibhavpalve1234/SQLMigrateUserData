const { migrateCompanyMaster } = require("./ewa_company_master");
const { migrateComapnyRule } = require("./ewa_company_rule");
const { migrateUserLoanDeatils } = require("./ewa_loan_details");
const { migrateBankDetails } = require("./ewa_user_bank_account");
const { migrateUserCompanyDeatils } = require("./ewa_user_company");
const { migrateUserLine } = require("./ewa_user_line");
const { migrateUser } = require("./ewa_user");
const { migrateData } = require("./mainMigrateFile");


async function newFunction() {
  try {
    await migrateCompanyMaster();
    console.log("done migrateCompanyMaster -----------------------------------------------------------------");
    await migrateComapnyRule();
    console.log("done migrateComapnyRule -----------------------------------------------------------------");
    await migrateUserLoanDeatils();
    console.log("done migrateUserLoanDeatils -----------------------------------------------------------------");
    await migrateBankDetails();
    console.log("done migrateBankDetails -----------------------------------------------------------------");
    await migrateUserCompanyDeatils();
    console.log("done migrateUserCompanyDeatils -----------------------------------------------------------------");
    await migrateUserLine();
    console.log("done migrateUserLine -----------------------------------------------------------------");
    await migrateUser();
    console.log("done migrateUser -----------------------------------------------------------------");
  } catch (error) {
    console.log(error);
  }
}

migrateData()