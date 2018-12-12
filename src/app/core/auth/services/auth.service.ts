import { Injectable } from '@angular/core';
import { NotifyService } from './../../notifiers/notify.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../Interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

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
            // logged in, get custom user from Firestore
            this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe((userData) => {
              if(!userData.email){
                this.setUserDoc(user)
              }
            })
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            // logged out, null
            return of(null)
          }
        }))
  }

  registerUser(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.handleSuccess('Bienvenido ' + user.user.email);
        return this.setUserDoc(user.user) // create initial user document
      })
      .catch(error => this.handleError(error) );
  }

  loginUser(email: string, password: string, remember: boolean) {
    if(remember) {
      this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.emailPasswordUserLogin(email, password);
      }).catch((err) => {
        this.handleError(err)
      })
    } else {
      this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        this.emailPasswordUserLogin(email, password);
      }).catch((err) => {
        this.handleError(err)
      })
    }
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  logout() {
    this.afAuth.auth.signOut().then((res) => this.router.navigate(['/'])).then((res) => {
      this.notify.update('Hasta pronto', 'success');
    });
  }

  loginFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private handleError(error) {
    console.error(error)
    this.notify.update(error.message, 'danger')
  }

  private handleSuccess(message) {
    console.log(message);
    this.notify.update(message, 'success')
  }

  private oAuthLogin(provider) {
    this.afAuth.auth.signInWithPopup(provider).then((user) => {
      this.handleSuccess('Bienvenido ' + user.user.email)
      this.router.navigate(['/user/register']);
    }).catch((err) => {
      return this.handleError(err);
    });
  }

  private setUserDoc(user: firebase.User) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email
    }

    return userRef.update(data)

  }

  private emailPasswordUserLogin(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email,password).then(userdata => {
      this.router.navigate(['/user/register']);
      this.handleSuccess('Bienvenido ' + userdata.user.email)
    }).catch((err) => {
      this.handleError(err)
    })
  }

  updateUser(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data)
  }
}
