/* Importations */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as sgMail from '@sendgrid/mail';
import * as Stripe from 'stripe';

/* Constants */

const corsHandler = cors({origin: true});
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const REGISTER_URL = "https://development.escoliesmartinez.cat/user/register"
const stripe = new Stripe(functions.config().stripe.secret)
const db = admin.firestore();

/* Configurations */

admin.initializeApp();
sgMail.setApiKey(SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');

/* Global functions */

async function getDataFromDatabase(doc: string, uid: string) {
  return await admin.firestore().doc(`/${doc}/${uid}`).get()
}

async function setDataToDatabase(doc: string, data) {
  return await admin.firestore().doc(`/${doc}/${data.uid}`).create(data)
}

async function updateOrCreateDataToDatabase(doc: string, data) {
  return await setDataToDatabase(doc,data).catch(() => {
    return admin.firestore().doc(`/${doc}/${data.uid}`).update(data)
  })
}

async function getCurrentUserRoles(email: string) {
  const user = await getUser(email);
  return (user.customClaims as any)
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
  }).catch((err) => {return err})
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

exports.deleteUser = functions.firestore.document('users/{userID}').onDelete(async function(user,context) {
  admin.firestore().doc(`user-confirmations/${user.data().uid}`).delete().catch((err) => {return err})
  admin.firestore().doc(`referalStrings/${user.data().referalString}`).delete().catch((err) => {return err})
  if(user.data().isReferal) {
    await admin.firestore().doc(`referalStrings/${user.data().referal}`).get().then((userdata) => {
      const data = userdata.data()
      admin.firestore().doc(`users/${data.userId}`).get().then((userRefered) => {
        const referals = userRefered.data().referalNumber - 1
        userRefered.ref.update({referalNumber: referals}).then(() => {
          console.log("-1 referal => " + data)
        }).catch((err) => {
          console.error(err)
          return err
        })
      }).catch((err) => {return err})
    }).catch((err) => {return err})
  }
})

/* Account verification */

exports.sendVerification = functions.firestore.document('users/{userId}').onUpdate(async (change, context) => {
  const newValue = change.after.data();
  const oldValue = change.before.data();
  if(newValue.userConfirmationMethod !== oldValue.userConfirmationMethod && oldValue.userConfirmed === false) {
    const code = Math.floor(Math.random()*900000) + 100000;
    switch(newValue.userConfirmationMethod) {
      case "email":
        await updateOrCreateDataToDatabase("user-confirmations", {uid: newValue.uid, code: code, method: newValue.userConfirmationMethod}).catch(err => {return {error: err}});
        sendEmailToUser(newValue.name, newValue.email, REGISTER_URL, ""+code+"")
        break;
      case "":
        await updateOrCreateDataToDatabase("users", {uid: oldValue.uid, userConfirmationMethod: oldValue.userConfirmationMethod}).catch((err) => {return err})
        await admin.firestore().doc(`user-confirmations/${newValue.uid}`).delete().catch((err) => {return err})
        break;
      case "delete":
        await admin.firestore().doc(`user-confirmations/${oldValue.uid}`).delete().catch((err) => {return err})
        await admin.firestore().doc(`users/${oldValue.uid}`).update({userConfirmationMethod: admin.firestore.FieldValue.delete()}).catch((err) => {return err})
      default:
        break;
    }
  }
  if(newValue.userConfirmed !== oldValue.userConfirmed) {
    if(newValue.userConfirmed === false) {
      await admin.firestore().doc(`users/${oldValue.uid}`).update({userConfirmationMethod: "delete"}).catch((err) => {return err})
    } else {
      await admin.firestore().doc(`user-confirmations/${oldValue.uid}`).delete().catch((err) => {return err})
    }
  }
  if(newValue.referalString !== oldValue.referalString) {
    admin.firestore().doc(`referalStrings/${oldValue.uid}`).delete().then(() => {
      setDataToDatabase('referalStrings',{uid: newValue.referalString, userId: newValue.uid}).catch((err) => {return err})
    }).catch((err) => {return err})
  }
  if(newValue.referal !== oldValue.referal && newValue.isReferal) {
    await admin.firestore().doc(`referalStrings/${newValue.referal}`).get().then((userdata) => {
      const data = userdata.data()
      admin.firestore().doc(`users/${data.userId}`).get().then((user) => {
        const referals = user.data().referalNumber + 1
        user.ref.update({referalNumber: referals}).then(() => {
          console.log("+1 referal => " + data)
        }).catch((err) => {
          console.error(err)
          return err
        })
      }).catch((err) => {return err})
    }).catch((err) => {return err})
  }
  return "operations done"
});

/* Check code */

export const checkEmailWithCode = functions.https.onRequest((request,response) => {
  corsHandler(request, response, async () => {
    try {
      const params = request.body;
      const user = await getDataFromDatabase("user-confirmations",params.uid).catch((err) => {return err});
      const data = user.data()
      if(data.attemps && data.attemps < 9) {
        await updateOrCreateDataToDatabase("user-confirmations", {uid: data.uid, attemps: data.attemps+1}).catch((err) => {return err})
        if(params.code === data.code && data.method === "email") {
          await updateOrCreateDataToDatabase("users",{uid: data.uid, userConfirmed: true}).catch((err) => {return err})
          return response.status(200).send({response: "Los codigos coinciden"})
        } else {
          return response.status(500).send({error: "Los codigos no coinciden o el metodo seleccionado no es correcto"})
        }
      } else if (data.attemps >= 9 && data.attemps < 20) {
        await updateOrCreateDataToDatabase("user-confirmations", {uid: data.uid, attemps: data.attemps+1}).catch((err) => {return err})
        return response.status(500).send({error: "Demasiados intentos"})
      } else if (data.attemps === 20 ) {
        try {
          await admin.firestore().doc(`user-confirmations/${data.uid}`).delete().then(() => {
            admin.firestore().doc(`users/${data.uid}`).delete().then(() => {
              admin.auth().deleteUser(data.uid).catch((err) => {return err})
            }).catch((err) => {return err})
          }).catch((err) => {return err})
          return response.status(500).send({error: "Demasiados intentos, usuario eliminado"})
        }
        catch(err) {
          return response.status(500).send({error: err})
        }
      } else {
        await updateOrCreateDataToDatabase("user-confirmations", {uid: data.uid, attemps: 1}).catch((err) => {return err})
        if(params.code === data.code && data.method === "email") {
          await updateOrCreateDataToDatabase("users",{uid: data.uid, userConfirmed: true}).catch((err) => {return err})
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

exports.createUserWithData = functions.auth.user().onCreate(function(user,context){
  const permisions = {
    admin: false,
    developer: false,
    premium: false,
    promotor: false
  }
  admin.auth().setCustomUserClaims(user.uid, permisions).then(success =>"Changed").catch(err =>"Error")
  setDataToDatabase("users",{uid: user.uid, email: user.email ,roles: permisions, userConfirmed: user.emailVerified, referalString: user.uid, referalNumber: 0, hasReferal: false}).catch((err) => {return err})
  setDataToDatabase("referalStrings",{uid: user.uid, userId: user.uid}).catch((err) => {return err})
})

exports.deleteUserInformation = functions.auth.user().onDelete(function(user,context){
  admin.firestore().doc(`users/${user.uid}`).delete().catch((err) => {return err})
})

/* Make payment */

export const startSubscriptionStripe = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid
  const userDoc = await getDataFromDatabase('users',userId)

  const user = userDoc.data();

  const firebaseUID = user.uid;

  const customer = await stripe.customers.create({
    metadata: { firebaseUID }
  });

  await updateOrCreateDataToDatabase('users',{
      uid: userId,
      subscription: {
        type: "stripe",
        stripe: {
          stripeId: customer.id,
        }
      }
  })

  const source = await stripe.customers.createSource(user.subscription.stripeId, {
    source: data.source,

  })

  if(!source) {
    throw new Error('Stripe failed to attach the card')
  }

  const sub = await stripe.subscriptions.create({
    customer: user.subscription.stripeId,
    items: [{plan: 'prod_EB8Ntp2kmvnyFm'}]
  })

  return db.doc(`users/${userId}`).update({
    subscription: {
      stripe: {
        subscriptionId: sub.id,
        status: sub.status,
        itemId: sub.items.data[0].id
      }
    }
  })
})
