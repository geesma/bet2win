import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
})
export class UserHomePageComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, private afAuth: AngularFireAuth, private fun: AngularFireFunctions) {}

  cancelSubscription(type: string) {
    this.fun.httpsCallable('cancelSubscription')({type: type}).toPromise().then((response) => console.log(response) );
  }

  continueSubscription(type: string) {
    this.fun.httpsCallable('continueSubscription')({type: type}).toPromise();
  }

  ngOnInit() {}

  logout() {
    this.afAuth.auth.signOut();
  }

}
