// export interface Roles {
//   premium?: boolean;
//   developer?: boolean;
//   admin?: boolean;
// }
//
// export interface platformsTypes {
//   name: string,
//   extraPrice: number,
//   avaliable: boolean
// }
//
// export interface SubscriptionTypes {
//   name?: string;
//   price?: number;
//   autoUpdate?: boolean;
//   remaining?: number;
//   platform?: platformsTypes;
// }
//
// export interface Subscriptions {
//   active?: boolean;
//   start?: Date;
//   end?: Date;
//   price?: number;
//   type?: SubscriptionTypes;
// }

export interface User {
  uid: string;
  email: string;
  userConfirmed: boolean;
  name?: string;
  surname?: string;
  phone?: number;
  phoneNumber?: number;
  prefix?: number;
  nationality?: string;
  idCard?: string;
  birthDate?: Date;
}

//   {
//     uid: user.uid,
//     email: user.email,
//     name: user.name || null,
//     surname: user.surname || null,
//     phone: user.phone || null,
//     prefix: user.prefix || null,
//     nationality: user.nationality || null,
//     idCard: user.idCard || null,
//     birthDate: user.birthDate || null,
//     emailConfirmed: user.emailConfirmed || false,
//     roles: user.roles || {
//       premium: true,
//       developer: true,
//       admin: true,
//     },
//     subscriptions: user.subscriptions || {
//       active: false,
//       start: null,
//       end: null,
//       price: null,
//       type: {
//         name: null,
//         price: null,
//         autoUpdate: null,
//         remaining: null,
//         platform: {
//           name: null,
//           extraPrice: null,
//           avaliable: false
//         }
//       },
//     }
//   }
