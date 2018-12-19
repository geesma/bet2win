export interface Roles {
  premium?: boolean;
  developer?: boolean;
  admin?: boolean;
  promotor?: boolean;
}
//
// export interface SubscriptionTypes {
//   name?: string;
//   price?: number;
//   autoUpdate?: boolean;
//   remaining?: number;
//   platform?: platformsTypes;
// }
//
export interface Subscriptions {
  type: string,
  stripe?: {
    stripeId?: string,
    subscriptionId?: string,
    status?: string,
    itemId?: string
  }
}

export interface User {
  uid: string;
  email: string;
  userConfirmed?: boolean;
  userConfirmationMethod?: string;
  name?: string;
  surname?: string;
  phone?: string;
  phoneNumber?: number;
  prefix?: number;
  nationality?: string;
  idCard?: string;
  birthDate?: Date;
  referalNumber?: number;
  isReferal?: boolean;
  referal?: string;
  roles?: Roles;
  billingAddress?: {
    currentAddress: string;
    currentCity: string;
    currentZipcode: string;
    currentCountry: string;
  },
  subscription?: Subscriptions
}
