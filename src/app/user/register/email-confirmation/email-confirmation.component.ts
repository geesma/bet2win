import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseFunctionsService } from 'src/app/core/services/firebase-functions.service';
import { User } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  emailCodeForm: FormGroup;
  processEmailVerification = false;
  codeConfirmationProcess = false;
  codeConfirmationError = false;
  resendEmail = false;
  errorMessage = '';
  loaded = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private functions: FirebaseFunctionsService) {
  }

  ngOnInit() {
    this.emailCodeForm = this.fb.group({
      'code': ['', [
        Validators.pattern('^[0-9]{6,6}$'),
        Validators.required
      ]]
    });
    this.auth.user.subscribe((user) => {
      if (user) {
        if (user.name && user.surname && user.phone && user.nationality && user.birthDate) {
          if (user.userConfirmed) {
            if (user.isReferal || user.isReferal === false) {
              this.router.navigate(['user/subscription']);
            } else {
              this.router.navigate(['register/referal']);
            }
          }
        } else {
          this.router.navigate(['register/information']);
        }
      } else {
        this.router.navigate(['register']);
      }
    });
  }

  nextStepInputCode(uid: string) {
    this.processEmailVerification = true;
    this.sendEmail(uid);
  }

  get code() {return this.emailCodeForm.get('code').value; }

  sendCode() {
    this.codeConfirmationProcess = true;
    const params = {
      code: this.code
    };
    this.functions.checkCode(params).then((data) => {
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

  sendAnotherEmail(uid: string) {
    this.resendEmail = true;
    this.errorMessage = '';
    const user: User = {
      email: '',
      uid: uid
    };
    this.functions.sendVoid(user);
    this.resendEmail = false;
  }

  private sendEmail(uid: string) {
    const user: User = {
      email: '',
      uid: uid
    };
    this.functions.sendEmail(user);
  }

}
