import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { User } from '../models/user';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as userActions from '../actions/auth.action';

import { NotifyService } from './../../notifiers/notify.service';

export type Action = userActions.All;

@Injectable({
  providedIn: 'root'
})
export class UserEffects {

    constructor(private actions: Actions, private afAuth: AngularFireAuth, private notify: NotifyService) {}

    @Effect()
    getUser: Observable<Action> = this.actions.ofType(userActions.AuthActionTypes.GET_USER)
    .pipe(
      map((action: userActions.GetUser) => action.payload),
      switchMap(payload => this.afAuth.authState),
      map( authData => {
        if (authData) {
          const user = new User(authData.uid, authData.displayName, authData.email, authData.emailVerified);
          console.log(authData)
          return new userActions.Authenticated(user);
        } else {
          return new userActions.NotAuthenticated();
        }
      }),
      catchError (err => of(new userActions.AuthError()))
      );

      @Effect()
      loginGoogle: Observable<Action> = this.actions.ofType(userActions.AuthActionTypes.GOOGLE_LOGIN)
        .pipe(
          map((action: userActions.GoogleLogin) => action.payload),
          switchMap(payload => {
            return from (this.googleLogin());
          }),
          map(credential => {
            return new userActions.GetUser();
          }),
          catchError(err => {
            return of(new userActions.AuthError({error: err.message}));
          })
        );

      @Effect()
      loginFacebook: Observable<Action> = this.actions.ofType(userActions.AuthActionTypes.FACEBOOK_LOGIN)
        .pipe(
          map((action: userActions.FacebookLogin) => action.payload),
          switchMap(payload => {
            return from (this.facebookLogin());
          }),
          map(credential => {
            return new userActions.GetUser();
          }),
          catchError(err => {
            return of(new userActions.AuthError({error: err.message}));
          })
        );

      @Effect()
      signUpEmail: Observable<Action> = this.actions.ofType(userActions.AuthActionTypes.SIGN_UP_EMAIL)
        .pipe(
          map((action: userActions.SignUpEmail) => action.payload),
          switchMap(payload => {
            return from(this.emailSignUp(payload.email,payload.password).catch((err) => {
              this.notify.update("No se ha podido crear la cuenta, puede ser que el email introducido ya tenga una cuenta", 'danger');
              return of(new userActions.AuthError({error: err.message}));
            }));
          }),
          map(credential => {
            return new userActions.GetUser();
          })
        );

      @Effect()
      loginEmail: Observable<Action> = this.actions.ofType(userActions.AuthActionTypes.EMAIL_LOGIN)
        .pipe(
          map((action: userActions.EmailLogin) => action.payload),
          switchMap(payload => {
            return from(this.emailLogin(payload.email,payload.password).catch((err) => {
              this.notify.update("Email o contraseña incorrectos", 'danger');
              return of(new userActions.AuthError({error: err.message}));
            }));
          }),
          map(credential => {
            return new userActions.GetUser();
          })
        );

      private googleLogin(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.afAuth.auth.signInWithPopup(provider);
      }

      private facebookLogin(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.afAuth.auth.signInWithPopup(provider);
      }

      private emailLogin(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      }

      private emailSignUp(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      }

     @Effect()
      Logout: Observable<Action> = this.actions.ofType(userActions.AuthActionTypes.LOGOUT)
        .pipe(
          map((action: userActions.Logout) => action.payload),
          switchMap(payload => {
            return of(this.afAuth.auth.signOut());
          }),
          map( authData => {
            return new userActions.NotAuthenticated();
          }),
          catchError(err => {
            console.log('logout', err);
            return of(new userActions.AuthError({err: err.message}));
          })
        )
      ;
}
