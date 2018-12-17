import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../Interfaces/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: User;
  showSpiner: boolean = false;

  constructor(public fb: FormBuilder, public auth: AuthService, private router: Router) {}

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
      ],
      'remember': ['true', []]
    });
    this.auth.user.subscribe((user) => {
      if(user) {
        this.router.navigate(['/register']);
      }
    })

  }

  get email() {return this.loginForm.get('email').value}
  get password() {return this.loginForm.get('password').value}
  get remember() {return this.loginForm.get('remember').value}

  loginEmail() {
    this.showSpiner = true
    this.auth.loginUser(this.email,this.password, this.remember)
    this.showSpiner = false
  }

  loginGoogle() {
    this.auth.loginGoogle();
  }

  loginFacebook() {
    this.auth.loginFacebook();
  }
}
