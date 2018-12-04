import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFunctionsService {

  private url: string = "https://us-central1-test-8f9b5.cloudfunctions.net/";
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

  constructor(private http: HttpClient,
              private auth: AuthService,
              private fns: AngularFireFunctions,) { }

  sendEmail(params: any, user: User) {
    this.auth.updateUser(user, {userConfirmationMethod: "email"})
    this.send("sendEmail", params).toPromise().catch((err) => console.error(err))
  }

  private send(uri: string, params: any) {
    return this.http.post(this.url+uri, params, {headers: this.headers})
  }
}
