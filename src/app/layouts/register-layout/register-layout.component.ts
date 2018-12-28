import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {UserInformation} from '../../Interfaces/user';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-register-layout',
  templateUrl: './register-layout.component.html',
  styleUrls: ['./register-layout.component.scss']
})
export class RegisterLayoutComponent implements OnInit {

  hasReferalUrl: boolean;
  isUserConfirmed: boolean;
  step = 1;

  constructor(public auth: AuthService, private router: Router, route: ActivatedRoute, private fbs: AngularFirestore) {
    if (route.snapshot.children[0].params.referalString) {
      this.hasReferalUrl = true;
    }
  }

  ngOnInit() {
    this.auth.user.subscribe((user) => {
      if (user) {
        if (user.uid) {
          this.step = 2;
          this.fbs.doc(`usersInformation/${user.uid}`).valueChanges().subscribe((userInformation: UserInformation) => {
            if (user.userConfirmed && !userInformation.userConfirmationMethod) {
              this.isUserConfirmed = user.userConfirmed;
            }
            if (user.name && user.surname && user.phone && userInformation.nationality && userInformation.birthDate) {
              this.step = 3;
              if (user.userConfirmed) {
                this.step = 4;
              } else if (user.isReferal || user.isReferal === false) {
                this.hasReferalUrl = true;
              }
            } else if (user.isReferal || user.isReferal === false) {
              this.hasReferalUrl = true;
            }
          });
        }
      } else {
        this.step = 1;
      }
    });
  }

}
