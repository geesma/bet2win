import { Action } from '@ngrx/store';
import { User } from '../models/user';

export enum AuthActionTypes {
  GET_USER = '[Auth] Get User',
  AUTHENTICATED = '[Auth] Authenticated',
  NOT_AUTHENTICATED = '[Auth] Not Authenticated',
  EMAIL_LOGIN = '[Auth] Email and Password Attempt',
  GOOGLE_LOGIN = '[Auth] Google Login Attempt',
  FACEBOOK_LOGIN = '[Auth] Facebook Login Attempt',
  LOGOUT = '[Auth] Logout',
  AUTH_ERROR = '[Auth] Auth Error',
  SIGN_UP_EMAIL = '[Auth] SignUp Email Attempt',
}

export class GetUser implements Action {
  readonly type = AuthActionTypes.GET_USER;
  constructor (public payload?: any) {}
}

export class Authenticated implements Action {
  readonly type = AuthActionTypes.AUTHENTICATED;
  constructor(public payload?: any) {}
}

export class NotAuthenticated implements Action {
  readonly type = AuthActionTypes.NOT_AUTHENTICATED;
  constructor(public payload?: any) {}
}

export class AuthError implements Action {
  readonly type = AuthActionTypes.AUTH_ERROR;
  constructor(public payload?: any) {}
}

/// Email and Password Login Actions

export class EmailLogin implements Action {
  readonly type = AuthActionTypes.EMAIL_LOGIN;
  constructor(public payload: {email: string, password: string}) {}
}

/// Google Login Actions

export class GoogleLogin implements Action {
  readonly type = AuthActionTypes.GOOGLE_LOGIN;
  constructor(public payload?: any) {}
}

/// Facebook Login Actions

export class FacebookLogin implements Action {
  readonly type = AuthActionTypes.FACEBOOK_LOGIN;
  constructor(public payload?: any) {}
}

/// Email and Password SignUp Actions

export class SignUpEmail implements Action {
  readonly type = AuthActionTypes.SIGN_UP_EMAIL;
  constructor(public payload: {email: string, password: string}) {}
}

/// Logout Actions

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
  constructor(public payload?: any) {}
}

export type All
= GetUser
| Authenticated
| NotAuthenticated
| EmailLogin
| GoogleLogin
| FacebookLogin
| SignUpEmail
| AuthError
| Logout;
