import { Component, OnInit } from '@angular/core';
import { RegistrationValidator } from '../../core/validators/registration.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { moveIn, fallIn } from '../../router.animations';
import { User } from '../../Interfaces/user';

import { Store } from '@ngrx/store';
import * as fromAuth from '../../core/reducers/reducers';
import * as userActions from '../../core/auth/actions/auth.action';

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
  user: User;

  constructor(public fb: FormBuilder, private store: Store<fromAuth.State>) {
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

  signUp() {
    this.user = {
      email: this.signupForm.get('email').value,
      password: this.passwordFormGroup.get('password').value
    }

    this.store.dispatch(new userActions.SignUpEmail(this.user))
  }

}
