import { Injectable } from '@angular/core';
import { NotifyService } from './../../notifiers/notify.service';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../../../Interfaces/user';

// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userFake: User = {
    email: 'gerard.em.94@me.com',
    password: 'Escolies94'
  }

  constructor(){}

  // fake login
  login(user: any): Observable<any> {
    let toSend = {
      isLoading: true,
      error: true,
      ...user
    }

    if (JSON.stringify(user) === JSON.stringify(this.userFake)) {
      toSend = {
        isLoading: false,
        error: false,
        ...user
      }
    }
    else {
      return throwError('Invalid username or password');
    }
    return of(toSend).pipe(delay(2000))
  }
  //   private afAuth: AngularFireAuth,
  //   private afs: AngularFirestore,
  //   private notify: NotifyService,
  //   private router: Router
  // ) {
  // }

  // registerUser(email: string, password: string) {
  //   this.afAuth.auth.createUserWithEmailAndPassword(email,password).then((userdata) => {
  //     this.handleSuccess('Bienvenido ' + userdata.user.email)
  //   }).catch((err) => {
  //     this.handleError(err)
  //   });
  // }
  //
  // loginUser(email: string, password: string) {
  //   this.afAuth.auth.signInWithEmailAndPassword(email,password).then(userdata => {
  //     this.handleSuccess('Bienvenido ' + userdata.user.email)
  //   }).catch((err) => {
  //     this.handleError(err)
  //   })
  // }
  //
  // isAuth() {
  //   return this.afAuth.authState.pipe(map(auth => auth));
  // }
  //
  // logout() {
  //   this.afAuth.auth.signOut().then((res) => this.router.navigate(['/'])).then((res) => {
  //     this.notify.update('Hasta pronto', 'success');
  //   });
  // }
  //
  // loginFacebook() {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }
  //
  //
  // loginGoogle() {
  //   const provider = new firebase.auth.GoogleAuthProvider()
  //   return this.oAuthLogin(provider);
  // }
  //
  // private handleError(error) {
  //   console.error(error)
  //   this.notify.update(error.message, 'danger')
  // }
  //
  // private handleSuccess(message) {
  //   console.log(message);
  //   this.notify.update(message, 'success')
  // }
  //
  // private oAuthLogin(provider) {
  //   this.afAuth.auth.signInWithPopup(provider).then((user) => {
  //     this.handleSuccess('Bienvenido ' + user.user.email)
  //     this.router.navigate(['/user/register']);
  //   }).catch((err) => {
  //     return this.handleError(err);
  //   });
  // }
  //
  // private setUserDoc(user) {
  //
  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
  //
  //   const data: User = {
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
  //
  //   return userRef.set(data)
  //
  // }
  //
  // private updateUserData(user: firebase.User) {
  //   return this.afs
  //     .doc(`users/${user.uid}`)
  //     .set({ uid: user.uid }, { merge: true });
  // }
}
