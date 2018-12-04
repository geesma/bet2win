/* Importations */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as sgMail from '@sendgrid/mail';

/* Constants */

const corsHandler = cors({origin: true});
const SENDGRID_API_KEY = functions.config().sendgrid.key;

/* Configurations */

admin.initializeApp();
sgMail.setApiKey(SENDGRID_API_KEY);

/* Global functions */

function getDataFromDatabase(doc: string, uid: string) {
  return admin.firestore().doc(`/${doc}/${uid}`)
}

/* Email sender Functions */

export const sendEmail = functions.https.onRequest((request,response) => {
  return corsHandler(request, response, () => {
    const code = Math.floor(Math.random()*900000) + 100000;
    request.body.code = code;
    return sendEmailToUser(request.body).then(() => {
      response.status(200).send({response: request.body})
    }).catch(err => {
      return response.status(500).send({error: err})
    })
  });
})

async function sendEmailToUser(params) {
  const user = await getDataFromDatabase("users",params.uid);
  await user.update({code:params.code})
  const msg = {
      to: params.email,
      from: 'no-reply@escoliesmartinez.cat',
      //subject:  'New Follower',
      // text: `Hey ${toName}. You have a new follower!!! `,
      // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

      // custom templates
      templateId: 'd-74113eed37444c34924419cdb5deab5a',
      sub: {
        "{{name}}": params.name,
        "{{url}}": params.url,
        "{{code}}": params.code,
      }
  };
  sgMail.send(msg)
}



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
  admin.auth().setCustomUserClaims(user.uid, {
    admin: false,
    developer: false,
    premium: false
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
