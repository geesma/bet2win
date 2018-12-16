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
  step: number;

  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) {
    if(this.route.snapshot.params.referalString) {
      this.hasReferalUrl = true;
    }
  }

  ngOnInit() {
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

}
