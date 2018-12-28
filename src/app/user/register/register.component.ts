import { Component, OnInit } from '@angular/core';
import { RegistrationValidator } from '../../core/validators/registration.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../Interfaces/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  passwordFormGroup: FormGroup;
  user: User;
  currentUser: User;
  showSpiner = true;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.showSpiner = false;
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
      if (user) {
        if (user.uid) {
          if (this.route.snapshot.params.referalString) {
            this.router.navigate(['/register/information/' + this.route.snapshot.params.referalString]);
          } else {
            this.router.navigate(['/register/information']);
          }
        }
      }
    });
  }

  isSignUpFormValid(): boolean {
    return this.signupForm.valid && this.passwordFormGroup.valid;
  }

  get email() {return this.signupForm.get('email').value; }
  get password() {return this.passwordFormGroup.get('password').value; }

  signUp() {
    this.showSpiner = true;
    this.auth.registerUser(this.email, this.password).catch(() => {
      this.showSpiner = false;
    });
  }

}
