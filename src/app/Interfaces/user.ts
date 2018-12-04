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
  userConfirmed?: boolean;
  userConfirmationCode?: number;
  userConfirmationMethod?: string;
  name?: string;
  surname?: string;
  phone?: string;
  phoneNumber?: number;
  prefix?: number;
  nationality?: string;
  idCard?: string;
  birthDate?: Date;
}
