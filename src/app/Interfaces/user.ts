export interface Roles {
  premium?: boolean;
  developer?: boolean;
  admin?: boolean;
  promotor?: boolean;
}

export interface Subscriptions {
  stripe?: {
    stripeId?: string;
    subscriptionId?: string;
    itemId?: string;
  };
  start?: Date;
  discount?: number;
  discountType?: string;
}

export interface User {
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
  };
}

export interface UserInformation {
  uid: string;
  userConfirmationMethod?: string;
  phoneNumber?: number;
  prefix?: number;
  nationality?: string;
  idCard?: string;
  birthDate?: Date;
  imageUrl?: string;
}

export interface UserAddress {
  uid: string;
  currentAddress: string;
  currentCity: string;
  currentZipcode: string;
  currentCountry: string;
}

export interface UserConfirmation {
  uid: string;
  method: string;
}
