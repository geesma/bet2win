// TODO: afegir timeStamps a tots els nous registres

/* Importations */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';
import * as Stripe from 'stripe';

/* Constants */

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const REGISTER_URL = 'https://development.escoliesmartinez.cat/register';
const stripe = new Stripe(functions.config().stripe.secret);

/* Configurations */

admin.initializeApp();
sgMail.setApiKey(SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');
const db = admin.firestore();

/* Interfaces */

interface User {
  uid: string;
  email: string;
  userConfirmed?: boolean;
  name?: string;
  surname?: string;
  phone?: string;
  locale?: string;
  referalNumber: number;
  isReferal?: boolean;
  referal?: string;
  referalString: string;
  roles: Roles;
  subscription?: {
    status: string;
    type: string;
    end: Date;
    renovable: boolean;
  }
}

interface Roles {
  premium: boolean;
  developer: boolean;
  admin: boolean;
  promotor: boolean;
}

/* Global functions */

function getCurrentFormatedDate() {
  const today = new Date();
  return today.getFullYear() + '' + ( today.getMonth() + 11 ) + '' + today.getDate();
}

function getCurrentDate() {
  const today = new Date();
  return today.getDate() + '/' + ( today.getMonth() + 1 ) + '/' + today.getFullYear();
}

async function getDataFromDatabase(doc: string, uid: string) {
  try {
    return await admin.firestore().doc(`/${doc}/${uid}`).get();
  } catch (e) {
    console.log("error + " + doc + " " + uid);
    return null;
  }
}

async function setDataToDatabase(doc: string, data) {
  return await admin.firestore().doc(`/${doc}/${data.uid}`).create(data);
}

async function updateOrCreateDataToDatabase(doc: string, data) {
  return await setDataToDatabase(doc,data).catch(async () => {
    return await admin.firestore().doc(`/${doc}/${data.uid}`).update(data);
  });
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
    return sgMail.send(msg);
  } catch (err) {
    return err;
  }
}

async function grandAdminRole(email: string): Promise<void> {
  // TODO: fer que tambe es canviin els roles de un usuari i que si un usuari el te com a referit que es sumi als premium
  const user = await getUser(email);
  if(user.customClaims && (user.customClaims as any).admin === true) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: true
  });
}

async function grandDeveloperRole(email: string): Promise<void> {
  // TODO: fer que tambe es canviin els roles de un usuari
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

async function updateUserStats(permisions: Roles) {
  try {
    const today = new Date();
    const todayDate = today.getFullYear() + '' + ( today.getMonth() + 11 ) + '' + today.getDate();
    const statsTotals = await getDataFromDatabase('webStats/userStats', '');
    let dataTotal = {
      users: 1,
      premiumUsers: permisions.premium ? 1 : 0,
      adminUsers: permisions.admin ? 1 : 0,
      promotorUsers: permisions.promotor ? 1 : 0
    };
    if (statsTotals.exists) {
      const dataStats = statsTotals.data();
      dataTotal = {
        users: dataStats.users += 1,
        premiumUsers: permisions.premium ? dataStats.premiumUsers += 1 : dataStats.premiumUsers,
        adminUsers: permisions.admin ? dataStats.adminUsers += 1 : dataStats.adminUsers,
        promotorUsers: permisions.promotor ? dataStats.promotorUsers += 1 : dataStats.promotorUsers,
      }
    }
    const stats = await getDataFromDatabase('webStats/userStats/dayly', todayDate);
    const data = {
      users: 1,
      premiumUsers: permisions.premium ? 1 : 0,
      adminUsers: permisions.admin ? 1 : 0,
      promotorUsers: permisions.promotor ? 1 : 0,
      usersTotalTotay: dataTotal.users,
      premiumUsersTotalTotay: dataTotal.premiumUsers,
      adminUsersTotalTotay: dataTotal.adminUsers,
      promotorUsersTotalTotay: dataTotal.promotorUsers,
    };
    if (stats.exists) {
      const dataStats = stats.data();
      data['users'] = dataStats.users += 1;
      data['premiumUsers'] = permisions.premium ? dataStats.premiumUsers += 1 : dataStats.premiumUsers;
      data['adminUsers'] = permisions.admin ? dataStats.adminUsers += 1 : dataStats.adminUsers;
      data['promotorUsers'] = permisions.promotor ? dataStats.promotorUsers += 1 : dataStats.promotorUsers;
    }
    await updateStats('userStats', dataTotal);
    return await updateStats('userStats/dayly/' + todayDate, data);
  } catch (e) {
    return e
  }
}

async function decreaseUserStats(permisions: Roles) {
  try {
    const todayDate = getCurrentFormatedDate();
    const statsTotals = await getDataFromDatabase('webStats/userStats', '');
    const dataStats = statsTotals.data();
    const dataTotal = {
      users: dataStats.users -= 1,
      premiumUsers: permisions.premium ? dataStats.premiumUsers -= 1 : dataStats.premiumUsers,
      adminUsers: permisions.admin ? dataStats.adminUsers -= 1 : dataStats.adminUsers,
      promotorUsers: permisions.promotor ? dataStats.promotorUsers -= 1 : dataStats.promotorUsers,
    };
    const stats = await getDataFromDatabase('webStats/userStats/dayly', todayDate);
    const dataStatsDayly = stats.data();
    const data = {
      users: dataStatsDayly.users -= 1,
      premiumUsers: permisions.premium ? dataStatsDayly.premiumUsers -= 1 : dataStatsDayly.premiumUsers,
      adminUsers: permisions.admin ? dataStatsDayly.adminUsers -= 1 : dataStatsDayly.adminUsers,
      promotorUsers: permisions.promotor ? dataStatsDayly.promotorUsers -= 1 : dataStatsDayly.promotorUsers,
      usersTotalTotay: dataTotal.users,
      premiumUsersTotalTotay: dataTotal.premiumUsers,
      adminUsersTotalTotay: dataTotal.adminUsers,
      promotorUsersTotalTotay: dataTotal.promotorUsers,
    };
    await updateStats('userStats', dataTotal);
    return await updateStats('userStats/dayly/' + todayDate, data);
  } catch (e) {
    return e
  }
}

// TODO: updateReferal stats (information about new referals per day and globally for each user in order to make stadistics for promotors

async function updateStats(stat: string, data) {
  return await admin.firestore().doc('webStats/' + stat).set(data).catch(async () => {
    await admin.firestore().doc('webStats/' + stat).update(data).catch(() => {
      console.error("error al intentar añadir informacion a las estadisticas");
    });
  })
}

/* User detele */

exports.deleteUser = functions.firestore.document('users/{userID}').onDelete(async function(user,context) {
  try {
    const data = user.data();
    await decreaseUserStats(data.roles);
    await admin.firestore().doc(`usersInformation/${data.uid}`).delete();
    await admin.firestore().doc(`usersConfirmation/${data.uid}`).delete();
    await admin.firestore().doc(`usersReferal/${data.referalString}`).delete();
    if(data.isReferal) {
      const userRefered = await admin.firestore().doc(`users/${data.referal}`).get();
      const referedData = userRefered.data();
      let referals = referedData.referalNumber - 1;
      if (referals < 0) {
        referals = 0;
      }
      await userRefered.ref.update({referalNumber: referals});
    }
    if (data.subscription && data.subscription.renovable) {
      await admin.firestore().doc(`usersSubscription/${data.referalString}`).delete();
      switch (data.subscription.type) {
        case 'stripe':
          await stripe.subscriptions.update(data.subscription.stripe.subscriptionId, {cancel_at_period_end: true});
      }
    }
  } catch (e) {
    return e;
  }

});

/* User update */

// exports.userUpdate = functions.firestore.document('users/{userId}').onUpdate(async (change, context) => {});

/* Confirmation code */

exports.sendEmailWithCode = functions.https.onCall( async (data, context) => {
  try {
    const code = Math.floor(Math.random()*900000) + 100000;
    const userId = context.auth.uid;
    const userDoc = await getDataFromDatabase('users',userId);
    const user = userDoc.data();
    await updateOrCreateDataToDatabase('users',{
      uid: user.uid,
      userConfirmed: false
    });
    await updateOrCreateDataToDatabase('usersConfirmation', {uid: user.uid, code: code, method: 'email', attemps: 0});
    await sendEmailToUser(user.name, user.email, REGISTER_URL+'/'+code, ''+code+'');
  } catch (e) {
    return e;
  }
});

exports.checkEmailWithCode = functions.https.onCall(async (data, context) => {
  try {
    const userId = context.auth.uid;
    const userCodeDoc = await getDataFromDatabase('usersConfirmation',userId);
    const userCode = userCodeDoc.data();
    if (userCode.attemps < 9) {
      await updateOrCreateDataToDatabase('usersConfirmation', {uid: userId, attemps: userCode.attemps + 1})
      if (data.code === userCode.code && userCode.method === 'email') {
        await updateOrCreateDataToDatabase('users', {uid: userId, userConfirmed: true});
        await updateOrCreateDataToDatabase('usersConfirmation', {uid: userId, email: {confirmed: true, date: getCurrentDate()}, attemps: 0});
        return {response: 'Los codigos coinciden'};
      } else {
        return {error: 'Los codigos no coinciden o el metodo seleccionado no es correcto'};
      }
    } else if (userCode.attemps >= 9 && userCode.attemps < 20) {
      await updateOrCreateDataToDatabase('usersConfirmation', {uid: userId, attemps: userCode.attemps + 1})
      return {
        error: 'Demasiados intentos'
      };
    } else if (userCode.attemps === 20) {
      await admin.auth().deleteUser(userId);
      return {error: 'Demasiados intentos, usuario eliminado'};
    } else {
      return {
        error: "No se ha completado ninguna acción"
      };
    }
  } catch (err) {
    return {
      info: err,
      error: "No se cual es el error"
    };
  }
});

/* Roles Functions */

exports.addAdmin = functions.https.onCall((data,context) => {
  // TODO: Comprovar funcio
  if (context.auth.token.developer !== true) {
    return {
      error: 'Peticion no autorizada. El usuario debe ser Developer para hacer a alguien Admin.'
    };
  }
  const email = data.email;
  return grandAdminRole(email).then(() => {
    return {
      result: '${email} es ahora Admin'
    };
  });
});

exports.addDeveloper = functions.https.onCall((data,context) => {
  // TODO: fer funció completa
  if (context.auth.token.developer !== true) {
    return {
      error: 'Peticion no autorizada. El usuario debe ser Developer para hacer a alguien Admin.'
    };
  }
  const email = data.email;
  return grandDeveloperRole(email).then(() => {
    return {
      result: '${email} es ahora Admin'
    };
  });
});

exports.addPromotor = functions.https.onCall((data,context) => {
  if (context.auth.token.admin !== true) {
    return {
      error: 'Peticion no autorizada. El usuario debe ser Admin para hacer a alguien Promotor'
    };
  }
  const email = data.email;
  return grandAdminRole(email).then(() => {
    return {
      result: '${email} es ahora Promotor'
    };
  });
});

/* User creation */

exports.createUserWithData = functions.auth.user().onCreate(async function(user,context){
  try {
    const permisions: Roles = {
      admin: true,
      developer: true,
      premium: true,
      promotor: true
    };
    const userData: User = {
      uid: user.uid,
      email: user.email,
      userConfirmed: user.emailVerified,
      referalNumber: 0,
      roles: permisions,
      referalString: user.uid
    };
    await admin.auth().setCustomUserClaims(user.uid, permisions);
    await setDataToDatabase('usersReferal',{uid: userData.referalString, userId: userData.uid});
    await setDataToDatabase('usersInformation', {uid: user.uid});
    await setDataToDatabase('users', userData);

    await updateUserStats(permisions);

    return "USER CREATED";
  } catch (e) {
    return e;
  }
});

exports.deleteUserInformation = functions.auth.user().onDelete(async function(user,context){
  try {
    await admin.firestore().doc(`users/${user.uid}`).delete();
  } catch(err) {
    return err;
  }
});

/* Stripe subscription */

// TODO: simplificar funcions startSubscriptionStripe i Add Stripe to user (intentar ajuntar-les) i canviar les funcions perque s'adaptin a la nova manera de gestionar les dades

exports.startSubscriptionStripe = functions.https.onCall(async (data, context) => {
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

exports.addStripeIdToUser = functions.https.onCall(async (data,context) => {
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

exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  // TODO: fer aquesta funcio que funcioni
  try {
    switch(data.type) {
      case 'stripe':
        const userId = context.auth.uid;
        const userDoc = await getDataFromDatabase('users',userId);

        console.log(userId);

        const user = userDoc.data();

        await stripe.subscriptions.update(user.subscription.stripe.subscriptionId, {cancel_at_period_end: true});
        await admin.firestore().doc(`users/${userId}`).update({'subscription/renovable': false});
        console.log('funciona fins aqui');
        return {
          response: userId + ' => se ha anulado la subscripcion'
        };
      default:
        return {
          error: "No se ha podido completar"
        };
    }
  } catch (e) {
    return {
      error: e
    };
  }

});

exports.continueSubscription = functions.https.onCall(async (data, context) => {
  // TODO: fer aquesta funcio que funcioni
  try {
    switch(data.type) {
      case 'stripe':
        const userId = context.auth.uid;
        const userDoc = await getDataFromDatabase('users',userId);

        console.log(userId);

        const user = userDoc.data();

        await stripe.subscriptions.update(user.subscription.stripe.subscriptionId, {cancel_at_period_end: false});
        await admin.firestore().doc(`users/${userId}`).update({'subscription/renovable': true});
        console.log('funciona fins aqui');
        return {
          response: userId + ' => se ha reactivado la subscripcion'
        };
      default:
        return {
          error: "No se ha podido completar"
        };
    }
  } catch (e) {
    return {
      error: e.error
    };
  }
});

exports.recurringPayment = functions.https.onRequest(async (req, res) => {
  try {
    const hook  = req.body.type;
    const data  = req.body.data.object;

    console.log('recurringPayment');

    console.log(data);

    if (!data) throw new Error('missing data')

    if (hook === 'invoice.payment_succeeded') {
      await db.doc(`users/${data.customer}`).update({'roles/premium': true});
      await db.doc(`users/${data.customer}`).update({'subscription/status': 'active'});
    }

    if (hook === 'invoice.payment_failed') {
      await db.doc(`users/${data.customer}`).update({'roles/premium': false});
      await db.doc(`users/${data.customer}`).update({'subscription/status': 'pastDue'});
    }

    return res.status(200).send(`successfully handled ${hook}`)
  } catch (e) {
    return res.status(400).send(`error handling ${req.body.type}`)
  }
});

/* Referal functions */

exports.changeReferalString = functions.https.onCall(async (data, context) => {
  try {
    const userUid = context.auth.uid;
    const user = await admin.firestore().doc("users/" + userUid).get();
    const userData = user.data();
    const oldUid = userData.referalString;
    const userReferal = await admin.firestore().doc("usersReferal/" + user.data().referalString).get();
    const userReferalData = userReferal.data();
    await admin.firestore().doc("usersReferal/" + data.newUid).set(userReferalData);
    const snapshot = await admin.firestore().doc("usersReferal/" + oldUid).collection('referals').get();
    if (snapshot) {
      snapshot.forEach(async doc => {
        const dataEach = doc.data();

        console.log(dataEach);
        await admin.firestore().doc("usersReferal/" + dataEach.newUid.uid).collection('referals').doc(doc.data().uid).set(doc.data())
      })
    }
  } catch (e) {
    console.error(e)
  }
});

exports.addReferal = functions.https.onCall(async (dataDefined, context) => {
  try {
    const currentUser = context.auth.uid;

    if (dataDefined.referal) {
      const referal = dataDefined.referalUid;
      const userData = await admin.firestore().doc(`usersReferal/${referal}`).get();
      const data = userData.data();

      /* Add referal data to refered user (user => referal user) */
      await admin.firestore().doc(`users/${currentUser}`).update({
        isReferal: true, referal: data.userId
      });

      /* Add refered user information to referal user (user <= referal user) */
      const user = await admin.firestore().doc(`users/${data.userId}`).get();
      const referals = user.data().referalNumber + 1;
      await user.ref.update({referalNumber: referals});

      /* Add refered user information to referal user (userReferal <= user <= referal user) */
      await admin.firestore().doc(`usersReferal/${data.userId}`);
      await userData.ref.update({
        number: data.number || 1,
        numberPremium: user.data().roles.premium ? (data.numberPremium || 1) : 0
      });
      await admin.firestore().collection(`usersReferal`).doc(data.userId).collection('referals').doc(currentUser).create({
        uid: currentUser,
        premium: user.data().roles.premium,
        admin: user.data().roles.admin
      });

    } else {
      await admin.firestore().doc(`users/${currentUser}`).update({
        isReferal: false
      });
    }
  } catch (e) {
    console.error(e);
    return e;
  }
});
