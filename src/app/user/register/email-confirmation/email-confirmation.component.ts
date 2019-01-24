import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {User, UserConfirmation, UserInformation} from 'src/app/Interfaces/user';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  emailCodeForm: FormGroup;
  codeUrl: string;
  hasCodeUrl = false;
  confirmation;
  processEmailVerification = false;
  codeConfirmationProcess = false;
  codeConfirmationError = false;
  errorMessage = '';

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private fun: AngularFireFunctions,
              private fbs: AngularFirestore) {
    if (this.route.snapshot.params.code) {
      this.hasCodeUrl = true;
      this.sendCode(this.route.snapshot.params.code);
    }
  }

  ngOnInit() {
    this.emailCodeForm = this.fb.group({
      'code': [this.hasCodeUrl ? this.route.snapshot.params.code : '', [
        Validators.pattern('^[0-9]{6,6}$'),
        Validators.required
      ]]
    });
    this.auth.user.subscribe((user) => {
      if (user) {
        if (user.uid) {
          this.fbs.doc(`usersInformation/${user.uid}`).valueChanges().subscribe((usersInformation: UserInformation) => {
            if (user.name && user.surname && user.phone && usersInformation.nationality && usersInformation.birthDate) {
              if (user.userConfirmed) {
                if (user.isReferal || user.isReferal === false) {
                  this.router.navigate(['user/subscription']);
                } else {
                  this.router.navigate(['register/referal']);
                }
              } else {
                this.confirmation = this.fbs.doc(`usersConfirmation/${user.uid}`).valueChanges();
              }
            } else {
              this.router.navigate(['register/information']);
            }
          });
        }
      } else {
        this.router.navigate(['register']);
      }
    });
  }

  nextStepInputCode() {
    this.sendEmail();
  }

  get code() {return this.emailCodeForm.get('code').value; }

  sendCode(_code) {
    let codeIn;
    if (_code) {
      codeIn = _code;
    } else {
      codeIn = this.code;
    }
    this.codeConfirmationProcess = true;
    this.fun.httpsCallable('checkEmailWithCode')({code: codeIn}).toPromise().then((data) => {
      if (data.result) {
        this.codeConfirmationError = false;
        this.processEmailVerification = false;
      } else {
        this.errorMessage = data.error;
        this.codeConfirmationError = true;
      }
    }).then(() => {
      this.codeConfirmationProcess = false;
    });
  }

  sendAnotherEmail() {
    this.sendEmail();
  }

  private sendEmail() {
    this.processEmailVerification = true;
    this.fun.httpsCallable('sendEmailWithCode')({}).toPromise().then(() => {
      this.processEmailVerification = false;
    }).catch(() => {
      this.processEmailVerification = false;
    });
  }

}
