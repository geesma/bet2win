export interface IUser {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  loading?: boolean;
  error?: string;
}

export class User implements IUser {
  constructor(public uid: string, public displayName: string, public email: string, public emailVerified: boolean) {}
}
