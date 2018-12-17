import { Component, OnInit } from '@angular/core';
//import { moveIn, fallIn, moveInLeft } from '../../router.animations';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  // animations: [moveIn(), fallIn(), moveInLeft()],
  // host: {'[@moveIn]': ''}
})
export class UserHomePageComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, private afAuth: AngularFireAuth) {}

  logout() {
    this.afAuth.auth.signOut()
  }

  ngOnInit() {}

}
