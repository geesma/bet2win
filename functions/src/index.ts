/* Importations */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';
import * as Stripe from 'stripe';

/* Constants */

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const REGISTER_URL = 'https://development.escoliesmartinez.cat/user/register';
const stripe = new Stripe(functions.config().stripe.secret);

/* Configurations */

admin.initializeApp();
sgMail.setApiKey(SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');
const db = admin.firestore();

/* Global functions */

async function getDataFromDatabase(doc: string, uid: string) {
  return await admin.firestore().doc(`/${doc}/${uid}`).get();
}

async function setDataToDatabase(doc: string, data) {
  return await admin.firestore().doc(`/${doc}/${data.uid}`).create(data);
}

async function updateOrCreateDataToDatabase(doc: string, data) {
  return await setDataToDatabase(doc,data).catch(() => {
    return admin.firestore().doc(`/${doc}/${data.uid}`).update(data);
  });
}

async function getCurrentUserRoles(email: string) {
  const user = await getUser(email);
  return (user.customClaims as any);
}

async function sendEmailToUser(name: string, email: string, url: string, code: string) {
  try {
    const msg = {
      to: email,
      from: 'no-reply@escoliesmartinez.cat',
      templateId: 'd-74113eed37444c34924419cdb5deab5a',
      dynamicTemplateData: {
        'name': name,
        'url': url,
        'code': code,
      }
    };
    return sgMail.send(msg).then(() => {
      console.log('email - sended');
    });
  } catch (err) {
    return err;
  }
}

async function grandAdminRole(email: string): Promise<void> {
  const user = await getUser(email);
  if(user.customClaims && (user.customClaims as any).admin === true) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: true
  });
}

async function grandDeveloperRole(email: string): Promise<void> {
  const user = await getUser(email);
  if(user.customClaims && (user.customClaims as any).developer === true) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    developer: true
  });
}

function getUser(email: string) {
  return admin.auth().getUserByEmail(email);
}

/* User detele */

exports.deleteUser = functions.firestore.document('users/{userID}').onDelete(async function(user,context) {
  admin.firestore().doc(`user-confirmations/${user.data().uid}`).delete().catch((err) => {return err;});
  admin.firestore().doc(`referalStrings/${user.data().referalString}`).delete().catch((err) => {return err;});
  if(user.data().isReferal) {
    await admin.firestore().doc(`referalStrings/${user.data().referal}`).get().then((userdata) => {
      const data = userdata.data();
      admin.firestore().doc(`users/${data.userId}`).get().then((userRefered) => {
        const referals = userRefered.data().referalNumber - 1;
        userRefered.ref.update({referalNumber: referals}).then(() => {
          console.log('-1 referal => ' + data);
        }).catch((err) => {
          console.error(err);
          return err;
        });
      }).catch((err) => {return err;});
    }).catch((err) => {return err;});
  }
});

/* User update */

exports.userUpdate = functions.firestore.document('users/{userId}').onUpdate(async (change, context) => {
  const newValue = change.after.data();
  const oldValue = change.before.data();
  if(newValue.userConfirmationMethod !== oldValue.userConfirmationMethod && oldValue.userConfirmed === false) {
    const code = Math.floor(Math.random()*900000) + 100000;
    switch(newValue.userConfirmationMethod) {
      case 'email':
        await updateOrCreateDataToDatabase('user-confirmations', {uid: newValue.uid, code: code, method: newValue.userConfirmationMethod, attemps: 1}).catch(err => {return {error: err};});
        await sendEmailToUser(newValue.name, newValue.email, REGISTER_URL, ''+code+'');
        break;
      case '':
        await updateOrCreateDataToDatabase('users', {uid: oldValue.uid, userConfirmationMethod: oldValue.userConfirmationMethod, attemps: 1}).catch((err) => {return err;});
        await admin.firestore().doc(`user-confirmations/${newValue.uid}`).delete().catch((err) => {return err;});
        break;
      case 'delete':
        await admin.firestore().doc(`user-confirmations/${oldValue.uid}`).delete().catch((err) => {return err;});
        await admin.firestore().doc(`users/${oldValue.uid}`).update({userConfirmationMethod: admin.firestore.FieldValue.delete()}).catch((err) => {return err;});
      default:
        break;
    }
  }
  if(newValue.userConfirmed !== oldValue.userConfirmed) {
    if(newValue.userConfirmed === false) {
      await admin.firestore().doc(`users/${oldValue.uid}`).update({userConfirmationMethod: 'delete'}).catch((err) => {return err;});
    } else {
      await admin.firestore().doc(`user-confirmations/${oldValue.uid}`).delete().catch((err) => {return err;});
    }
  }
  if(newValue.referalString !== oldValue.referalString) {
    admin.firestore().doc(`referalStrings/${oldValue.uid}`).delete().then(() => {
      setDataToDatabase('referalStrings',{uid: newValue.referalString, userId: newValue.uid}).catch((err) => {return err;});
    }).catch((err) => {return err;});
  }
  if(newValue.referal !== oldValue.referal && newValue.isReferal) {
    await admin.firestore().doc(`referalStrings/${newValue.referal}`).get().then((userdata) => {
      const data = userdata.data();
      admin.firestore().doc(`users/${data.userId}`).get().then((user) => {
        const referals = user.data().referalNumber + 1;
        user.ref.update({referalNumber: referals}).then(() => {
          console.log('+1 referal => ' + data);
        }).catch((err) => {
          console.error(err);
          return err;
        });
      }).catch((err) => {return err;});
    }).catch((err) => {return err;});
  }
  return 'operations done';
});

/* Confirmation code */

export const checkEmailWithCode = functions.https.onCall(async (data, context) => {
  try {
    const userId = context.auth.uid;
    const userCodeDoc = await getDataFromDatabase('user-confirmations',userId);
    const userCode = userCodeDoc.data();
    if (userCode.attemps && userCode.attemps < 9) {
      await updateOrCreateDataToDatabase('user-confirmations', {uid: userCode.uid, attemps: userCode.attemps + 1})
      if (data.code === userCode.code && userCode.method === 'email') {
        await updateOrCreateDataToDatabase('users', {uid: userCode.uid, userConfirmed: true})
        return {response: 'Los codigos coinciden'};
      } else {
        return {error: 'Los codigos no coinciden o el metodo seleccionado no es correcto'};
      }
    } else if (userCode.attemps >= 9 && userCode.attemps < 20) {
      await updateOrCreateDataToDatabase('user-confirmations', {uid: userCode.uid, attemps: userCode.attemps + 1})
      return {
        error: 'Demasiados intentos'
      };
    } else if (userCode.attemps === 20) {
      await admin.firestore().doc(`user-confirmations/${userCode.uid}`).delete()
      await admin.firestore().doc(`users/${userCode.uid}`).delete()
      await admin.auth().deleteUser(userCode.uid)
      return {error: 'Demasiados intentos, usuario eliminado'};
    } else {
      return {
        error: "No se ha completado ninguna acción"
      };
    }
  } catch (err) {
    return {
      error: err,
      info: "No se cual es el error"
    };
  }
});

/* Roles Functions */

exports.addAdmin = functions.https.onCall((data,context) => {
  if (context.auth.token.developer !== true && context.auth.token.admin !== true) {
    return {
      error: 'Request not authorized. User must be and Admin or Developer to fullfill request'
    };
  }
  const email = data.email;
  return grandAdminRole(email).then(() => {
    return {
      result: 'Request fullfilled! ${email} is now and Admin'
    };
  });
});

exports.createUserWithData = functions.auth.user().onCreate(function(user,context){
  const permisions = {
    admin: false,
    developer: false,
    premium: false,
    promotor: false
  };
  admin.auth().setCustomUserClaims(user.uid, permisions).then(success =>'Changed').catch(err =>'Error');
  setDataToDatabase('users',{uid: user.uid, email: user.email ,roles: permisions, userConfirmed: user.emailVerified, referalString: user.uid, referalNumber: 0, hasReferal: false}).catch((err) => {return err;});
  setDataToDatabase('referalStrings',{uid: user.uid, userId: user.uid}).catch((err) => {return err;});
});

exports.deleteUserInformation = functions.auth.user().onDelete(function(user,context){
  admin.firestore().doc(`users/${user.uid}`).delete().catch((err) => {return err;});
});

/* Stripe subscription */

export const startSubscriptionStripe = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid;
  const userDoc = await getDataFromDatabase('users',userId);

  const user = userDoc.data();

  const source = await stripe.customers.createSource(user.subscription.stripe.stripeId, {
    source: data.source,
  });

  if(!source) {
    throw new Error('Stripe failed to attach the card');
  }

  const sub = await stripe.subscriptions.create({
    customer: user.subscription.stripe.stripeId,
    items: [{plan: 'plan_EB8QM5XOlYZF5H'}]
  });

  return db.doc(`users/${userId}`).update({
    subscription: {
      type: 'stripe',
      stripe: {
        stripeId: user.subscription.stripe.stripeId,
        subscriptionId: sub.id,
        status: sub.status,
        itemId: sub.items.data[0].id
      },
      status: sub.status,
      renovable: true,
    },
    roles: {
      admin: user.roles.admin,
      developer: user.roles.developer,
      premium: true,
      promotor: user.roles.promotor
    }
  });
});

export const addStripeIdToUser = functions.https.onCall(async (data,context) => {
  const userId = context.auth.uid;
  const userDoc = await getDataFromDatabase('users',userId);

  const user = userDoc.data();

  const firebaseUID = user.uid;

  const customer = await stripe.customers.create({
    metadata: { firebaseUID }
  });

  await updateOrCreateDataToDatabase('users',{
    uid: user.uid,
    subscription: {
      type: 'stripe',
      stripe: {
        stripeId: customer.id,
      }
    }
  });
});

export const cancelSubscription = functions.https.onCall(async (data, context) => {
  switch(data.type) {
    case 'stripe':
      const userId = context.auth.uid;
      const userDoc = await getDataFromDatabase('users',userId);

      const user = userDoc.data();

      await stripe.subscriptions.update(user.subscription.stripe.subscriptionId, {cancel_at_period_end: true});
      return db.doc(`users/${userId}/subscription`).update({renovable: false});
    default:
      return {
        error: "No se ha podido completar"
      };
  }
});

export const continueSubscription = functions.https.onCall(async (data, context) => {
  switch(data.type) {
    case 'stripe':
      const userId = context.auth.uid;
      const userDoc = await getDataFromDatabase('users',userId);

      const user = userDoc.data();

      await stripe.subscriptions.update(user.subscription.stripe.subscriptionId, {cancel_at_period_end: false});

      return db.doc(`users/${userId}/subscription`).update({renovable: true});
    default:
      return {
        error: "No se ha podido completar"
      };;
  }
});

exports.recurringPayment = functions.https.onRequest(async (req, res) => {
  try {
    const hook  = req.body.type
    const data  = req.body.data.object

    if (!data) throw new Error('missing data')

    if (hook === 'invoice.payment_succeeded') {
      await db.doc(`users/${data.customer}/roles`).update({premium: true});
      await db.doc(`users/${data.customer}/subscription`).update({stauts: 'active'});
    }

    if (hook === 'invoice.payment_failed') {
      await db.doc(`users/${data.customer}/roles`).update({premium: false});
      await db.doc(`users/${data.customer}/subscription`).update({stauts: 'pastDue'});
    }

    return res.status(200).send(`successfully handled ${hook}`)
  } catch (e) {
    return res.status(400).send(`error handling ${req.body.type}`)
  }
});

/* Check referal */

/* export const addReferal = functions.https.onCall(async (data, context) => {
  return true
}) */
