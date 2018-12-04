import { Component, OnInit } from '@angular/core';
import { RegistrationValidator } from '../../core/validators/registration.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { moveIn, fallIn } from '../../router.animations';
import { User } from '../../Interfaces/user';
import { Router } from '@angular/router';
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
  user: User;
  processVerification: boolean = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private router: Router,
              private functions: FirebaseFunctionsService) {
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

    this.auth.user.subscribe((user) => {
      if(user) {
        this.buidDetailForm(user)
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
    return this.auth.updateUser(user, {
      name: this.name,
      surname: this.surname,
      phone: this.setPhoneNumber(),
      phoneNumber: this.phone,
      prefix: this.prefix,
      nationality: this.nationality,
      idCard: this.idCard || null,
      birthDate: this.birthDate,
    })
  }

  nextStepInputCode() {
    this.processVerification = true;
    this.buidEmailCodeForm()
  }

  get code(){return this.emailCodeForm.get('code').value}

  sendCode() {
    console.log(this.code)
    this.sendEmail()
  }

  private buidDetailForm(data: User) {
    this.detailForm = this.fb.group({
      'name': [data.name || '', [Validators.required]],
      'surname': [data.surname || '', [Validators.required]],
      'phone': [data.phone || '', [Validators.required]],
      'prefix': [data.prefix || '', [Validators.required]],
      'nationality': [data.nationality || '', [Validators.required]],
      'idCard': [data.idCard || '',[]],
      'birthDate': [data.birthDate || '', [Validators.required]]
    });
  }

  private buidEmailCodeForm() {
    this.emailCodeForm = this.fb.group({
      'code': ['', [
        Validators.pattern('^[0-9]{6,6}$'),
        Validators.required
      ]]
    })
  }

  private sendEmail() {
    this.auth.user.subscribe((user) => {
      let params = {
        name: user.name,
        email: user.email,
        uid: user.uid,
        url: "localhost:4200/users/register"
      }
      return this.functions.sendEmail(params, user)
    })
  }

}
