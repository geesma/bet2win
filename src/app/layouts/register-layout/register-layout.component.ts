import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-layout',
  templateUrl: './register-layout.component.html',
  styleUrls: ['./register-layout.component.scss']
})
export class RegisterLayoutComponent implements OnInit {

  hasReferalUrl:boolean;
  isUserConfirmed: boolean;
  step: number = 1;

  constructor(public auth: AuthService, private router: Router, route: ActivatedRoute) {
    if(route.snapshot.children[0].params.referalString) {
      this.hasReferalUrl = true;
    }
  }

  ngOnInit() {
    this.auth.user.subscribe((user) => {
      if(user) {
        this.step = 2
        if(user.userConfirmed) {
          this.isUserConfirmed = user.userConfirmed;
        }
        if(user.name && user.surname && user.phone && user.nationality && user.birthDate) {
          this.step = 3
          if(user.userConfirmed) {
            this.step = 4
            if(user.isReferal || user.isReferal == false) {
              this.router.navigate(['user/subscription']);
            }
          } else if (user.isReferal || user.isReferal == false) {
            this.hasReferalUrl = true
          }
        } else if (user.isReferal || user.isReferal == false) {
          this.hasReferalUrl = true
        }
      } else {
        this.step = 1
      }
    })
  }

}
