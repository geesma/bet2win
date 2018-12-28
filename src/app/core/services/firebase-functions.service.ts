import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { AngularFireFunctions } from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class FirebaseFunctionsService {

  private url = 'https://us-central1-test-8f9b5.cloudfunctions.net/';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

  constructor(private http: HttpClient,
              private auth: AuthService,
              private fun: AngularFireFunctions) { }

  sendEmail(user: User) {
    this.auth.updateUser(user, {userConfirmationMethod: 'email'}).catch(err => {
      console.log(err);
    });
  }

  sendVoid(user: User) {
    this.auth.updateUser(user, {userConfirmationMethod: ''}).catch(err => {
      console.log(err);
    });
  }

  sendReferal(user: User) {
    this.auth.updateUser(user, {isReferal: user.isReferal, referal: user.referal}).catch(err => {
      console.log(err);
    });
  }

  checkCode(params: any) {
    return
  }
}
