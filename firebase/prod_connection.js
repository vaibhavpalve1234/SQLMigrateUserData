const admin = require('firebase-admin');

let serviceAccount = {
  type: process.env.PRODTYPE,
  project_id: process.env.PRODPROJECT_ID,
  private_key_id:process.env.PRODPROJECT_KEY,
  // private_key:process.env.PRODPRIVATE_KEY,
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzU0AL6t5xlPaf\nTpk629DOB6zu34a3V+P760jTY8piMfdbMNI9Yl/jDyc/UCAPqr2F9Jup0pI1Gk6C\nBvh77GRIy1IYmSLbxIEoa6cPRAJApF/7Zp7Aae8cMgIlHkAo2R2yt+n+4I0IXpkk\nU/emSvUGyjGv2DxifRJXgmUdOLbyZ0b/Kke9nfmShzSZm0QZEsoBqVb3Ws65LFav\nUvPHB99q3lgjtl7QAS107bpsVZpyOMJEnXEu7XOVxeFRxsxxXp8dNlqCYmaQJRxa\nnAWtU7Ku3B1NvjHmpiYu54qcg9xRMMS/2SYTUIZ2XdnbGe+SYtOVmKRiZrLA44gU\nSsMleW1HAgMBAAECggEAPbf9ZxyjCryWVSYcHuHg78g8gMp190xMrzu/iOHjmgBQ\nfhZDhdUB44gnnebZ4gqFyED0AnLy10wCkUYM57nomhVAYC70jGcJfPvwN5TUoaLx\nVflv0hGjtjSQAG507porWoNqCcsHP0Yvtw0fQyCxTHDywO7PeaZKVcwPOQt4C91k\nEG0L6/M2Gj+DdH1KnUeN76HYTdOWtn8no4WVj0svZZwCe0r5SYVDStIm5OOB3RuG\nYl3wXrfEQDnpZoJ/iOlB5JK59YYQFr2k1uIUGOBsCygQfECVTtg0cTJJSv8p/hGc\n9+ZfV3D0ef4+pg8G8GsRDE9ldtwk4DWcqRExR88X4QKBgQDkAtOlalYB5eUDwLnf\ne5auLzVoe+J5/1V7eeXFmMW5jP4ofuX3zaXBbo7Q+rx96UDO6GjqGGdIwLHkcSwm\nJCB5+HAAoxyoICTXS7q20/0GsLP1tfUffx657zSvhf598efVV6HdMvyS6/Sa9Zn/\nhpB3teVYK0ky2gS5FBBtzzKp6wKBgQDJVnyJng/JZahvuTq/J74r/jgY+opkrrIP\nP/2IvW+D984GnKA6d9GJ5VmUskNeWvbpiF+3M9mHq+w++OSrtfecKCCS460Bnhsa\n1PbiOR9pcaYAl6MZ8m4ZSmGzfHre1buqyxm9NglFuSPqXJr7z4KfhiuVJPuuVxD2\nsZ9oh3A3FQKBgAVIA3r7YY6dspZJqoSAqlbShRwscmx8+4/mnOncxgesOl7ZwZ3h\nx4sZcnlotWD9PCEOxQ9XDV1kCTrPXERt5cqtdHqvTISgafoKqQJ/GodDJIf2dP0L\nxrxry/6cze5A4ivQ4dDr02nbyUilk7GVflcngW5vYjypTB61VkQU3omNAoGAfKFE\nxgtJymlbMo1+iAWZ+rGLGCs+r8RUBIyf7J0XAqHKrt0VchvpYWrPYPRYL3gvj7AT\nT9yQsyMBQpnfM0uY0tkkEMlOtsmgDaP2j2K8xxDKqWM0W0NuU8lvYSOVC4tSeA7x\nB+cDJl3Mla5tYaK6QPVU1SXnhavvnEWnX5U3KWECgYBZMm6Xj/0qwFYKqPoN4t/R\njWODwYGoQkDOm7JOD4HPFiD3HAMSwpUgLAbcKNC6n20UEu4SjfHsR2+Hcw/7zOb0\nKTBiD23DZ2hCK54LFoZ5Jvvlb4QTRe8NVjol9ftg1GqiQFgQVBnx7a2AZP9SGguv\nVJGSweDWFjIvOln7gEGkyw==\n-----END PRIVATE KEY-----\n',
  client_email: process.env.PRODCLIENT_EMAIL,
  client_id: process.env.PRODCLIENT_ID,
  auth_uri: process.env.PRODAUTH_URI,
  token_uri: process.env.PRODTOKEN_URI,
  auth_provider_x509_cert_url: process.env.PRODAUTH_PROVIDER_URI,
  client_x509_cert_url: process.env.PRODCLIENT_URL,
};
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.PRODDATABASE,
    storageBucket:process.env.PRODSTORAGEBUCKET,
  });
}
const rdbInstance = admin.database();
const rdbFireStoreInstance = admin.firestore();
rdbFireStoreInstance.settings({ ignoreUndefinedProperties: true })


module.exports = { rdbInstance, rdbFireStoreInstance };
