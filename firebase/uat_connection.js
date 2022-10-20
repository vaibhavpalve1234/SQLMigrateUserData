const admin = require('firebase-admin');
require('dotenv').config()

let serviceAccount = {
  type: process.env.UATTYPE,
  project_id: process.env.UATPROJECT_ID,
  private_key_id:process.env.UATPROJECT_KEY,
  // private_key:process.env.UATPRIVATE_KEY,
  private_key:  '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCBciGULz00kdsF\nMzssqevf1j02v6oCUPyIIc6tp073Wcp2136IBbrcSXWPJ2LspDxpFrSOeLD9WWaE\nCoiDO1HJryZYwm1o0/Qb4oGSciOk6yxDPCcJrQqX8VXTXakdj4GCvuNTwLxNUxF0\nTFXEKd2XcyQ+1Je7GFlF2XOj5YcrmkxvzwPHmyzz/Ts8azdaImYtuL3fw2zUcLFz\ns69BlDnMbXXk17LZ/JdnzCMuEaxC5FDgNdPCtwKFnm0KNwl55h0GYsr9Dwe3Nk2s\nz7TDGKeC+ITnP8hUp0kgt67JBiHOGn7nG3KZ862LdQidg4JyJ6Y7n/SQM3GdqDsl\nO+ziQnf1AgMBAAECggEAPJG0X5u5BmOnOagurKf3vD2JWBhXywytFV/ITx4lx3ym\nzXPo+2m+9TuUO/9AfR0ePUgIBVA49NsDqo4pMUqs6vO/PDIBstbWdsPGQEmTHySB\nihZX5+GlvtIIiEXfj3rqLUz3nuVk1sOjO6lKSmcSjj6su4+LTdrHTvVAdHS+impW\ntLEaGNfWdrgYM21bIkt3+mEN0kcW548TVkqAEnn8axAC8teS2bJN+88MJd9ENnVb\n7SoSKv3uRcmM4PUcL/olx9NXTt+ouzxgaHxXzl6T+9MvhNGdFdBe/n09ie3DCHF9\nIi4vL30+vobriRYapv9hasnNont5tYG1GwYE/+uc8wKBgQC2tv52ch81LParg9MB\nVPX5HHMLo/qxhcf6l+0x7pgI6JfX1Y6Xi5eGEJyLSGJJnRLpMwxkJvYsD/9mCVpW\nqqCftR3yK2qAonqmiqhrVpHZyxFohSLknbkJJXeFXuisZWoNY9U0PWR1y63O6YEE\nSudNrS0eCZTm5rsvVCMlX7WWVwKBgQC1XYVdxVVOGMY7NV2Oc2oCDcuD6k6Vk5tF\nPcrRtzqpOD9OCR7K4MHgcLwyg4uHg/LvryYTxi1+tdYrbR703AQpw+m4v2tBHKVq\nmATQnKvZhgEnelecdJac2w/53tP1LPIQN8rAKUXwoyryl/eXoHhlZPxWNEOSDpDC\nuyTxQE18kwKBgF1Zcvp65dzaIxCP4h8dFCp40YJR/gPysLAkLMhE+SIcC2/3KMne\nRMT2+bPjgGvRt1azgRIuIblzVu3/u0rqE/RkqW8PpXMhD/7EerWUXiHisPswghpB\nRscYgE8ApWlmyt8acVQmRYw1SpCbFhJmXnR+FL3y8UNjAKF2oBo5IuIzAoGAY2J5\nN9ZwFZi74CwxNWOHftKiaIpYP90gJARlhSB8M8jP3+pdhl09wMjmSGQPbNZgpPl8\nyy85NQtd7nQgl5uNaHmkNQooMwkImG3vjYWdIlktfr2rDuBQvGnKymlSCzNy/nIk\nV8MGQYSYf1HJaryT3TRGltKTCJGUwDEfYFiVXaMCgYAoYmxAQL0tZCN3dXeA1OLV\nY0Ufe0coP/GFB/RD4MIlfzSTNjxHTmM7is8gpVEZZMIIAm5sBxEtwX3O/Li3xBlc\n2V9S2KMxg2GX5xWprtRfnPJz9bBPPau//JQdQLSzBwBitnT8n53jYueV8VqwUisf\n1b7/NAiaopRqg42lTaBOaw==\n-----END PRIVATE KEY-----\n',
  client_email: process.env.UATCLIENT_EMAIL,
  client_id: process.env.UATCLIENT_ID,
  auth_uri: process.env.UATAUTH_URI,
  token_uri: process.env.UATTOKEN_URI,
  auth_provider_x509_cert_url:process.env.UATAUTH_PROVIDER_URI,
  client_x509_cert_url: process.env.UATCLIENT_URL,
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.UATDATABASE,
    storageBucket: process.env.UATSTORAGEBUCKET,
  });
}
const rdbInstance = admin.database();
const rdbFireStoreInstance = admin.firestore();
rdbFireStoreInstance.settings({ ignoreUndefinedProperties: true })

module.exports = { rdbInstance, rdbFireStoreInstance };