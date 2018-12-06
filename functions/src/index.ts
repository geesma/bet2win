/* Importations */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as sgMail from '@sendgrid/mail';

/* Constants */

const corsHandler = cors({origin: true});
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const REGISTER_URL = "https://development.escoliesmartinez.cat/user/register"

/* Configurations */

admin.initializeApp();
sgMail.setApiKey(SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');

/* Global functions */

function getDataFromDatabase(doc: string, uid: string) {
  return admin.firestore().doc(`/${doc}/${uid}`).get()
}

function setDataToDatabase(doc: string, data) {
  return admin.firestore().doc(`/${doc}/${data.uid}`).create(data)
}

async function updateOrCreateDataToDatabase(doc: string, data) {
  return await setDataToDatabase(doc,data).catch(() => {
    return admin.firestore().doc(`/${doc}/${data.uid}`).update(data)
  })
}

async function getCurrentUserRoles(email: string) {
  const user = await getUser(email);
  return user.customClaims
}

function sendEmailToUser(name: string, email: string, url: string, code: string) {
  const msg = {
    to: email,
    from: 'no-reply@escoliesmartinez.cat',
    templateId: 'd-74113eed37444c34924419cdb5deab5a',
    dynamicTemplateData: {
      "name": name,
      "url": url,
      "code": code,
    }
  }
  sgMail.send(msg).then(() => {
    console.log("email - sended")
  })
}

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

/* User detele */

exports.deleteUser = functions.firestore.document('users/{userID}').onDelete(function(user,context) {
  admin.firestore().doc(`user-confirmations/${user.data().uid}`).delete()
})

/* Account verification */

exports.sendVerification = functions.firestore.document('users/{userId}').onUpdate((change, context) => {
  const newValue = change.after.data();
  const oldValue = change.before.data();
  if(newValue.userConfirmationMethod !== oldValue.userConfirmationMethod && oldValue.userConfirmed == false) {
    const code = Math.floor(Math.random()*900000) + 100000;
    switch(newValue.userConfirmationMethod) {
      case "email":
        updateOrCreateDataToDatabase("user-confirmations", {uid: newValue.uid, code: code, method: newValue.userConfirmationMethod}).catch(err => {return {error: err}});
        sendEmailToUser(newValue.name, newValue.email, REGISTER_URL, ""+code+"")
        break;
      case "":
        updateOrCreateDataToDatabase("users", {uid: newValue.uid, userConfirmationMethod: oldValue.userConfirmationMethod})
        admin.firestore().doc(`user-confirmations/${newValue.uid}`).delete()
        break;
      default:
        admin.firestore().doc(`user-confirmations/${newValue.uid}`).delete()
        break;
    }
  }
  if(newValue.userConfirmed !== oldValue.userConfirmed) {
    if(newValue.userConfirmed == false) {
      admin.firestore().doc(`users/${oldValue.uid}`).update({userConfirmationMethod: admin.firestore.FieldValue.delete()})
    }
  }
  return "operations done"
});

/* Check code */

export const checkEmailWithCode = functions.https.onRequest((request,response) => {
  corsHandler(request, response, async () => {
    try {
      const params = request.body;
      const user = await getDataFromDatabase("user-confirmations",params.uid);
      const data = user.data()
      if(data.attemps && data.attemps < 9) {
        updateOrCreateDataToDatabase("user-confirmations", {uid: data.uid, attemps: data.attemps+1})
        if(params.code == data.code && data.method === "email") {
          updateOrCreateDataToDatabase("users",{uid: data.uid, userConfirmed: true})
          admin.firestore().doc(`user-confirmations/${data.uid}`).delete()
          return response.status(200).send({response: "Los codigos coinciden"})
        } else {
          return response.status(500).send({error: "Los codigos no coinciden o el metodo seleccionado no es correcto"})
        }
      } else if (data.attemps >= 9 && data.attemps < 20) {
        updateOrCreateDataToDatabase("user-confirmations", {uid: data.uid, attemps: data.attemps+1})
        return response.status(500).send({error: "Demasiados intentos"})
      } else if (data.attemps == 20 ) {
        try {
          admin.firestore().doc(`user-confirmations/${data.uid}`).delete().then(() => {
            admin.firestore().doc(`users/${data.uid}`).delete().then(() => {
              admin.auth().deleteUser(data.uid)
            })
          })
          return response.status(500).send({error: "Demasiados intentos, usuari eliminado"})
        }
        catch(err) {
          return response.status(500).send({error: err})
        }
      } else {
        updateOrCreateDataToDatabase("user-confirmations", {uid: data.uid, attemps: 1})
        if(params.code == data.code && data.method === "email") {
          updateOrCreateDataToDatabase("users",{uid: data.uid, userConfirmed: true})
          return response.status(200).send({response: "Los codigos coinciden"})
        } else {
          return response.status(500).send({error: "Los codigos no coinciden o el metodo seleccionado no es correcto"})
        }
      }
    }
    catch (err) {
      return response.status(500).send({error: err})
    }
  });
})

/* Roles Functions */

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
  const permisions = {
    admin: false,
    developer: false,
    premium: false
  }
  admin.auth().setCustomUserClaims(user.uid, permisions).then(success =>"Changed").catch(err =>"Error")
  updateOrCreateDataToDatabase("users",{uid: user.uid ,roles: permisions})
})

exports.deleteUserInformation = functions.auth.user().onDelete(function(user,context){
  admin.firestore().doc(`users/${user.uid}`).delete()
})
