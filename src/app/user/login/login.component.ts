import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../Interfaces/user';
// import { moveIn } from '../../router.animations';

import { Store } from '@ngrx/store';
import * as fromAuth from '../../core/reducers/reducers';
import * as Auth from '../../core/auth/actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // animations: [moveIn()]
  // host: {'[@moveIn]': ''}
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: User;

  error$ = this.store.select(fromAuth.getAuthError);
  isLoading$ = this.store.select(fromAuth.getAuthLoading);

  constructor(public fb: FormBuilder, private store: Store<fromAuth.State>) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
        ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ]
      ]
    });

  }

  login() {

    this.user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }

    this.store.dispatch(new Auth.LoginUser({
      user: this.user
    }))

  }
}
