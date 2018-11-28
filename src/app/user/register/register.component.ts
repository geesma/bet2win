import { Component, OnInit } from '@angular/core';
import { RegistrationValidator } from '../../core/validators/registration.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { moveIn, fallIn } from '../../router.animations';


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

  constructor(public fb: FormBuilder) {
    //console.log(auth.isLoggedIn())
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

    this.detailForm = this.fb.group({
      'name': ['', [Validators.required]],
      'surname': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
      'prefix': ['', [Validators.required]],
      'nationality': ['', [Validators.required]],
      'idCard': ['', []],
      'birthDate': ['', [Validators.required]]
    });
  }

  isSignUpFormValid() {
    return this.signupForm.valid && this.passwordFormGroup.valid
  }

  // get email() { return this.signupForm.get('email') }
  // get password() { return this.passwordFormGroup.get('password') }

  signUp() {
    const email = this.signupForm.get('email');
    const password = this.passwordFormGroup.get('password');
    console.log({email: email.value,pass: password.value})
    // return this.auth.registerUser(this.email.value, this.password.value)
  }

}
