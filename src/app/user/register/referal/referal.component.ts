import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserInformation} from '../../../Interfaces/user';

@Component({
  selector: 'app-referal',
  templateUrl: './referal.component.html',
  styleUrls: ['./referal.component.scss']
})
export class ReferalComponent implements OnInit {

  referalForm: FormGroup;
  loading = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private fun: AngularFireFunctions,
              private fbs: AngularFirestore) {

  }

  ngOnInit() {
    this.referalForm = this.fb.group({
      'referalCode': ['', [
        Validators.required
      ]]
    });
    this.auth.user.subscribe((user) => {
      if (user && user.uid) {
        this.fbs.doc(`usersInformation/${user.uid}`).valueChanges().subscribe((usersInformation: UserInformation) => {
          if (user.name && user.surname && user.phone && usersInformation.nationality && usersInformation.birthDate) {
            if (user.userConfirmed) {
              if (user.isReferal || user.isReferal === false) {
                this.router.navigate(['user/subscription']);
              }
            } else {
              this.router.navigate(['register/confirmation']);
            }
          } else {
            this.router.navigate(['register/information']);
          }
        });
      } else {
        this.router.navigate(['register']);
      }
    });
  }

  get referal() { return this.referalForm.get('referalCode').value; }

  sendReferal() {
    this.loading = true;
    let isReferal = false;
    if (this.referal) {
      isReferal = true;
    }
    this.fun.httpsCallable('addReferal')({
      referal: isReferal,
      referalUid: this.referal,
    }).toPromise().then(() => {
      this.loading = false;
    }).catch(err => {
      console.log(err);
      this.loading = false;
    });
  }
}
