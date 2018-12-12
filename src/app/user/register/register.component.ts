import { Component, OnInit } from '@angular/core';
import { RegistrationValidator } from '../../core/validators/registration.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { moveIn, fallIn } from '../../router.animations';
import { User } from '../../Interfaces/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FirebaseFunctionsService } from 'src/app/core/services/firebase-functions.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  //animations: [moveIn(), fallIn()]
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  passwordFormGroup: FormGroup;
  detailForm: FormGroup;
  emailCodeForm: FormGroup;
  referalForm: FormGroup;
  user: User;
  currentUser: User;
  processEmailVerification: boolean = false;
  codeConfirmationProcess: boolean = false;
  codeConfirmationError: boolean = false;
  resendEmail: boolean = false;
  errorMessage: string = "";
  referalStringUrl: string;
  hasReferalUrl: boolean = false;
  step = 1;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private functions: FirebaseFunctionsService) {
    if(this.route.snapshot.params.referalString) {
      this.referalStringUrl = this.route.snapshot.params.referalString
      this.hasReferalUrl = true;
    }
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
        ]
      ]
    });
    this.passwordFormGroup = this.fb.group({
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]],
      'repeatPassword': ['', Validators.required]
    }, {
      validator: RegistrationValidator.validate.bind(this)
    });

    this.emailCodeForm = this.fb.group({
      'code': ['', [
        Validators.pattern('^[0-9]{6,6}$'),
        Validators.required
      ]]
    })

    this.referalForm = this.fb.group({
      'referalCode': ['', [
        Validators.required
      ]]
    })

    this.auth.user.subscribe((user) => {
      if(user) {
        this.buidDetailForm(user)
      }
    })

    this.auth.user.subscribe((user) => {
      if(user) {
        this.step = 2
        if(user.name && user.surname && user.phone && user.nationality && user.birthDate) {
          this.step = 3
          if(user.userConfirmed) {
            this.step = 4
            if(user.isReferal || user.isReferal == false) {
              this.router.navigate(['/user/subscription']);
            }
          } else if (user.isReferal || user.isReferal == false) {
            this.hasReferalUrl = true
          }
        } else if (user.isReferal || user.isReferal == false) {
          this.hasReferalUrl = true
        }
      }
    })
  }

  isSignUpFormValid(): boolean {
    return this.signupForm.valid && this.passwordFormGroup.valid
  }

  get email() {return this.signupForm.get('email').value}
  get password() {return this.passwordFormGroup.get('password').value}

  signUp() {
    this.auth.registerUser(this.email, this.password)
  }

  isDetailFormValid(): boolean {
    return (
      this.detailForm.controls.name.valid &&
      this.detailForm.controls.surname.valid &&
      this.detailForm.controls.phone.valid &&
      this.detailForm.controls.prefix.valid &&
      this.detailForm.controls.nationality.valid &&
      this.detailForm.controls.birthDate.valid
    )
  }

  get name() {return this.detailForm.get('name').value}
  get surname() {return this.detailForm.get('surname').value}
  get prefix() {return this.detailForm.get('prefix').value}
  get phone() {return this.detailForm.get('phone').value}
  get nationality() {return this.detailForm.get('nationality').value}
  get idCard() {return this.detailForm.get('idCard').value}
  get birthDate(){return this.detailForm.get('birthDate').value}
  private setPhoneNumber() {return '+'+this.prefix + this.phone}

  setDetailsToUser(user: User) {
    if(this.hasReferalUrl) {
      this.auth.updateUser(user, {
        referal: this.referalStringUrl || null,
        isReferal: this.hasReferalUrl
      })
    }
    return this.auth.updateUser(user, {
      name: this.name,
      surname: this.surname,
      phone: this.setPhoneNumber(),
      phoneNumber: this.phone,
      prefix: this.prefix,
      nationality: this.nationality,
      idCard: this.idCard || null,
      birthDate: this.birthDate
    })
  }

  nextStepInputCode(uid: string) {
    this.processEmailVerification = true;
    this.sendEmail(uid)
  }

  get code(){return this.emailCodeForm.get('code').value}

  sendCode(uid: string) {
    this.codeConfirmationProcess = true;
    let params = {
      uid: uid,
      code: this.code
    }
    this.functions.checkCode(params).then(() => {
      this.codeConfirmationError = false;
      this.processEmailVerification = false
    }).catch((err) => {
      this.errorMessage = err.error.error
      this.codeConfirmationError = true
    }).then(()=> {
      this.codeConfirmationProcess = false;
    })
  }

  sendAnotherEmail(uid: string) {
    this.resendEmail = true;
    this.errorMessage = "";
    let user: User = {
      email: '',
      uid: uid,
      referalNumber: 0,
      referalString: uid
    }
    this.functions.sendVoid(user)
    this.resendEmail = false
  }

  get referal() {return this.emailCodeForm.get('referalCode').value}

  sendReferal(uid: string) {
    let user: User = {
      uid: uid,
      email: '',
      referal: this.referal,
      isReferal: true
    }
    this.functions.sendReferal(user)
  }

  passWithoutReferal(uid: string) {
    let user: User = {
      uid: uid,
      email: '',
      referal: '',
      isReferal: false
    }
    this.functions.sendReferal(user)
  }

  private buidDetailForm(data: User) {
    this.detailForm = this.fb.group({
      'name': [data.name || '', [Validators.required]],
      'surname': [data.surname || '', [Validators.required]],
      'phone': [data.phoneNumber || '', [Validators.required]],
      'prefix': [data.prefix || '', [Validators.required]],
      'nationality': [data.nationality || '', [Validators.required]],
      'idCard': [data.idCard || '',[]],
      'birthDate': [data.birthDate || '', [Validators.required]]
    });
  }

  private sendEmail(uid: string) {
    let user: User = {
      email: '',
      uid: uid,
      referalNumber: 0,
      referalString: uid
    }
    this.functions.sendEmail(user)
  }

}
