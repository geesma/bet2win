import { Component, OnInit } from '@angular/core';
//import { moveIn, fallIn, moveInLeft } from '../../router.animations';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { User } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  // animations: [moveIn(), fallIn(), moveInLeft()],
  // host: {'[@moveIn]': ''}
})
export class UserHomePageComponent implements OnInit {

  user$: Observable<User>;
  userAuth$: Observable<firebase.User>;

  constructor(public auth: AuthService, private router: Router, private afAuth: AngularFireAuth) {}

  logout() {
    this.afAuth.auth.signOut()
    //this.router.navigate(['/user/login']);
  }

  ngOnInit() {}

}
