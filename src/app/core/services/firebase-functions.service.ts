import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { User } from 'src/app/Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFunctionsService {

  private url: string = "https://us-central1-test-8f9b5.cloudfunctions.net/";
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

  constructor(private http: HttpClient,
              private auth: AuthService) { }

  sendEmail(user: User) {
    this.auth.updateUser(user, {userConfirmationMethod: "email"}).catch(err => {
      console.log(err)
    })
  }

  sendVoid(user: User) {
    this.auth.updateUser(user, {userConfirmationMethod: ""}).catch(err => {
      console.log(err)
    })
  }

  sendRefera(user: User) {
    this.auth.updateUser(user, {referal: user.referal}).catch(err => {
      console.log(err)
    })
  }

  checkCode(params: any) {
    return this.send("checkEmailWithCode", params).toPromise()
  }

  private send(uri: string, params: any) {
    return this.http.post(this.url+uri, params, {headers: this.headers})
  }
}
