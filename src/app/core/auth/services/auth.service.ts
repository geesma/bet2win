import { Injectable } from '@angular/core';
import { NotifyService } from './../../notifiers/notify.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../Interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private notify: NotifyService,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        }));
  }

  async registerUser(email: string, password: string) {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.handleSuccess('Bienvenido ' + user.user.email);
      this.router.navigate(['register']);
    } catch (error) {
      return this.handleError(error);
    }
  }

  loginUser(email: string, password: string, remember: boolean) {
    if (remember) {
      this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.emailPasswordUserLogin(email, password);
      }).catch((err) => {
        this.handleError(err);
      });
    } else {
      this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        this.emailPasswordUserLogin(email, password);
      }).catch((err) => {
        this.handleError(err);
      });
    }
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  logout() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['/'])).then(() => {
      this.notify.update('Hasta pronto', 'success');
    });
  }

  loginFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private handleError(error) {
    this.notify.update(error.message, 'danger');
  }

  private handleSuccess(message) {
    this.notify.update(message, 'primary');
  }

  private oAuthLogin(provider) {
    this.afAuth.auth.signInWithPopup(provider).then((user) => {
      this.handleSuccess('Bienvenido ' + user.user.email);
      this.router.navigate(['register']);
    }).catch((err) => {
      return this.handleError(err);
    });
  }

  private emailPasswordUserLogin(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(userdata => {
      this.router.navigate(['register']);
      this.handleSuccess('Bienvenido ' + userdata.user.email);
    }).catch((err) => {
      this.handleError(err);
    });
  }

  updateUser(user: User, data: any) {
    console.log('here');
    return this.afs.doc(`users/${user.uid}`).update(data);
  }

  updateUserInformation(user: User, data: any) {
    console.log('here' + data);
    return this.afs.doc(`usersInformation/${user.uid}`).update(data);
  }

  updateUserAddress(user: User, data: any) {
    return this.afs.doc(`usersAddress/${user.uid}`).set(data).catch(() => {
      this.afs.doc(`usersAddress/${user.uid}`).update(data);
    });
  }

  ///// Role-based Authorization //////

  canEdit(user: User): boolean {
    const allowed = ['admin', 'developer'];
    return this.checkAuthorization(user, allowed);
  }

  canEditDev(user: User): boolean {
    const allowed = ['developer'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin', 'developer'];
    return this.checkAuthorization(user, allowed);
  }

  canDeleteDev(user: User): boolean {
    const allowed = ['developer'];
    return this.checkAuthorization(user, allowed);
  }

  isPremium(user: User): boolean {
    const allowed = ['premium'];
    return this.checkAuthorization(user, allowed);
  }

  isAdmin(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  isPromotor(user: User): boolean {
    const allowed = ['premium'];
    return this.checkAuthorization(user, allowed);
  }

  isDeveloper(user: User): boolean {
    const allowed = ['developer'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true;
      }
    }
    return false;
  }
}
