import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.addAdmin = functions.https.onCall((data,context) => {
  if (context.auth.token.developer !== true && context.auth.token.admin !== true) {
    return {
      error: "Request not authorized. User must be and Admin or Developer to fullfill request"
    };
  }
  const email = data.email;
  return grandAdminRole(email).then(() => {
    return {
      result: "Request fullfilled! ${email} is now and Admin"
    };
  })
})

exports.setPermisions = functions.auth.user().onCreate(function(user,context){
  admin.auth().setCustomUserClaims(user.uid, {
    admin: true
  }).then(success =>"Changed").catch(err =>"Error")
  admin.auth().setCustomUserClaims(user.uid, {
    developer: true
  }).then(success =>"Changed").catch(err =>"Error")
  admin.auth().setCustomUserClaims(user.uid, {
    premium: true
  }).then(success =>"Changed").catch(err =>"Error")
})

async function grandAdminRole(email: string): Promise<void> {
  const user = await getUser(email);
  if(user.customClaims && (user.customClaims as any).admin === true) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: true
  })
}

async function grandDeveloperRole(email: string): Promise<void> {
  const user = await getUser(email);
  if(user.customClaims && (user.customClaims as any).developer === true) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    developer: true
  })
}

function getUser(email: string) {
  return admin.auth().getUserByEmail(email);
}
